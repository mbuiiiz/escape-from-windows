FROM amazoncorretto:17-alpine

# Install Maven + Python (generator)
RUN apk add --no-cache maven python3

WORKDIR /app

# Copy Maven files first for better layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -q

# Copy source code
COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]
