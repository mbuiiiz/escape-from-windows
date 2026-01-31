FROM amazoncorretto:17-alpine

# Install Maven
RUN apk add --no-cache maven

WORKDIR /app

# Copy Maven files first for better layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -q

# Copy source code
COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]