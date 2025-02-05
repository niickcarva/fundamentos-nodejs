import { randomUUID } from "node:crypto";
import { Database } from "./database.js";

// stateless
const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/users",
    handler: (req, res) => {
      return res.end(JSON.stringify(database.select("users")));
    },
  },
  {
    method: "POST",
    path: "/users",
    handler: (req, res) => {
      const { name, email } = req.body;
      const user = {
        id: randomUUID(),
        name,
        email,
      };

      database.insert("users", user);

      return res.writeHead(201).end();
    },
  },
];
