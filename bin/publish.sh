networkName="apimedicaments_cbNetwork"

networkExists=$(docker network ls | grep $networkName)

if [ -z "$networkExists" ]
then
  docker network create $networkName
fi
