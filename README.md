# User Management MCP Server

A simple **Model Context Protocol (MCP) server** for managing users through AI-compatible MCP clients.

This project is built with **Node.js, Express, and the official MCP SDK**. It demonstrates how to expose backend functionality through MCP **Tools, Resources, and Prompts**, with **Zod-based input validation** and **Streamable HTTP transport**.

---

## Features

* Create users
* Get a user by ID
* Get all users
* Update users
* Delete users
* MCP Tools
* MCP Resource
* MCP Prompt
* Zod input validation
* Streamable HTTP transport
* JSON file-based data storage
* Express HTTP server
* CORS support
* Compatible with MCP clients such as Cursor

---

## Tech Stack

* **Node.js**
* **Express.js**
* **Model Context Protocol (MCP) SDK**
* **Zod**
* **Streamable HTTP**
* **JavaScript (ES Modules)**
* **JSON**

---

## Project Architecture

```text
┌─────────────────────┐
│     MCP Client      │
│  Cursor / AI Client │
└──────────┬──────────┘
           │
           │ Streamable HTTP
           ▼
┌─────────────────────┐
│     MCP Server      │
│   Express + MCP SDK │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
  MCP Tools   MCP Resource
     │           │
     └─────┬─────┘
           │
           ▼
     User Management
           │
           ▼
      users.json
```

---

## MCP Components

This project demonstrates the three main MCP capabilities:

### 1. Tools

The server exposes the following tools:

| Tool            | Description              |
| --------------- | ------------------------ |
| `create_user`   | Creates a new user       |
| `get_user`      | Retrieves a user by ID   |
| `get_all_users` | Retrieves all users      |
| `update_user`   | Updates an existing user |
| `delete_user`   | Deletes an existing user |

### `create_user`

Creates a new user.

Required fields:

```text
name
email
address
phone
```

Example:

```json
{
  "name": "Ajith Kumar",
  "email": "ajith@example.com",
  "address": "Chennai, Tamil Nadu",
  "phone": "9876543210"
}
```

---

### `get_user`

Retrieves a specific user using their ID.

Example:

```json
{
  "id": 1
}
```

---

### `get_all_users`

Returns all users stored in the user database.

No input is required.

---

### `update_user`

Updates an existing user.

Required:

```text
id
```

Optional:

```text
name
email
address
phone
```

Example:

```json
{
  "id": 1,
  "name": "Ajith Kumar",
  "phone": "9876500000"
}
```

---

### `delete_user`

Deletes a user using their ID.

Example:

```json
{
  "id": 1
}
```

---

## MCP Resource

The server also exposes an MCP Resource named:

```text
user-api-guide
```

Resource URI:

```text
http://localhost:5001/mcp/guide
```

The resource provides information about the available user-management tools and their required parameters.

Example information provided by the resource:

```text
User Management MCP API

Available tools:

create_user
- Creates a new user
- Required: name, email, address, phone

get_user
- Gets a user by ID
- Required: id

get_all_users
- Returns all users

update_user
- Updates an existing user
- Required: id
- Optional: name, email, address, phone

delete_user
- Deletes a user
- Required: id
```

---

## MCP Prompt

The server provides an MCP Prompt:

```text
create-user
```

The prompt instructs the MCP client to generate a random user and call the `create_user` tool automatically.

Example workflow:

```text
MCP Client
    ↓
create-user Prompt
    ↓
Generate random user information
    ↓
create_user Tool
    ↓
User saved to users.json
```

This demonstrates how MCP Prompts can be used to provide reusable instructions to an AI client.

---

## Input Validation

The project uses **Zod** to validate tool inputs.

Example:

```javascript
inputSchema: {
  name: z.string(),
  email: z.string(),
  address: z.string(),
  phone: z.string(),
}
```

For update operations, the fields are optional except for the user ID:

```javascript
inputSchema: {
  id: z.number(),
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
}
```

This helps ensure that MCP tool calls receive the expected input structure.

---

## Data Storage

For simplicity, this project uses a JSON file as the data store:

```text
model/
└── users.json
```

User operations read and write directly to this file.

Example:

```json
[
  {
    "id": 1,
    "name": "Ajith Kumar",
    "email": "ajith@example.com",
    "address": "Chennai",
    "phone": "9876543210"
  }
]
```

> This JSON-based storage is intended for learning and demonstration purposes. A production application should use a database such as PostgreSQL, MongoDB, or MySQL.

---

## Project Structure

```text
mcp-server/
│
├── model/
│   └── users.json
│
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

## Installation

Clone the repository:

```bash
git clone https://github.com/ajith-fullstack/mcp-server.git
```

Navigate into the project:

```bash
cd mcp-server
```

Install dependencies:

```bash
npm install
```

---

## Run the Server

Start the server:

```bash
npm start
```

The MCP server will start on:

```text
http://localhost:5001
```

MCP endpoint:

```text
http://localhost:5001/mcp
```

The project currently uses port `5001` for the Express/MCP server.

---

## Development Mode

The project also includes a development script using Nodemon.

Run:

```bash
npm run dev
```

This automatically restarts the server when source files are changed.

---

## Connecting with Cursor

This MCP server can be connected to MCP-compatible clients such as **Cursor**.

Example MCP configuration:

```json
{
  "mcpServers": {
    "user-management": {
      "url": "http://localhost:5001/mcp"
    }
  }
}
```

After connecting the server, the MCP client can discover and use the available tools.

For example:

```text
User:
Create a new user named Ajith Kumar.

        ↓

MCP Client

        ↓

create_user

        ↓

MCP Server

        ↓

users.json
```

The server can therefore expose existing backend functionality to an AI client through the MCP protocol.

---

## Example MCP Workflow

### Create User

```text
AI Client
   ↓
create_user
   ↓
MCP Server
   ↓
User Service
   ↓
users.json
```

### Get User

```text
AI Client
   ↓
get_user
   ↓
MCP Server
   ↓
users.json
   ↓
User information
```

### Update User

```text
AI Client
   ↓
update_user
   ↓
MCP Server
   ↓
users.json
```

### Delete User

```text
AI Client
   ↓
delete_user
   ↓
MCP Server
   ↓
users.json
```

---

## API Endpoint

### MCP Endpoint

```http
POST /mcp
```

The MCP server uses **Streamable HTTP transport** to handle MCP requests.

### Health / GET Endpoint

```http
GET /mcp
```

Response:

```text
MCP GET endpoint reached
```

---

## Dependencies

Main dependencies:

```text
@modelcontextprotocol/sdk
express
zod
```

Development dependency:

```text
nodemon
```

The current project uses the MCP SDK, Express 5, Zod 4, CORS, and Nodemon.

---

## What I Learned

This project was built to understand how **Model Context Protocol (MCP)** can be used to expose backend functionality to AI applications.

Key concepts implemented:

* MCP Server setup
* MCP Tool registration
* MCP Resource registration
* MCP Prompt registration
* Tool input validation using Zod
* Streamable HTTP transport
* Express integration
* CRUD operations
* AI client integration
* Tool discovery
* Tool invocation
* Backend execution through MCP

---

## License

This project is open source and available for learning and development purposes.

---

## Author

**Ajithkumar**

GitHub:

https://github.com/ajith-fullstack

Repository:

https://github.com/ajith-fullstack/mcp-server

```

This version matches the implementation in your repository, including the **five tools, `user-api-guide` resource, `create-user` prompt, Zod schemas, and Streamable HTTP endpoint**.

```
