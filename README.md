# HEIGVD-AMT-Gamification

## Goals & objectives of the lab

## Outils specification & version

## Informations about Docker images

## Instructions about running the application via Docker

## Login and password for application

## API documentation

## Top-down style
As we're a team of 4 people, we've chosen to follow the top-down style. We began to document our REST API with Swagger in yaml. Then :
* software quality engineers implement API tests in Javascript.
* software developers implement the API in Java with Spring Boot.

## Instruction for running automatised Mocha Tests
Run these commands under the `tests` directory :
* `npm install` (to install NodeJS dependency)
* `API_URL=http://`{DOCKER_MACHINE_IP:DOCKER_MACHINE_PORT}`/api DATABASE_IP=`{DOCKER_MACHINE_IP}` DATABASE_USER=`{DATABASE_USER}` DATABASE_PASSWORD=`{DATABASE_PASSWORD}` DATABASE_NAME=`{DATABASE_NAME}` SIGNATURE_KEY_FOR_JWT=`{SIGNATURE_KEY_FOR_JWT}` npm test` (to run functional test)

The default values of the environment variables are :
* 

## Credits
Software quality engineers:
* FRANCHINI Fabien
* HENNEBERGER Sébastien

Software developers:
* SEKLEY Pascal
* TCHUENSU POUOPSE Rodrigue
