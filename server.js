import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import z from "zod";
import fs from "node:fs/promises";

const app = express();
app.use(cors());
app.use(express.json());

function createMcpServer() {
  const server = new McpServer({
    name: "User-Mcp-Server",
    version: "1.0.0",
    description: "Mcp Server to Manage Users",
  });

  server.registerTool(
    "create_user",
    {
      title: "Create User",
      description: "create a new user",
      inputSchema: {
        name: z.string(),
        email: z.string(),
        address: z.string(),
        phone: z.string(),
      },
    },
    async (args) => {
      try {
        const id = await createUser(args);
        return {
          content: [
            {
              type: "text",
              text: `User ${id} Create Successfully`,
            },
          ],
        };
      } catch (error) {
        console.error("Error creating user:", error);
        return {
          content: [
            {
              type: "text",
              text: "Failed to create a new user",
            },
          ],
        };
      }
    },
  );

  server.registerTool(
    "update_user",
    {
      title: "Update User",
      description: "update an existing user",
      inputSchema: {
        id: z.number(),
        name: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
      },
    },
    async (args) => {
      try {
        const id = await updateUser(args);
        return {
          content: [
            {
              type: "text",
              text: `User ${id} Updated Successfully`,
            },
          ],
        };
      } catch (error) {
        console.error("Error updating user:", error);
        return {
          content: [
            {
              type: "text",
              text: "Failed to update the user",
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerTool(
    "delete_user",
    {
      title: "Delete User",
      description: "delete an existing user",
      inputSchema: {
        id: z.number(),
      },
    },
    async (args) => {
      try {
        const id = await deleteUser(args);
        return {
          content: [
            {
              type: "text",
              text: `User ${id} deleted Successfully`,
            },
          ],
        };
      } catch (error) {
        console.error("Error deleting user:", error);
        return {
          content: [
            {
              type: "text",
              text: "Failed to delete the user",
            },
          ],
          isError: true,
        };
      }
    },
  );
  server.registerTool(
    "get_user",
    {
      title: "Get User",
      description:
        "Retrieve a single user by their unique user ID. Use this when the user asks for details about a specific user.",
      inputSchema: {
        id: z.number(),
      },
    },
    async (args) => {
      try {
        const user = await getUser(args);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(user, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error retrieving user:", error);
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve the user",
            },
          ],
          isError: true,
        };
      }
    },
  );
  server.registerTool(
    "get_all_users",
    {
      title: "Get All Users",
      description:
        "Retrieve all users from the user database. Use this when the user asks to list or search all users.",
      inputSchema: {},
    },
    async (args) => {
      try {
        const users = await getAllUsers();
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(users, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error("Error retrieving users:", error);
        return {
          content: [
            {
              type: "text",
              text: "Failed to retrieve the users",
            },
          ],
          isError: true,
        };
      }
    },
  );

  server.registerResource(
    "user-api-guide",
    "http://localhost:5001/mcp/guide",
    {
      title: "User API Guide",
      description: "Guide for creating and managing user",
      mimeType: "text/plain",
    },
    async () => {
      return {
        contents: [
          {
            uri: "http://localhost:5001/mcp/guide",
            text: `
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
                    `,
          },
        ],
      };
    },
  );

  server.registerPrompt(
    "create-user",
    {
      title:"Create User",
      description: "create new user",
    },
    async () => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a random user. Generate a random name, unique email,
                    address, and phone number, then call create_user with
                    name, email, address, and phone. Do not ask the user for input.`,
            },
          },
        ],
      };
    },
  );

  return server;
}
async function readUsers() {
  const data = await fs.readFile("./model/users.json", "utf-8");
  return JSON.parse(data);
}

async function writeUsers(users) {
  await fs.writeFile("./model/users.json", JSON.stringify(users, null, 2));
}

async function createUser(user) {
  const users = await readUsers();
  const id = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  users.push({
    id,
    ...user,
  });
  await writeUsers(users);
  return id;
}

async function updateUser(user) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === user.id);
  if (index === -1) {
    throw new Error(`User with id ${user.id} not found`);
  }
  users[index] = {
    ...users[index],
    ...user,
  };
  await writeUsers(users);
  return user.id;
}

async function deleteUser(user) {
  const users = await readUsers();
  const updatedUsers = users.filter((u) => u.id !== user.id);
  if (updatedUsers.length === users.length) {
    throw new Error(`User with id ${user.id} not found`);
  }
  await writeUsers(updatedUsers);
  return user.id;
}

async function getUser(user) {
  const users = await readUsers();
  const foundUser = users.find((u) => u.id === user.id);
  if (!foundUser) {
    throw new Error(`User with id ${user.id} not found`);
  }
  return foundUser;
}

async function getAllUsers() {
  const users = await readUsers();
  return users;
}

app.get("/mcp", (req, res) => {
  res.status(200).send("MCP GET endpoint reached");
});

app.post("/mcp", async (req, res) => {
  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    req.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });
  }
});

app.listen(5001, () => {
  console.log("MCP Server Running on http://localhost:5001");
});
