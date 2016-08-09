#!/bin/bash

artifact_name="meds-db.tar.gz"
branch="publish"
artifact_url="https://circleci.com/api/v1/project/sgmap/api-medicaments/latest/artifacts/0//home/ubuntu/api-medicaments/$artifact_name?branch=$branch&filter=successful"

wget -qO- "$artifact_url" | tar xvz

docker-compose -f ./docker-compose-prod.yml pull
docker-compose -f ./docker-compose-prod.yml rm -f --all
docker-compose -f ./docker-compose-prod.yml up -d
