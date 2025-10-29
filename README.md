# ComputeNet
## Introduction
This project is a distributed computing platform that enables users to donate their idle CPU power to collectively solve computational problems. By connecting a network of volunteer clients with a system that distributes workloads and aggregates results.

### File Layout 
```
ComputeNet/
├── controller/
│   ├── server.js
│   ├── server.test.js
│   ├── package.json
│   ├── eslint.config.mjs
│   ├── views/
│   │   └── index.pug
│   └── Dockerfile
├── worker/
│   ├── worker.py
│   ├── pyproject.toml
│   └── Dockerfile
├── kubernetes/
│   ├── controller.yaml
│   ├── worker.yaml
│   └── database.yaml
├── .github/
│   └── workflows/
│       ├── docker-publish.yml
│       ├── test.yml
│       └── codeFormat.yml
├── .devcontainer/
│   └── devcontainer.json
├── compose.yaml
├── Makefile
├── .prettierrc
├── .gitignore
└── README.md
```

### Architecture

```mermaid
graph TD
    subgraph Frontend
        FE[Web UI (Using Pug)]
    end

    subgraph Controller
        CTRL[Node.js Server<br/>Express + MongoDB]
    end

    subgraph Workers
        W1[Python Worker 1<br/>Polls for Tasks]
        W2[Python Worker 2<br/>Executes Task]
        W3[Python Worker N<br/>Submits Result]
    end

    FE -- Submit/View Tasks --> CTRL
    W1 -- GET /task --> CTRL
    W2 -- Process Task --> W2
    W2 -- POST /result --> CTRL
    W3 -- Repeats loop --> CTRL
```

### Database
#### Tasks
|field | type | 
| --- | --- |
|number | int|
|chainLength | int| 
|byUser | GUID |

#### Users
|field | type | 
| --- | --- |
| currentTask | GUID|

## How To Run

### Using Docker Compose
```bash
docker-compose up
```

### Development
1. Install dependencies:
   ```bash
   cd controller && npm install
   cd ../worker && pip install -e .
   ```

2. Run the controller:
   ```bash
   cd controller && npm start
   ```

3. Run a worker:
   ```bash
   cd worker && python worker.py
   ```

## LICENSE
This project uses the [MIT License](./LICENSE)

## Contributors
- [Uplink036](https://github.com/Uplink036)