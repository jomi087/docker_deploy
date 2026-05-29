# Docker Learning & Deployment Project

A beginner-friendly project created to understand how Docker works in real-world full-stack applications.

This project demonstrates how to:

* Dockerize frontend and backend applications
* Use prebuilt Docker images
* Create custom Docker images
* Configure Docker networking
* Connect multiple containers
* Use Docker Compose for multi-container management

The project uses:

* React (Frontend)
* Express.js (Backend)
* MongoDB (Database)
* Docker & Docker Compose

---

# Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Learning Topics Covered](#learning-topics-covered)
4. [Where To Start](#where-to-start)
5. [How The Project Works](#how-the-project-works)
6. [Running The Project](#running-the-project)
7. [Additional Notes](#additional-notes)

---

# Project Overview

This project was created for learning Docker practically using a small full-stack application.

The application contains:

* React frontend
* Express backend
* MongoDB database

The frontend fetches data from the backend API, and the backend communicates with MongoDB using Docker networking.

The project demonstrates both:

* manual Docker workflow
* Docker Compose workflow

---

# Project Structure

```txt
docker_deploy
│   docker-compose.yml
│   README.md
│
├── client
│   └── React Frontend
│
├── server
│   └── Express Backend
│
├── notes
│   ├── Notes.md
│   └── Docker_Readme.md
│
└── screenshots
```

---

# Learning Topics Covered

This repository covers:

* What Docker is
* Containers vs Images
* Virtual Machines vs Docker
* Docker Commands
* Docker Networking
* Port Binding
* Dockerfile Configuration
* Creating Custom Images
* Using Prebuilt Images
* Multi-Container Communication
* Docker Compose
* Container Dependency Management

---

# Where To Start

## Quick Learning Notes

If you want quick explanations and definitions:

```txt
notes/Notes.md
```

---

## Detailed Docker Notes

If you want detailed Docker explanations with project-based examples:

```txt
notes/Docker_Readme.md
```

This includes:

* Dockerfile explanation
* Networking explanation
* Port binding
* Container communication
* Docker Compose configuration
* Build vs Image concepts
* Service Name vs Container Name
* Real examples from this project

---

# How The Project Works

## Frontend

The React frontend sends API requests to the backend during initial render.

Example:

```txt
GET /api/message
```

---

## Backend

The Express backend:

* returns a message
* generates a random number
* communicates with MongoDB
* stores user data if not already present

---

## Database

MongoDB runs inside a Docker container and communicates with the backend using Docker networking.

---

# Running The Project

## Requirements

* Docker Desktop Installed
* Docker Desktop Running

---

## Running The Project

**Requirements**

Before starting, make sure the following are installed and running on your system:

* Docker Desktop
* Docker Desktop Service Running

---

## Step 1 — Clone The Repository

```bash
git clone https://github.com/jomi087/docker_deploy.git
```

---

## Step 2 — Navigate To The Project Folder

```bash
cd docker_deploy
```

---

## Step 3 — Start The Project

### Run Using Docker Compose (Recommended)

```bash
docker compose up
```

Docker Compose will automatically:

* build the frontend image
* build the backend image
* pull the MongoDB image
* create the Docker network
* connect all containers
* start all services

---

### Run In Background Mode

```bash
docker compose up -d
```

This starts the containers in detached mode so the terminal remains free.

---

### Stop Running Containers

```bash
docker compose stop
```

---

### Remove Containers And Network

```bash
docker compose down
```

This removes:

* running containers
* created network
* temporary container resources

---

## Step 4 — Open The Application

After the containers start successfully, open:

```bash
http://localhost:5173
```
in your browser.

---

# Additional Notes

This project focuses mainly on learning Docker concepts practically rather than production deployment.

The repository intentionally contains detailed notes and explanations to help beginners understand:

* how Docker works internally
* why Docker networking is needed
* how Docker Compose simplifies container management
* difference between images and containers
* service-name communication inside Compose