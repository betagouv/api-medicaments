set -e # Exit with nonzero exit code if anything fails

VERSION=${1:-"$CIRCLE_BUILD_NUM"}

[[ -z  $VERSION ]] && echo "No version " && exit 1

echo "##### Start publishing version $VERSION"

echo "##### Build web app & elasticsearch"
docker build -f Dockerfile -t api-meds-api .


echo "##### Tag images"
docker tag api-meds-api betagouv/api-meds-api:$VERSION
docker tag betagouv/api-meds-api:$VERSION betagouv/api-meds-api:latest

echo "##### Push images"
docker push betagouv/api-meds-api:latest
docker push betagouv/api-meds-api:$VERSION
