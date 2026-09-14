# User Management MCP Server

A simple Model Context Protocol (MCP) server built with
Node.js, Express and the MCP SDK.

## Features

- Create user
- Get user
- Get all users
- Update user
- Delete user
- MCP Resource
- MCP Prompt
- Zod input validation
- Streamable HTTP transport

## Architecture

Client
   ↓
MCP Client
   ↓
Streamable HTTP
   ↓
MCP Server
   ↓
User Service
   ↓
users.json

## MCP Tools

### create_user

Creates a new user.

### get_user

Gets a user by ID.

### get_all_users

Gets all users.

### update_user

Updates an existing user.

### delete_user

Deletes an existing user.

## Run

npm install

npm start

MCP endpoint:

http://localhost:5001/mcp