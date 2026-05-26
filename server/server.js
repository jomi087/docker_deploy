import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

const app = express()
// const MONGO_URI = mongodb://127.0.0.1:27017/dummy_Db

// Impliement MongoDB Docker Image(notes given below)
// const MONGO_URI = "mongodb://host.docker.internal:27017/dummy_Db"
const MONGO_URI = "mongodb://mongodb-container:27017/dummy_Db" //"mongodb://<mongo-containerName>:27017/db-name"

app.use(express.json())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ]
}))

// MongoDB Connection 
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error)
    })

// Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: Number
})
const User = mongoose.model("User", userSchema)


app.get('/api/message', async (req, res) => {

    let user = await User.findOne({ name: "Lucky" })

    // Insert only if not exists
    if (!user) {
        user = await User.create({
            name: "Lucky",
            age: 22
        })
    }
    const randomNumber = Math.floor(Math.random() * 100) + 1

    res.json({
        message: "Hello From Lefty Server",
        number: randomNumber
    })
})

const PORT = 4000

app.listen(PORT, () => console.log(`server is running at http://localhost:${PORT}`))

/*
# MongoDB Docker Image + Docker Networking

## Why MongoDB Docker Image Is Needed

In a backend application, MongoDB connection usually happens through a MongoDB URI.

Example:

```js
const MONGO_URI = "mongodb://127.0.0.1:27017/dummy_Db"
```

In these approaches:
- backend connects to MongoDB installed on the host machine
- MongoDB runs outside Docker

This works perfectly fine and is commonly used during:
- local development
- debugging
- testing
- quick setup environments

* But when working with Dockerized applications,this has some cons which is 
    - Project Is No Longer Truly Portable
    - Your Express app may run in Docker, but it still depends on: MongoDB installed on host machine
        - Meaning:
            - another developer must install MongoDB manually do setup 
            - and also he has to use same version of ours to avoid version issue
            - also still we cant garunty cz of OS related issues
        - So the app is NOT self-contained anymore.

* This is were another approach becomes useful :

```txt
Run MongoDB itself inside a Docker container
```
This is where MongoDB Docker Image becomes important.
# More Notes in Docker_Readme.md (Topic - docker network)
---

# Purpose of MongoDB Docker Image

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


---

# Two Common Approaches

## Approach 1 → Connect to Host Machine MongoDB

### URI

```js
const MONGO_URI =
  "mongodb://host.docker.internal:27017/dummy_Db"
```

### Architecture

```txt
Backend Container
        ↓
Host Machine MongoDB
```

### Purpose

`host.docker.internal` allows a Docker container to access services running on the host operating system.

### Pros

- easy local development
- useful for testing
- works with existing local MongoDB installation
- easy debugging using MongoDB Compass
- convenient during early development stages

### Cons

- MongoDB must be installed manually
- project depends on host machine setup
- not fully containerized
- environment consistency may vary between developers


---

# Approach 2 → MongoDB Docker Container (Container-to-Container Communication)

### URI

```js
const MONGO_URI =
  "mongodb://mongodb-container:27017/dummy_Db"
```

### Architecture

```txt
Backend Container
        ↓
MongoDB Container
```

### Purpose

MongoDB itself runs inside Docker container.

Backend container communicates directly with MongoDB container using Docker Network.

### Pros

- fully containerized setup
- no local MongoDB installation needed
- portable architecture
- same setup for all developers
- easier deployment consistency
- cleaner service isolation

### Cons

- requires Docker networking knowledge
- slightly more setup initially


---

# Important Docker Learning

This introduces real container-to-container communication.

Previously:
- frontend container worked independently
- backend container worked independently

But now:
- backend container must communicate with MongoDB container

This introduces Docker Networking.


---

# Why Docker Network Is Needed

Containers are isolated by default.

A container cannot directly communicate with another container automatically.

Docker Network allows containers to:
- communicate privately
- discover each other using container names


---

# How Docker Network Communication Works

## Step 1 → Create Network

```bash
docker network create mynetwork
```


---

## Step 2 → Run MongoDB Container Inside Network

```bash
docker run -d --name mongodb-container --network mynetwork -p 27017:27017 mongo
```

Explanation:
- `mongo` → official MongoDB image
- `mongodb-container` → container name
- `mynetwork` → shared Docker network

Point
- `-p 27017:27017`
  binds MongoDB container port to the host machine.

- This is optional.

Use port binding when:
- host machine needs access to MongoDB
- MongoDB Compass needs connection
- mongosh from host machine is needed
- external tools need access

If only containers inside Docker network need MongoDB communication,
then port binding is not required.

Without `-p`, backend container can still communicate with MongoDB container
through Docker Network internally.

---

## Step 3 → Run Backend Container Inside Same Network

```bash
docker run -d \
--name es-container \
--network mynetwork \
-p 4000:4000 \
express-server
```

---

# Important Concept Learned

Inside Docker Network:

```txt
container-name = hostname
```

So:

```js
mongodb://mongodb-container:27017/dummy_Db
```

works because:
- `mongodb-container` is the MongoDB container name
- Docker internally resolves that name


---

# Final MongoDB URI Format

```js
mongodb://<mongo-container-name>:27017/<db-name>
```

---

# Important Docker Concepts Learned

## 1. Containers Communicate Through Networks

Containers use:
- Docker network
- container names

for internal communication.


---

## 2. Why `127.0.0.1` Behaves Differently

Inside a container:

```txt
127.0.0.1
```

means:

```txt
the same container itself
```

NOT the host machine.


---

## 3. Rebuilding Images After Code Changes

Changing source code does NOT automatically update Docker image.

After changing backend code:

```txt
change code
    ↓
rebuild image
    ↓
recreate container
```


---

# Mongo Shell Access

Open Mongo shell inside container:

```bash
docker exec -it <containerName> mongosh

example
    docker exec -it mongodb-container mongosh

```
---

# Main Learning Outcome

Containerization is not only about running applications inside containers.

Real containerization also includes:
- service-to-service communication
- databases running inside containers
- isolated environments
- portable application architecture
- reproducible development setup
*/