import { createServer, IncomingMessage, ServerResponse } from 'http';

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log("Запрос пришел");
  console.log(req.url);
  // console.log(req.method);
  // console.log(req.headers);
  res.statusMessage = 'OK';
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf8',
  });

  res.end('<h1>Привет, мир!</h1>', 'utf8');
});
server.listen(3000);
