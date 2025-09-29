FROM maven:3.9.5-eclipse-temurin-21 AS build

WORKDIR /app/project

COPY ["src/Drive Thru Java/pom.xml", "./"]
COPY ["src/Drive Thru Java/.mvn", "./.mvn"]
COPY ["src/Drive Thru Java/src", "./src"]

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY --from=build /app/project/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]