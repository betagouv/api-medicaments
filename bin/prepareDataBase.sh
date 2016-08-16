#!/bin/bash

#set -e # exit if one command fails

host=$1
user=$2
password=$3
bucketNames=${4:-"medicaments medicamentsTests"}
elasticsearchHost=$5
elasticsearchBucket=$6

echo "host : $host"
echo "user : $user"
echo "password : $password"
echo "bucketNames : $bucketNames"
echo "elasticsearchHost : $elasticsearchHost"
echo "elasticsearchBucket : $elasticsearchBucket"

sleep 25;

couchbase-cli  cluster-init -c $host:8091 \
                  --user=$user \
                  --password=$password \
                  --services=data,index,query \
                  --cluster-username=$user \
                  --cluster-password=$password \
                  --cluster-ramsize=2048;

couchbase-cli  setting-cluster -c $host:8091 \
                --user=$user \
                --password=$password \
                --cluster-name=medicaments \
                --cluster-ramsize=2048;


for bucketName in $bucketNames
do
  bucketExists=$(couchbase-cli bucket-list -c localhost:8091 | grep $bucketName)
  if [ -z "$bucketExists" ]
  then
    couchbase-cli bucket-create -c $host:8091 \
            --user=$user \
            --password=$password \
            --bucket=$bucketName \
            --bucket-eviction-policy=fullEviction \
            --bucket-type=couchbase \
            --bucket-ramsize=512 \
            --bucket-priority=high \
            --bucket-replica=0 \
            --enable-flush=1 \
            --wait
  fi
done

if [ ! -z "$elasticsearchHost" ]
then
  echo 'creating xdcr cluster to replicate to elasticsearch'
  couchbase-cli xdcr-setup -c $host:8091 \
          --user=$user \
          --password=$password \
          --create \
          --xdcr-cluster-name=elasticsearch \
          --xdcr-hostname=$elasticsearchHost:9091 \
          --xdcr-username=$user \
          --xdcr-password=$password \
          --xdcr-demand-encryption=0

  echo 'wait for ES to start...'
  sleep 10
  echo 'create ES index...'
  curl -XPUT "http://$elasticsearchHost:9200/$elasticsearchBucket/" -d '{
      "settings" : {
          "index" : {
              "number_of_shards" : 1,
              "number_of_replicas" : 1
          }
      }
  }'

  echo 'start replicating $elasticsearchBucket...'
  sleep 5
  couchbase-cli xdcr-replicate -c $host:8091 \
          --user=$user \
          --password=$password \
          --create \
          --xdcr-cluster-name=elasticsearch \
          --xdcr-replication-mode=capi \
          --xdcr-from-bucket=$elasticsearchBucket \
          --xdcr-to-bucket=$elasticsearchBucket
fi
echo 'done'
