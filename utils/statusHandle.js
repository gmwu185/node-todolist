const headers = require('./Header');

const errorMessage = {
  400: '格式錯誤',
  4001: '無此 ID',
  4002: 'body 解析錯誤',
  404: '無此網站路由',
};

function errorHandle(res, errorNum) {
  let HeadNum = null;
  errorNum == 404 ? (HeadNum = 404) : (HeadNum = 400);
  res.writeHead(HeadNum, headers);
  res.write(
    JSON.stringify({
      status: 'false',
      message: errorMessage[errorNum],
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
