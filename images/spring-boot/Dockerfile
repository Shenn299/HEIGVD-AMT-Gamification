FROM java:8-jdk
MAINTAINER Fabien Franchini <fabien.franchini@heig-vd.ch>

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64
ENV PATH $PATH:$JAVA_HOME/bin

WORKDIR /app
EXPOSE 8080

COPY app.jar /app/app.jar
RUN mkdir /app/config
COPY config.properties /app/config/

CMD ["java", "-jar", "app.jar"]
