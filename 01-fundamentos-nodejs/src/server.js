import http from "node:http";
import { json } from "./middlewares/json.js";
import { Database } from "./database.js";

// stateful
const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);

  await json(req, res);

  if (method === "GET" && url === "/users") {
    return res.end(JSON.stringify(database.select("users")));
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = req.body;
    const user = {
      id: 1,
      name,
      email,
    };

    database.insert("users", user);

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end("NOT FOUND");
});

server.listen(3333);
