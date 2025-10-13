# Drive Thru

## 📑 Table of Contents
- [⚙️ Requirements](#️-requirements)
- [📖 Docs](#-docs)
- [🐳 Containers](#-containers)
- [🚀 Quick Start](#-quick-start)
  - [1. Clone the repository](#1-clone-the-repository)
  - [2. Install dependencies](#2-install-dependencies)
  - [3. Start the application](#3-start-the-application)
  - [4. Access the app](#4-access-the-app)
  - [5. Other commands](#5-other-commands)
- [📁 Project Structure](#-project-structure)
- [📸 Screenshots](#-screenshots)

---

## ⚙️ Requirements
- [Docker](https://www.docker.com/get-started) (latest version)
- [Docker Compose](https://docs.docker.com/compose/install/) (latest version)

## 📖 Docs
- [Tree.js](https://threejs.org/)
- [Rapier](https://rapier.rs/docs/)
- [Fiber.js](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Node](https://nodejs.org/docs/latest/api/)
- [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Jest](https://jestjs.io/docs/getting-started)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [MySQL](https://dev.mysql.com/doc/)
- [Redis](https://redis.io/docs/latest/)
---

## 🐳 Containers
This repository contains a Docker-based development setup for a React.js application. It includes services for:
- NGINX (web server)
- React
- Node.js
- Java
- MySQL
- Redis
- npm 

## 🚀 Quick Start
### 1. Clone the repository
```bash
git clone git@github.com:The-Scripts/drive-thru.git
cd drive-thru
```

### 2. Install dependencies
Build docker-compose: 
```bash 
docker-compose build
```
Install node.js: 
```bash 
  docker-compose run --rm npm install
```

### 3. Start the application
To run the application, you can choose one of the following:
- Run only React.js app:
```bash
  docker-compose up react
```
- Run only Node.js server:
```bash
  docker-compose up node
```
- Run Java server + MySQL:
```bash
  docker-compose up java
```
- Run the entire app:
```bash
docker-compose up server
````
### 4. Access the app
> Visit the React.js app: http://localhost:3000 <br/>
> Visit the NGINX proxy: http://localhost:8000
---

### 5. Other commands
```bash
> Install dependencies: docker-compose run --rm npm install {dependencies}
> Stop containers: docker-compose stop
> Remove containers: docker-compose down
```

## 📁 Project Structure
```
.
├── dockerfiles/          # Custom Dockerfiles (nginx, node)
├── nginx/                # NGINX configuration
├── env/                  # ENV 
├── src/                  # React.js application
|   └── Drive Thru Java/  # Spring Boot Backend 
|   └── src/  
|       └── CoreComponents/      #
|       └── CoreHelpers/         #
|       └── EnviromentPresets/   #
|       └── Objects/      #
|       └── Ui/           #
|       └── App.jsx       # Application React file
|       └── main.jsx      # Main React file
|       └── server.js     #
└── docker-compose.yaml   # Main Docker orchestration file
```
## 📸 Screenshots
<img width="1115" height="795" alt="image" src="https://github.com/user-attachments/assets/c14ebe0c-0443-417e-822c-3f79b7152f22" />

<img width="1711" height="797" alt="image" src="https://github.com/user-attachments/assets/87419bd1-441b-4bfd-a60f-40e340e788af" />

![pat](https://czechmovie.com/cdn/shop/articles/pat_a_mat_a.jpg?v=1684742662)
