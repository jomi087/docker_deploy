# Docker Learning Notes

> Structured learning notes for understanding Docker step-by-step.

---

# Table of Contents

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
- [Extra Concepts](#extra-concepts)

---

# Step-1 Create Dockerfile

Create a file named:

```txt
Dockerfile
```

## Purpose

Docker reads this file line-by-line and follows the instructions written inside it.

This file contains:

- environment setup
- dependencies
- runtime instructions
- startup command

---

# Step-2 Choose Base Image

Instruction:

```dockerfile
FROM node:22-slim
```

## What This Does

This tells Docker:

```txt
Start building our image
using an existing Node.js image.
```

## Why Base Image Is Needed

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

## Format

```txt
node:<version>-<distribution>-<variant>
```

Example:

```dockerfile
FROM node:22-bookworm-slim
```

| Part | Meaning |
|------|----------|
| node | official Node image |
| 22 | Node version |
| bookworm | Debian 12 |
| slim | lightweight variant |

</details>

---

<details>
<summary>Deep Dive: Linux Distributions</summary>

Docker containers usually run Linux.

Common Linux distributions:

| Distribution | Usage |
|--------------|-------|
| Ubuntu | Beginner friendly |
| Debian | Stable servers |
| Alpine | Lightweight |
| Fedora | Latest technologies |
| Arch | Advanced/custom setups |

### Debian Versions

| Debian Version | Codename |
|----------------|----------|
| Debian 11 | bullseye |
| Debian 12 | bookworm |
| Debian 13 | trixie |

</details>

---

<details>
<summary>Deep Dive: Image Variants</summary>

| Variant | Meaning |
|---------|----------|
| full/default | Includes most tools |
| slim | Smaller image |
| distroless | Minimal OS tools |
| debug | Includes debugging tools |

</details>

---

# Step-3 Create Working Directory

Instruction:

```dockerfile
WORKDIR /app
```

## What This Does

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

## Why WORKDIR Is Important

Without WORKDIR:

- files become disorganized
- commands become harder to manage
- project structure becomes messy

---

# Step-4 Copy Package Files

Instruction:

```dockerfile
COPY package*.json .
```

## What This Does

Copies:

- package.json
- package-lock.json

into:

```txt
/app
```

inside the container.

## Understanding the Dot

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

## Why Copy package.json First

Docker uses layer caching.

Dependencies usually do not change frequently.

So Docker can reuse the existing dependency layer instead of reinstalling packages every build.

This improves build speed significantly.

---

# Step-5 Install Dependencies

Instruction:

```dockerfile
RUN npm install
```

## What This Does

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

## Why Install Inside Container

The container needs:

- isolated dependencies
- Linux-compatible packages
- self-contained environment

---

# Step-6 Copy Remaining Source Code

Instruction:

```dockerfile
COPY . .
```

## What This Does

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

## Why COPY Happens Twice

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

# Step-7 Create .dockerignore

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

## Why Ignore node_modules

### Reason 1 — Duplicate Dependencies

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

### Reason 2 — OS Compatibility

Your local machine may use:

- Windows
- macOS

But containers usually use Linux.

Some packages contain compiled binaries that may fail across operating systems.

---

### Reason 3 — Faster Builds

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

# Step-8 Expose Port

Instruction:

```dockerfile
EXPOSE 4000
```

## What This Does

Tells Docker:

```txt
Application inside the container
uses port 4000
```

## Important Note

`EXPOSE` does NOT make the port public.

It mainly acts as:

- metadata
- documentation
- container information

---

# Step-9 Add Start Command

Instruction:

```dockerfile
CMD ["npm", "start"]
```

## What This Does

When the container starts, Docker automatically runs:

```bash
npm start
```

## Why CMD Is Needed

Containers need to know:

```txt
What should run after startup?
```

CMD defines the default startup command.

# Step-10 Host Binding

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
```

browser still may NOT connect.

---

## Solution

Bind application to:

```txt
0.0.0.0
```

which means:

```txt
Accept connections from outside container
```

---

## Where Usually Required

Mostly frontend development servers:

- Vite
- React dev server
- Next.js dev mode
- Vue dev server

Example:

```json
"start": "vite --host 0.0.0.0"
```

---

## Express / Node.js

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

# Step-11 Build Docker Image

Command:

```bash
docker build -t my-app .
```

## What This Does

Docker reads the Dockerfile and creates a Docker image.

The image contains:

- application code
- dependencies
- runtime
- OS environment

---

## Understanding the Command

| Part | Meaning |
|------|----------|
| docker build | build image |
| -t | assign image name/tag |
| my-app | image name |
| . | build context |

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

## Verify Images

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

# Step-12 Run Container

Command:

```bash
docker run --name my-container -p 4000:4000 my-app
```

## What This Does

Creates and starts a container from the Docker image.

---

## Port Mapping

Syntax:

```txt
HOST_PORT : CONTAINER_PORT
```

Example:

```txt
4000:4000
```

Meaning:

```txt
localhost:4000 on your computer
forwards traffic to
port 4000 inside the container
```

---

## Request Flow

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

## Important Difference

### docker run -p

Only forwards traffic.

### 0.0.0.0

Allows outside connections into the container.

Both are required.

---

# Useful Docker Commands

## Stop Container

```bash
docker stop <container-name>
```

---

## Show Running Containers

```bash
docker ps
```

---

## Show All Containers

```bash
docker ps -a
```

---

# Extra Concepts

These concepts are useful but not required for initial Dockerfile understanding.

- Image vs Container
- Layer Caching
- Build Context
- Docker Daemon
- Linux Distributions
- Container Networking

---

<details>
<summary>Image vs Container</summary>

## Docker Image

- blueprint/template
- not running
- created from Dockerfile

Contains:

- code
- dependencies
- runtime
- OS setup

---

## Docker Container

- running instance of image
- isolated environment
- where app actually runs

Example:

```txt
Image = blueprint
Container = running machine from blueprint
```

</details>
