# ComputeNet
## Introduction
This project is a supposed to be showcase a distributed computing platform that enables users to donate their idle CPU power to collectively solve computational problems. By connecting a network of volunteer clients with a system that distributes workloads and aggregates results.

### File Layout 
``` File Structure
ComputeNet/
├── backend/
│   ├── app.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── Dockerfile
├── client/
│   ├── agent.js
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

### Architechutre

``` Mermaid
graph TD
    subgraph Frontend
        FE[Pure JavaScript UI]
    end

    subgraph Clients (Docker Agents)
        C1[Client Agent 1<br/>Polls for Tasks]
        C2[Client Agent 2<br/>Executes Task]
        C3[Client Agent N<br/>Submits Result]
    end

    subgraph Backend (Node.js API)
        API[Node.js REST API<br/>(Express or Fastify)]
        Queue[MongoDB Task Queue<br/>(tasks, results)]
    end

    FE -- Submit/View Tasks --> API
    C1 -- GET /task --> API
    C2 -- Process Task --> C2
    C2 -- POST /result --> API
    C3 -- Repeats loop --> API

    API --> Queue
    Queue --> API
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
## LICENSE
This project uses the [MIT License](./LICENSE)

## Contributures
- [Uplink036](https://github.com/Uplink036)