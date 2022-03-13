const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errorHandle = require('./errorHandle');
const todos = [
  // { title: '(預設要做的事) 今天要刷牙', id: uuidv4() },
  // { title: '(預設要做的事) 今天要洗臉', id: uuidv4() },
  // { title: '(預設要做的事) 今天要吃飯', id: uuidv4() },
];
const requestListener = (req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  // console.log(req.url); // 取得網址呫徑
  // console.log(req.method); // 取得請求方法
  let body = '';
  req.on('data', (chunk) => {
    // console.log('req.on(data) chunk =>', chunk);
    body += chunk;
  });
  if (req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        let title = JSON.parse(body).title;
        console.log('POST body => title', title);
        if (title !== undefined) {
          let todo = {
            title: title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos, // [{ title: 'POST' }],
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch (error) {
        console.log('程式錯誤', error);
        errorHandle(res);
      }
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        status: 'success',
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex((element) => element.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: 'success',
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    /* 小步測試 PATCH 請求 ------------------------------------------------------------ */
    // res.writeHead(200, headers);
    // res.write(
    //   JSON.stringify({
    //     status: 'success',
    //     data: todos,
    //     method: 'PATCH',
    //   })
    // );
    // res.end();
    /* /小步測試 PATCH 請求 ------------------------------------------------------------ */
    req.on('end', () => {
      try {
        const newTitle = JSON.parse(body).title;
        const id = req.url.split('/').pop();
        const index = todos.findIndex((element) => element.id == id);
        if (newTitle !== undefined && index !== -1) {
          todos[index].title = newTitle;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              status: 'success',
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
        console.log('newTitle:', newTitle, 'id:', id, 'index:', index);
      } catch (err) {
        errorHandle(res);
      }
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(400, headers);
    res.write(
      JSON.stringify({
        status: 'false',
        message: '無此網站路由',
      })
    );
    res.end();
  }
};
const server = http.createServer(requestListener);
server.listen(3005);
