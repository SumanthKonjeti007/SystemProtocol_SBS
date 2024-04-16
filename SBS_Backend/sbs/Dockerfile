FROM eclipse-temurin:21
WORKDIR /home
COPY ./target/sbs-0.0.1-SNAPSHOT.jar secureBanking.jar
COPY src/main/resources/sbs-service.p12 /app/sbs-service.p12
ENTRYPOINT ["java", "-jar", "secureBanking.jar"]