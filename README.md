# HEIGVD-AMT-Gamification

## Context of the lab
This laboratory was realised for the Multi-Third Application (AMT) course at HEIGVD.

## Goals of the lab
Create a Gamification API. The main goal is to provide an API that administrators and developers could use to add Gamification on their website.

## Objectives of the lab
Learn how to use technology below for a projet :
* Spring Boot
* JPA
* Spring Fox
* Swagger
* Mocha
* Chai
* JMeter

An other objective is to follow and use both "top-down" and "bottom-up" style. We used first "top-down" to create a static documentation of the Gamification API, and then we implemented functionality in Java and automatised tests in Javascript. In a second time, we generated an interactive documentation of the API with Spring Fox.

## Outils specification & version
* Java 8
* Maven 3.3.9
* Spring Fox 2.6.1
* Spring Boot 1.4.2
* Swagger 2.2.1
* Hibernate 4.1.9
* Docker 1.13.0
* Docker-compose 1.10.0

## Informations about Docker images

The present topology is composed of three Docker containers:

* API : The container that contains the gamification API.
* Database : This container run a MySQL instance that comunicate with the API.
* PHPMyAdmin : A graphical frontend for MySQL.

## Instructions about running the application via Docker

In order to run the application via Docker, you must have the latest version of `docker-engine` and `docker-compose`
properly installed and configured.

* Go to the `topology` directory

```
$ cd topology/
```

* Build the docker images with `docker-compose`

```
$ docker-compose build
```

* Run the topology with `docker-compose`

```
$ docker-compose up
```

Now you should be able to communicate with the API at http://127.0.0.1:8090/api

## Documentation of the API
If you have started the server, simply go to http://127.0.0.1:8090/api to have the interactive version.

Otherwise, you can found the yaml file here under spring-server/src/main/resources/api-spec.yaml.

Copy-paste it on Swagger online editor http://editor.swagger.io/#/ to visualize it.

## Interactive documentation of the API (generated with SpringFox)
url

## Top-down style
As we're a team of 4 people, we've chosen to follow the top-down style. We began to document our REST API with Swagger in yaml. Then :
* software quality engineers implement API tests in Javascript.
* software developers implement the API in Java with Spring Boot.  

But, we use the bottom-up too, to generate a interactive documentation of the Gamification API with SpringFox from the Java code annotated with Swagger annotations.

## Testing

### Instruction for running automatised Mocha Tests
Application must be started.

Run these commands under the `tests` directory :
* `npm install` (to install NodeJS dependency)
* `API_URL=http://`{DOCKER_MACHINE_IP:DOCKER_MACHINE_PORT}`/api DATABASE_IP=`{DOCKER_MACHINE_IP}` npm test` (to run functional test)

Furthermore, you can specify your own environment variables :
* DATABASE_NAME
* DATABASE_USER_NAME
* DATABASE_USER_PASSWORD
* SIGNATURE_KEY_FOR_JWT (shared secret to sign Json Web Token)

### Load testing

In order to run the load testing scripts you must have the latest version of `JMeter` properly installed and configured.

* Go to the testing directory:

```
$ cd tests/jmeter/
```

* Open the `tester.jmx` with `JMeter` and run it.

## Credits
Software quality engineers:
* FRANCHINI Fabien
* HENNEBERGER Sébastien

Software developers:
* SEKLEY Pascal
* TCHUENSU POUOPSE Rodrigue
