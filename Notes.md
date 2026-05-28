<details>
<summary>What is Docker?</summary>

Docker is a platform used to package an application along with everything it needs to run, such as:

- Application code
- Dependencies
- Node modules
- Libraries
- Runtime
- Environment variables

All of these are packed into something called a **Docker container**.

---

## Simple Definition

**Docker** is a tool that helps developers run applications the same way on every computer by packaging the app and all its required files together.

This helps avoid problems like:

- “It works on my machine”
- Missing dependencies
- Different environments
- Version conflicts

A **Docker container** is a small isolated environment where an application runs.

Each container includes:

- The application
- Required dependencies
- Runtime
- Libraries
- Environment configuration

Because everything is included inside the container, the application can run properly on any system that has Docker installed.

---

# Understanding the Concept

![Docker Container Architecture](./screenshots/docker-container-41f0fad4f57d39957867dde84915a3e1.png)

From the image:

- The big box represents the **Docker Platform / Docker Engine**
- Inside Docker, there are multiple applications
- Each application is wrapped inside its own **container**
- Every container is isolated from other containers
- Each container has all the requirements needed to run that specific application

This isolation helps applications run independently without affecting each other.

</details>

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

---

<details>
<summary>Why Docker is Useful</summary>

Docker helps developers:

- Run applications consistently everywhere
- Avoid environment-related issues
- Easily share applications
- Deploy applications faster
- Keep applications isolated and organized

---

# Main Idea of Docker

Docker basically creates the same environment everywhere, so the application runs consistently without crashing due to missing dependencies or system differences.

</details>

---

<details>
<summary>Docker Image Layers ?</summary>

A Docker image is created using multiple layers.

It usually starts with a base image layer, followed by additional layers such as:

- installing dependencies
- copying files
- configuration changes
- exposing ports

These image layers are read-only.

When a container runs from the image, Docker adds a final writable container layer on top of the existing image layers.

- an example you can see in **dockerfile**

</details>

---

<details>
<summary>Docker vs VM ?</summary>

## Virtual Machine (VM)

A Virtual Machine is like creating a completely separate computer inside another computer.

Each VM contains:

- its own Operating System
- its own Kernel
- its own Drivers
- required libraries and applications

Because of this:

- VMs are heavier
- consume more memory/storage
- take more time to start

---

## Docker

Docker is a containerization platform that creates lightweight containers.

Containers do NOT contain a full Operating System or Kernel.

Instead:

- containers share the host system's kernel
- Docker only packages:
  - application code
  - dependencies
  - runtime (Node, Python, etc.)
  - libraries

Because of this:

- containers are lightweight
- start very fast
- consume fewer resources

---

### **Important Point**

Docker containers usually run Linux-based environments.

- **On Linux**:
  - containers directly use the host Linux kernel

- **On Windows/Mac**:
  - Docker Desktop internally creates a lightweight Linux VM
  - containers run inside that Linux environment

---

## Quick Difference

| Virtual Machine             | Docker                           |
| --------------------------- | -------------------------------- |
| Full separate OS            | Shares host kernel               |
| Heavy (to much of Resource) | Lightweight (less Resource)      |
| Slower startup              | Faster startup                   |
| Includes full system        | Includes only app + dependencies |

</details>

---

<details>
<summary>What is Docker Network?</summary>
Docker networking is a mechanism which allows containers to communicate with: other containers, the host machine, external internet

example -> backend container  comunicating with mongodb ( type - bridge network)

Without networking:containers are isolated ie containers cannot talk to each other

---
## Types of Docker Networks
- Bridge Network - container-to-container communication on same machine
- Host Network -  Container shares host machine network directly.
- None Network - No networking. ( Container becomes isolated.)
- Overlay Network - Used across multiple Docker hosts.

</details>

---

<details>
<summary>What is Docker Compose?</summary>

Docker Compose is a tool that helps us manage and run multiple Docker containers together using a single configuration file called `docker-compose.yml`.

Instead of manually building, running, stopping, and configuring each container one by one, Docker Compose automates everything with a single command.

**It also automatically creates a shared network so containers can communicate with each other easily.**

For example, in a full-stack application, frontend, backend, and database containers can all be started together using Docker Compose.

---

## In Simple

Managing and running multiple related containers together using a single configuration file.

</details>
