import http from "node:http";
import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";

const server = http.createServer(async (req, res) => {
  const { method, url } = req;
  console.log(method, url);

  await json(req, res);

  const route = routes.find(
    (route) => route.method === method && route.path.test(url)
  );

  if (route) {
    const routeParams = req.url.match(route.path);
    req.params = { ...routeParams.groups };
    return route.handler(req, res);
  }

  return res.writeHead(404).end("NOT FOUND");
});

server.listen(3333);
