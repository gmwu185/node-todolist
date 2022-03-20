const headers = require('./Header');

function errorHandle(res) {
  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: 'module.exports -> 欄位未填寫正確或無此 todo id',
    })
  );
  res.end();
}
let successHandle = (res, data) => {
  res.writeHead(200, headers);
  if (data !== undefined) {
    res.write(
      JSON.stringify({
        status: 'success',
        data: data,
      })
    );
  }
  res.end();
};

module.exports = {
  errorHandle,
  successHandle,
};
