import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

// stateless
const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { search, limit, page } = req.query;
      const users = database.select(
        "users",
        search
          ? {
              name: search,
              email: search,
            }
          : null,
        limit,
        page
      );

      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Name and email are required",
          })
        );
      } else if (database.select("users", { email }, 1).length) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "User already exists",
          })
        );
      }

      const user = {
        id: randomUUID(),
        name,
        email,
      };

      database.insert("users", user);

      return res.writeHead(201).end(JSON.stringify(user));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      database.delete("users", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;

      database.update("users", id, { name, email });
      return res.writeHead(204).end();
    },
  },
];
