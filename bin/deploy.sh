#!/bin/bash

git pull origin master

docker-compose -f ./docker-compose-prod.yml pull
docker-compose -f ./docker-compose-prod.yml rm -f --all
docker-compose -f ./docker-compose-prod.yml up -d
