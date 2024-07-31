# Stage 1: Build the application
FROM maven:3.8.6-openjdk-18 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the actual image
FROM eclipse-temurin:21
WORKDIR /home
COPY --from=build /app/target/sbs-0.0.1-SNAPSHOT.jar secureBanking.jar
COPY src/main/resources/sbs-service.p12 /app/sbs-service.p12
ENTRYPOINT ["java", "-jar", "secureBanking.jar"]
