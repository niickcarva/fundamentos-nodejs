import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { readCsvFile } from "./utils/read-csv-file.js";

// stateless
const database = new Database();

export const routes = [
  // -- USERS --
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
  // -- USERS --

  // -- TASKS --
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search, limit, page } = req.query;
      const tasks = database.select(
        "tasks",
        search
          ? {
              title: search,
              description: search,
            }
          : null,
        limit,
        page
      );

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body || {};

      if (!title) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Title is required",
          })
        );
      } else if (database.select("tasks", { title }, 1).length) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task already exists with this title",
          })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      if (!database.select("tasks", { id }, 1).length) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task not found",
          })
        );
      }

      database.delete("tasks", id);
      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const previousTask = database.select("tasks", { id }, 1)?.[0];
      const { title, description } = req.body || {};

      if (!previousTask.id) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task not found",
          })
        );
      } else if (!title && !description) {
        return res.writeHead(200).end(
          JSON.stringify({
            message: "Nothing to update",
          })
        );
      }

      database.update("tasks", id, {
        title: title || previousTask.title,
        description: description || previousTask.description,
      });
      return res.writeHead(204).end();
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;
      const previousTask = database.select("tasks", { id }, 1)?.[0];

      if (!previousTask.id) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Task not found",
          })
        );
      }

      database.update("tasks", id, {
        completed_at: previousTask.completed_at ? null : new Date(),
      });
      return res.writeHead(204).end();
    },
  },
  // -- TASKS --

  // -- CSV --
  {
    method: "POST",
    path: buildRoutePath("/import-csv/:entity"),
    handler: (req, res) => {
      const { entity } = req.params;
      readCsvFile(entity);
      return res.writeHead(204).end();
    },
  },
  // -- CSV --
];
