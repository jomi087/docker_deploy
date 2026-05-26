# 1 - Docker Learning Notes

> Docker configuration -> step-by-step, Structured learning notes for understanding

> reminder -> this step is only required for creating an image if there is alredy created image like from docker hub you jst need to spin the container ie, docker run , no need to docker build

---

## Docker Commands

### basic Docker Commands

#### Pull Docker Image

```bash
docker pull image_name
```

#### List Docker Images

```bash
docker images
```

#### List Containers

```bash
docker ps

# optional add-on:
# -a -> shows all containers (running + stopped)
```

#### Run Docker Container

```bash
docker run image_name

# optional add-ons:
# --name <container-name>     -> set a custom container name
# -p hostPort: containerPort  -> bind/map container port to local machine port
# --network <networkname>     -> comunicationg b/w 2 container
```

#### Stop Container

```bash
docker stop <container-name>/ <container-id>
```

#### start Container

```bash
docker start <container-name>/ <container-id>
```

#### remove Image

```bash
# make sure the the container is removed or docker will throw an error
docker rm <image-name>/ <image-id>
```

#### remove Container

```bash
docker rm <container-name>/ <container-id>
```

#### remove all Container

```bash
docker container prune
```

### Troubleshoot Docker Commands

```bash
docker logs <container-name>
```

---

## Table of Contents

