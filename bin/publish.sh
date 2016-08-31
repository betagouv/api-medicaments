set -e # Exit with nonzero exit code if anything fails

VERSION=${1:-"$CIRCLE_BUILD_NUM"}

[[ -z  $VERSION ]] && echo "No version " && exit 1
[[ -z  $DOCKER_USER ]] && echo "SET DOCKER_USER " && exit 2
[[ -z  $DOCKER_PASS ]]  && echo "SET DOCKER_PASS " && exit 3
[[ -z  $DOCKER_EMAIL ]]  && echo "SET DOCKER_EMAIL " && exit 3

echo "##### Start publishing version $VERSION"

echo "##### Build web app & elasticsearch"
docker build -f Dockerfile -t api-meds-api .


echo "##### Tag images"
docker tag api-meds-api betagouv/api-meds-api:$VERSION
docker tag betagouv/api-meds-api:$VERSION betagouv/api-meds-api:latest



echo "##### Log into docker hub wit $DOCKER_USER"
docker login -e $DOCKER_EMAIL -u $DOCKER_USER -p $DOCKER_PASS

echo "##### Push images"
docker push betagouv/api-meds-api:latest
docker push betagouv/api-meds-api:$VERSION
