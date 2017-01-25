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

Otherwise, you can found the yaml file here under `spring-server/src/main/resources/api-spec.yaml`

Copy-paste it on Swagger online editor http://editor.swagger.io/#/ to visualize it.

## Top-down style
As we're a team of 4 people, we've chosen to follow the top-down style. We began to document our REST API with Swagger in yaml. Then :
* software quality engineers implement API tests in Javascript.
* software developers implement the API in Java with Spring Boot.  

But, we use the bottom-up too, to generate a interactive documentation of the Gamification API with SpringFox from the Java code annotated with Swagger annotations.

## Demo website
You can use Docker version this time ;)

We created a minimal website that show what can we do with our Gamification API.

We implemented it with Angular1 in Javascript. we used the `yeoman` generator called [angm](https://github.com/newaeonweb/generator-angm#readme).

You can found this demo website under the directory `demo-website`.

Before to run it, you need to have postman scripts that populate the test data. You can find its under `postman` directory.

Firstly, send the two requests in the collection called `Creation and authentication of the application`.

Then, save the authentication token that you get in the postman variable called `AUTHENTICATION_TOKEN`.

Finally, run requests that are in the collection called `Creation Badges, PointScales and Rules`.

Now, you can run the website by running these cmmands under `demo-website` directory :
* `npm install`
* `grunt dev`

Website should be available in http://127.0.0.1:4000.

You should obtain this :
![alt tag](https://github.com/Shenn299/HEIGVD-AMT-Gamification/picture/welcome.png)

You can authenticate the application created with the Authentication menu :
* name: heigvdoverflow
* password: heigvdoverflow

Then, you can simulate users actions in the website by sending events with the Events menu, below there are the events that you can send :
* solveMathsProblems -> give the maths lover badge to the user
* solveHtmlProblems -> give the Html lover badge and 1 point on the web development point scale to the user
* answerAccurately -> give 1 point on the Accuracy point scale to the user
* answerNotAccurately -> remove 1 point on the Accuracy point scale to the user

You can send each event more that one time, but a user can have only one badge of each kind.

You can view User badges and point scale with the Users menu.

## Testing

### Instruction for running automatised Mocha Tests
Server must be started locally without Docker !
Indeed, if we run automatised tests with the Docker version, the tests in which we send our authentication token, fail. (Maybe, the trouble is the time zone of creation time of the token, or the charset used in images/spring-boot/config.properties)

Run these commands under the `tests` directory :
* `npm install` (to install NodeJS dependency)
* `npm test` (to run functional test)

The 136 tests should be ok.

`env.local.json` is the file that contains default environment variable and is in the `tests` directory.

Furthermore, you can specify your own environment variables :
* API_URL
* DATABASE_IP
* DATABASE_NAME
* DATABASE_USER_NAME
* DATABASE_USER_PASSWORD
* SIGNATURE_KEY_FOR_JWT (shared secret to sign Json Web Token)

We have tests that verify completely the behavior for these endpoints:
* /Authentications
* /Applications
* /Badges
* /PointScales

We tried to be as systematic as possible.

We have scenarios tests too, that use several endpoints.
For example, firstly, we create an application, we authenticate it and we get the authentication token.

Then, we create a new badge and a new rule that give the badge created to the user if this rule is activated on this application.

Finally, we generate the expected event that is intercepted by the rule, and we check if the user that sends the event has the badge now.

You can find tests in Javascript under `/tests/specs/api/`

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
