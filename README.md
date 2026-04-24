## 📦 Microservice Architecture

### ⚙️ Installation Process

1. Clone or download the repository:
   [https://github.com/nmsoikat/microservices-assignment.git](https://github.com/nmsoikat/microservices-assignment.git)

2. Navigate to the project directory:
   `cd microservice-assignment-main`

3. Run the application:
   `docker compose up --build`

⚠️ Note: Please ensure Docker is running before executing the command.


### 🧪 API Testing (Postman Setup)

1. Download the Postman Collection and Postman Environment files

2. Open Postman

3. Import:
   - Collection
   - Environment

4. Select the environment and start testing APIs


### 🔗 Service URLs

RabbitMQ UI:
[http://localhost:15673/](http://localhost:15673/)
```
user: guest
password: guest
```

MongoDB URL:
[http://localhost:27018/](http://localhost:27018/)
```
auth-db
product-db
```

## 📡 API Routes
Base URL:
[http://localhost:3000/api](http://localhost:3000/api)


#### 📌 Notes
- All services are containerized using Docker
- Ensure required ports are available before running the application
- Postman collection and environment are available in the project folder.
