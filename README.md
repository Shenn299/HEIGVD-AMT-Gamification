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
But, we use the bottom-up too, to generate a interactive documentation of the Gamification API with SpringFox from the Java code annotated with Swagger annotations.

## Instruction for running automatised Mocha Tests
Application must be started.

Run these commands under the `tests` directory :
* `npm install` (to install NodeJS dependency)
* `API_URL=http://`{DOCKER_MACHINE_IP:DOCKER_MACHINE_PORT}`/api DATABASE_IP=`{DOCKER_MACHINE_IP}` npm test` (to run functional test)

Furthermore, you can specify your own environment variables :
* DATABASE_NAME
* DATABASE_USER_NAME
* DATABASE_USER_PASSWORD
* SIGNATURE_KEY_FOR_JWT (shared secret to sign Json Web Token)

## Credits
Software quality engineers:
* FRANCHINI Fabien
* HENNEBERGER Sébastien

Software developers:
* SEKLEY Pascal
* TCHUENSU POUOPSE Rodrigue
