import http from "node:http";

// stateful
const users = [];

const server = http.createServer((request, response) => {
  const { method, url } = request;
  console.log(method, url);

  if (method === "GET" && url === "/users") {
    return response
      .setHeader("Content-Type", "application/json")
      .end(JSON.stringify(users));
  }

  if (method === "POST" && url === "/users") {
    users.push({
      id: 1,
      name: "John Doe",
      email: "n7d7V@example.com",
    });

    return response.writeHead(201).end();
  }

  return response.writeHead(404).end("NOT FOUND");
});

server.listen(3333);
