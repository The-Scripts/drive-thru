# Drive Thru

This repository contains a Docker-based development setup for a React.js application. It includes services for:
- NGINX (web server)
- React
- Node.js 

## ⚙️ Requirements
- [Docker](https://www.docker.com/get-started) (latest version)
- [Docker Compose](https://docs.docker.com/compose/install/) (latest version)
---

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
- Run both NGINX and React.js app:
```bash
docker-compose up server
````
### 4. Access the app
> Visit the React.js app: http://localhost:3000 <br/>
> Visit the NGINX proxy: http://localhost:8000
---

### 4. Other commands
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
├── src/                  # React.js application
|   └── src/  
|       └── CoreComponents/      #
|       └── CoreHelpers/         #
|       └── EnviromentPresets/   #
|       └── Objects/      #
|       └── Ui/           #
|       └── App.jsx       # Application React file
|       └── main.jsx      # Main React file
└── docker-compose.yaml   # Main Docker orchestration file
```