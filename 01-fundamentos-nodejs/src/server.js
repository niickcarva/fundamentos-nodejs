import http from "node:http";

// stateful
const users = [];
let userId = 1;

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);

  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString());
  } catch {
    req.body = null;
  }

  if (method === "GET" && url === "/users") {
    return res
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(users));
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
