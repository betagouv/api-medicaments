set -e # Exit with nonzero exit code if anything fails

VERSION=${1:-"$CIRCLE_BUILD_NUM"}

[[ -z  $VERSION ]] && echo "No version " && exit 1
[[ -z  $DOCKER_USER ]] && echo "SET DOCKER_USER " && exit 2
[[ -z  $DOCKER_PASS ]]  && echo "SET DOCKER_PASS " && exit 3
[[ -z  $DOCKER_EMAIL ]]  && echo "SET DOCKER_EMAIL " && exit 3

echo "##### Start publishing version $VERSION"

echo "##### Build web app & elasticsearch"
docker build -f DockerfileAPI -t api-meds-api .
docker build  -t api-meds-es ./elasticsearch

echo "##### Run couchbase"
docker run -d --name couchbasePublish -p 8091-8094:8091-8094 -p 11210:11210 couchbase:community

echo "##### Prepare DB"
docker run -t --name configCbPublish --link couchbasePublish:couchbase.meds -v $(pwd)/bin/prepareDataBase.sh:/opt/couchbase/bin/cb-config.sh couchbase:community bash -c "/opt/couchbase/bin/cb-config.sh couchbase.meds admin tototiti medicaments"

echo "##### Import data"
./bin/import

echo "##### Tag images"
docker tag api-meds-api betagouv/api-meds-api:$VERSION
docker tag -f betagouv/api-meds-api:$VERSION betagouv/api-meds-api:latest

docker tag api-meds-es betagouv/api-meds-es:$VERSION
docker tag -f betagouv/api-meds-es:$VERSION betagouv/api-meds-es:latest

echo "##### Log into docker hub wit $DOCKER_USER"
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS


echo "##### Push images"
docker push betagouv/api-meds-api:latest
docker push betagouv/api-meds-api:$VERSION

docker push betagouv/api-meds-es:latest
docker push betagouv/api-meds-es:$VERSION

echo '##### Create backup data'
docker run --link couchbasePublish:couchbase.meds -v $(pwd)/export:/var/export -it couchbase:community cbbackup http://couchbase.meds:8091 /var/export/ -u admin -p tototiti
tar -cvzf meds-db.tar.gz ./export

echo "##### Clean containers"
docker stop couchbasePublish configCbPublish