- This is a basic flow of how we use docker there might changes as per require ment (like only using a pre-created images , or comunicating b/w 2 or more container etc.. )Here in this flow we are going to create an image and spin it
  - [Step-1 Create Dockerfile](#step-1-create-dockerfile)
  - [Step-2 Choose Base Image](#step-2-choose-base-image)
  - [Step-3 Create Working Directory](#step-3-create-working-directory)
  - [Step-4 Copy Package Files](#step-4-copy-package-files)
  - [Step-5 Install Dependencies](#step-5-install-dependencies)
  - [Step-6 Copy Remaining Source Code](#step-6-copy-remaining-source-code)
  - [Step-7 Create .dockerignore](#step-7-create-dockerignore)
  - [Step-8 Expose Port](#step-8-expose-port)
  - [Step-9 Add Start Command](#step-9-add-start-command)
  - [Step-10 Host Binding](#step-10-host-binding)
  - [Step-11 Build Docker Image](#step-11-build-docker-image)
  - [Step-12 Run Container](#step-12-run-container)

---

## Step-1 Create Dockerfile

Create a file named:

```txt
Dockerfile
```

### Purpose

Docker reads this file line-by-line and follows the instructions written inside it.

This file contains:

- environment setup
- dependencies
- runtime instructions
- startup command

---

## Step-2 Choose Base Image

Instruction:

```dockerfile
FROM node:22-slim
```

### What This Does

This tells Docker:

```txt
Start building our image
using an existing Node.js image.
```

### Why Base Image Is Needed

Our project requires:

- Node.js runtime
- npm
- JavaScript execution environment

Without Node.js:

```bash
npm install
npm run dev
```

cannot work.

---

<details>
<summary>Deep Dive: Node Image Format</summary>

### Format

```txt
node:<version>-<distribution>-<variant>
```

Example:

```dockerfile
FROM node:22-bookworm-slim
```

| Part     | Meaning             |
| -------- | ------------------- |
| node     | official Node image |
| 22       | Node version        |
| bookworm | Debian 12           |
| slim     | lightweight variant |

</details>

---

<details>
<summary>Deep Dive: Linux Distributions</summary>

Docker containers usually run Linux.

Common Linux distributions:

| Distribution | Usage                  |
| ------------ | ---------------------- |
| Ubuntu       | Beginner friendly      |
| Debian       | Stable servers         |
| Alpine       | Lightweight            |
| Fedora       | Latest technologies    |
| Arch         | Advanced/custom setups |

### Debian Versions

| Debian Version | Codename |
| -------------- | -------- |
| Debian 11      | bullseye |
| Debian 12      | bookworm |
| Debian 13      | trixie   |

</details>

---

<details>
<summary>Deep Dive: Image Variants</summary>

| Variant      | Meaning                  |
| ------------ | ------------------------ |
| full/default | Includes most tools      |
| slim         | Smaller image            |
| distroless   | Minimal OS tools         |
| debug        | Includes debugging tools |

</details>

---

## Step-3 Create Working Directory

Instruction:

```dockerfile
WORKDIR /app
```

### What This Does

Docker creates:

```txt
/app
```

inside the container.

All future commands execute inside this directory.

Equivalent idea:

```bash
mkdir /app
cd /app
```

### Why WORKDIR Is Important

Without WORKDIR:

- files become disorganized
- commands become harder to manage
- project structure becomes messy

---

## Step-4 Copy Package Files

Instruction:

```dockerfile
COPY package*.json .
```

### What This Does

Copies:

- package.json
- package-lock.json

into:

```txt
/app
```

inside the container.

### Understanding the Dot

```dockerfile
COPY package*.json .
```

The last dot means:

```txt
Current working directory
```

which is:

```txt
/app
```

---

### Why Copy package.json First

Docker uses layer caching.

Dependencies usually do not change frequently.

So Docker can reuse the existing dependency layer instead of reinstalling packages every build.

This improves build speed significantly.

---

## Step-5 Install Dependencies

Instruction:

```dockerfile
RUN npm install
```

### What This Does

Runs:

```bash
npm install
```

inside the container.

This creates:

```txt
node_modules
```

inside the container environment.

### Why Install Inside Container

The container needs:

- isolated dependencies
- Linux-compatible packages
- self-contained environment

---

## Step-6 Copy Remaining Source Code

Instruction:

```dockerfile
COPY . .
```

### What This Does

Copies remaining project files into:

```txt
/app
```

Examples:

- src
- public
- vite.config.js
- index.html

---

### Why COPY Happens Twice

### First COPY

```dockerfile
COPY package*.json .
```

Copies only dependency files.

### Second COPY

```dockerfile
COPY . .
```

Copies remaining source code.

This structure improves Docker caching efficiency.

---

## Step-7 Create .dockerignore

Create file:

```txt
.dockerignore
```

Example:

```txt
node_modules
.env
.git
dist
logs
```

---

### Why Ignore node_modules

- Reason 1 — Duplicate Dependencies

The container already creates its own:

```txt
node_modules
```

using:

```dockerfile
RUN npm install
```

So copying local dependencies is unnecessary.

---

- Reason 2 — OS Compatibility

Your local machine may use:

- Windows
- macOS

But containers usually use Linux.

Some packages contain compiled binaries that may fail across operating systems.

---

- Reason 3 — Faster Builds

`node_modules` is very large.

During:

```bash
docker build
```

Docker sends files to the Docker daemon.

This is called:

```txt
Build Context
```

Large unnecessary files slow builds and increase image size.

---

## Step-8 Expose Port

Instruction:

```dockerfile
EXPOSE 4000
```

### What This Does

Tells Docker:

```txt
Application inside the container
uses port 4000
```

### Important Note

`EXPOSE` does NOT make the port public.

It mainly acts as:

- metadata
- documentation
- container information

---

## Step-9 Add Start Command

Instruction:

```dockerfile
CMD ["npm", "start"]
```

### What This Does

When the container starts, Docker automatically runs:

```bash
npm start
```

### Why CMD Is Needed

Containers need to know:

```txt
What should run after startup?
```

CMD defines the default startup command.

## Step-10 Host Binding

Some applications inside Docker only allow connections from:

```txt
localhost / 127.0.0.1
```

This means:

```txt
Only accessible INSIDE container
```

So even if Docker forwards the port:

```bash
docker run -p 4000:4000 my-app

# "-p 4000:4000" is optional.
# It is used to bind/map the container port to your local machine port.
```

browser still may NOT connect.

---

### Solution

Bind application to:

```txt
0.0.0.0
```

which means:

```txt
Accept connections from outside container
```

---

### Where Usually Required

Mostly frontend development servers:

- Vite
- React dev server
- Next.js dev mode
- Vue dev server

Example:

```json
"dev": "vite --host 0.0.0.0"
// user in dev purpose only for production not required
```

---

### Express / Node.js

in express you can do like this

```js
app.listen(4000, "0.0.0.0")
```

but Usually that is NOT required.
so this is fine
Example:

```js
app.listen(4000)
```

because Node.js commonly binds externally by default.

for deployment consistency and avoiding environment issues.

---

## Step-11 Build Docker Image

### Command:

```bash
docker build -t my-app .
```

### What This Does

Docker reads the Dockerfile and creates a Docker image.

The image contains:

- application code
- dependencies
- runtime
- OS environment

---

### Understanding the Command

| Part         | Meaning               |
| ------------ | --------------------- |
| docker build | build image           |
| -t           | assign image name/tag |
| my-app       | image name            |
| .            | build context         |

---

<details>
<summary>Deep Dive: Build Context</summary>

Build Context means:

```txt
Files and folders Docker can access
during image build.
```

The dot:

```bash
.
```

means:

```txt
Current folder
```

Docker can access all files inside this folder unless excluded via `.dockerignore`.

</details>

---

<details>
<summary>Deep Dive: Docker Engine / Docker Daemon</summary>

Docker Engine is the background service responsible for:

- building images
- running containers
- managing images
- managing containers

Docker Desktop usually starts this automatically.

</details>

---

### Verify Images

Command:

```bash
docker images
```

Shows:

- image name
- image ID
- size
- tags

---

## Step-12 Run Container

### Command:

```bash
docker run --name my-containerName -p 4000:4000 image-name
# use -d purpose -> this is not freeze ur terminal

# "--name my-containerName" is optional.
# If not provided, Docker automatically generates a random container name.
```

### What This Does

Creates and starts a container from the Docker image.

---

### Port Mapping/Binding

- Port binding is used to map a host machine port to a specific container port.

#### Purpose

- Multiple containers can run applications on the same internal container port.
- For example:
  - Container 1 may run on port `3000`
  - Container 2 may also run on port `3000`

  - This is not a problem inside Docker because each container has its own isolated environment.

  - But on your local machine (host), the same host port cannot be used multiple times simultaneously.

  - So we map different host ports to the container ports.

```text
         Multiple Containers with Port Mapping

┌─────────────────── HOST MACHINE ─────────────────────┐

    localhost:4000                   localhost:5000
           │                              │
           ▼                              ▼

     HOST PORT 4000                  HOST PORT 5000
           │                              │
           │                              │
           ▼                              ▼

┌───────────────────┐            ┌───────────────────┐
│   CONTAINER 1     │            │   CONTAINER 2     │
│                   │            │                   │
│  App Port : 3000  │            │  App Port : 3000  │
│                   │            │                   │
└───────────────────┘            └───────────────────┘

docker run -p 4000:3000 app-1
docker run -p 5000:3000 app-2
```

Syntax:

```txt
HOST_PORT : CONTAINER_PORT
```

<details>
<summary>Another Example with explanation</summary>

### Core Rule

```bash
-p HOST_PORT:CONTAINER_PORT
```

- **Left side (HOST_PORT)**  
  The port on your own computer.  
  This can usually be **any free port**.

- **Right side (CONTAINER_PORT)**  
  The actual port on which the application/server is running inside the container.  
  This must match the real listening port.

---

### Backend Example

Suppose Express is running like this:

```js
app.listen(3000)
```

This means:

```text
Backend server is listening on port 3000 inside the container.
```

So the right side must be `3000`.

Examples:

```bash
docker run -p 3000:3000 my-backend
docker run -p 5000:3000 my-backend
docker run -p 9999:3000 my-backend
```

All are valid.

Here:

- `3000`, `5000`, `9999` are ports on your computer
- `3000` is the real backend port inside container

---

### Frontend Production Example

When using Nginx:

```dockerfile
EXPOSE 80
```

Nginx internally runs on port `80`.

So the right side must be `80`.

Examples:

```bash
docker run -p 5173:80 react-client
docker run -p 3000:80 react-client
docker run -p 8080:80 react-client
```

All are valid.

Here:

- `5173`, `3000`, `8080` are ports on your computer
- `80` is the real Nginx port inside container

---

### Important Understanding

In frontend production:

- Vite dev server is no longer running
- React is not deciding the port anymore
- Nginx (or serve/Express/etc.) becomes the real server

So the container port depends on:

- Nginx → usually `80`
- serve package → maybe `3000` or `4000`
- Express → whatever port you configured

---

### Final Understanding

### Left Side

```text
Any free port on your computer
```

You choose it.

---

### Right Side

```text
The actual listening port inside the container
```

This must match the real server port.

</details>

---

### Request Flow

```txt
Browser
   ↓
localhost:4000
   ↓
Docker Port Forwarding
   ↓
Container:4000
   ↓
Application
```

---

### Important Difference

### docker run -p

Only forwards traffic.

### 0.0.0.0

Allows outside connections into the container.

Both are required.

---

### Show Running Containers

```bash
docker ps
```

---

### Show All Containers

```bash
docker ps -a
```

---

# 2 - Docker Network Notes

> docker network is use when mulitple container needs to comunicate cz without docker network containers cant talk to other cz they are isolated

> Here in my project i am using docker network to comunicate b/w express-server container (whose image was creted by me ) and mongo container (whose image was alredy create (from docker hub))

> Docker network configuration & mongo configuration

- Docker network configuration :- follows the same flow as docker configuration jst slight

- mong config -> will show step-by-step, Structured configuration notes for understanding
  **Mongo image is pre created image so no need create mongo image jst spin the container**
  - MongoDB Docker image is: "mongo"
  - eg :- docker pull mongo -> docker images -> you can see mongo image

## Purpose of MongoDB Docker Image

Instead of depending on MongoDB installed on the operating system:

```txt
Host Machine
 ├── MongoDB Installed
 └── Backend Container
```

we can containerize MongoDB itself:

```txt
Docker Containers
 ├── Backend Container
 └── MongoDB Container
```

Benefits:

- no MongoDB installation needed on host machine
- same environment for every developer
- easy project sharing
- better portability
- isolated services
- easier deployment consistency

## Two Common Approaches

### Approach 1 → Connect to Host Machine MongoDB

#### URI

```js
const MONGO_URI = "mongodb://host.docker.internal:27017/dummy_Db"
```

#### Architecture

```txt
Backend Container
        ↓
Host Machine MongoDB
```

#### Purpose

`host.docker.internal` allows a Docker container to access services running on the host operating system.

#### Pros

- easy local development
- useful for testing
- works with existing local MongoDB installation
- easy debugging using MongoDB Compass
- convenient during early development stages

#### Cons

- MongoDB must be installed manually
- project depends on host machine setup
- not fully containerized
- environment consistency may vary between developers

#### implimentation

- jst set this as URI
  ```bash
       "mongodb://host.docker.internal:27017/<db-name>"
        #example
       "mongodb://host.docker.internal:27017/<e_commerce>"
  ```
- run the image

  ```bash
     docker run --name <container-name> -p  27017:27017 <image-name>
     #example
     docker run --name mongo-container -p  27017:27017 mongo
     # mongo is the offical image name
     # also its not needed to pull the image 1st to docker desktop cz docker run it self pull if that iamge was not pulled before

  ```

- now you can see the db-name "e_commerce" would had been created in your host mongosh (verify via compass or shell [in sheell jst type mongosh and then show dbs])

---

### Approach 2 → MongoDB Docker Container (Container-to-Container Communication)(Docker network concept)

##### URI

```js
const MONGO_URI = "mongodb://mongodb-container:27017/dummy_Db"
```

#### Important Learning Part

##### Architecture

```txt
Backend Container
        ↓
MongoDB Container
```

##### Purpose

MongoDB itself runs inside Docker container.

Backend container communicates directly with MongoDB container using Docker Network.

##### Pros

- fully containerized setup
- no local MongoDB installation needed
- portable architecture
- same setup for all developers
- easier deployment consistency
- cleaner service isolation

##### Cons

- requires Docker networking knowledge
- slightly more setup initially

---

##### Overview

**This introduces real container-to-container communication.**
Previously:

- frontend container worked independently
- backend container worked independently

But now:

- backend container must communicate with MongoDB container

This introduces **Docker Networking**.

---

##### Why Docker Network Is Needed

Containers are isolated by default.

A container cannot directly communicate with another container automatically.

Docker Network allows containers to:

- communicate privately
- discover each other using container names

---

#### How Docker Network Communication Works (Implimentation)

##### Step 1 → Create Network

```bash
docker network create <networkName>
# example
   docker network create mynetwork
   # networkName can be any name
```

---

##### Step 2 → Run MongoDB Container Inside Network

```bash
docker run -d --name <MongoDB Container-name> --network <networkName> -p hostPort:containerPort <mongo-image-name>
# example :
   docker run -d --name mongodb-container --network mynetwork -p 27017:27017 mongo
```

Explanation:

- `mongo` → official MongoDB image
- `mongodb-container` → container name
- `mynetwork` → shared Docker network
- `-p 27017:27017` → binds MongoDB container port to the host machine.

- port binding is optional.
  Use port binding when:
- host machine needs access to MongoDB
- MongoDB Compass needs connection
- mongosh from host machine is needed
- external tools need access

* If only containers inside Docker network need MongoDB communication,
  then port binding is not required.
* Without `-p`, backend container can still communicate with MongoDB container through Docker Network internally.

---

##### Step 3 → UPDATE MongoDB URI

- MongoDB URI Format

```js
const MONGO_URI = mongodb://<hostname>:27017/<db_name>
   //Example:-
      const MONGO_URI = mongodb://mongodb-container:27017/dummy_Db
   
```

###### Important Concept Learned

Inside Docker Network: Container name becomes the hostname inside Docker network

So:

- `mongodb-container` is the MongoDB container name
- Docker internally resolves that name as hostname

---

##### Step 4 → Run Backend Container **Inside Same Network**

- **Build image**
```bash
docker build -t <image-name> .
   # Example
   docker build -t express-server .
```

- Re-build image case
After updating your code, you do **not** need to manually delete the previous image.

Just run the same build command again:
```bash
docker build -t express-server .
```
Docker automatically rebuilds and updates the image using the same tag/name (`express-server:latest` by default).

- **Run container**

```bash
docker run -d --name <Backend-container-name> --network <networkName> -p hostPort:containerPort <backend-image-name>

   # example
      docker run -d --name es-container --network mynetwork -p 4000:4000 express-server
```

---

##### Mongo Shell Access

Open Mongo shell inside container:

```bash
docker exec -it <hostname> mongosh

example
   docker exec -it mongodb-container mongosh
   # here u can see the new db and u can access it with mongo shell cmd eg : show dbs
````

---

##### Main Learning Outcome

Containerization is not only about running applications inside containers.

Real containerization also includes:

- service-to-service communication
- databases running inside containers
- isolated environments
- portable application architecture
- reproducible development setup
  \*/


