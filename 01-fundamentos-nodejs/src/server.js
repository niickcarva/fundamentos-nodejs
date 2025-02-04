import http from "node:http";
import { json } from "./middlewares/json.js";

// stateful
const users = [];
let userId = 1;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);

  await json(req, res);

  if (method === "GET" && url === "/users") {
    return res.end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    const { name, email } = req.body;
    users.push({
      id: userId++,
      name,
      email,
    });

    return res.writeHead(201).end();
  }

  return res.writeHead(404).end("NOT FOUND");
});

server.listen(3333);
