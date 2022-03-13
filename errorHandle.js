function errorHandle(res) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json',
  };
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: 'module.exports -> 欄位未填寫正確或無此 todo id',
    })
  );
  res.end();
}

module.exports = errorHandle;