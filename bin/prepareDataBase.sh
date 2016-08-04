#!/bin/bash
host=$1
user=$2
password=$3
bucketNames=${4:-"medicaments medicamentsTests"}

echo "host : $host"
echo "user : $user"
echo "password : $password"
echo "bucketNames : $bucketNames"

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
