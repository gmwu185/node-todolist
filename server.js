const http = require('http');
const { v4: uuidv4 } = require('uuid');
const { errorHandle, successHandle } = require('./statusHandle');
const todos = [{ title: '(預設要做的事) 今天要刷牙', id: uuidv4() }];

const requestListener = (req, res) => {
  let body = '';
  req.on('data', (chunk) => (body += chunk));
  switch (true) {
    case req.method == 'GET' && req.url == '/todos':
      successHandle(res, todos);
      break;
    case req.method == 'POST' && req.url == '/todos':
      req.on('end', () => {
        try {
          let title = JSON.parse(body).title;
          if (title !== undefined) {
            let todo = {
              title: title,
              id: uuidv4(),
            };
            todos.push(todo);
            successHandle(res, todos);
          } else {
            errorHandle(res);
          }
        } catch (error) {
          errorHandle(res);
        }
      });
      break;
    case req.method == 'DELETE' && req.url == '/todos':
      todos.length = 0;
      successHandle(res, todos);
      break;
    case req.method == 'DELETE' && req.url.startsWith('/todos/'):
      const index = todos.findIndex((element) => element.id == req.url.split('/').pop());
      index !== -1
        ? (todos.splice(index, 1), successHandle(res, todos))
        : errorHandle(res, );
      break;
    case req.method == 'PATCH' && req.url.startsWith('/todos/'):
      req.on('end', () => {
        try {
          const newTitle = JSON.parse(body).title;
          const index = todos.findIndex((element) => element.id == req.url.split('/').pop());
          if (newTitle !== undefined) {
            index !== -1
              ? ((todos[index].title = newTitle), successHandle(res, todos))
              : errorHandle(res);
          }
        } catch (err) {
          errorHandle(res);
        }
      });
      break;
    case req.method == 'OPTIONS':
      successHandle(res);
      break;
    default:
      // 當以上條件都不匹配時
      res.writeHead(404);
      res.write(
        JSON.stringify({
          status: 'false',
          message: '無此網站路由',
        })
      );
      res.end();
      break;
  }
};
const server = http.createServer(requestListener);

const PORT = process.env.PORT || 3005;
server.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
