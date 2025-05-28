function handler(event) {
  var response = event.response;
  var now = new Date();
  var pad = (n) => n.toString().padStart(2, '0');
  var timestamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  response.statusCode = 200;
  response.statusDescription = 'OK';
  response.headers['content-type'] = { value: 'text/plain' };
  response.headers['x-amz-date'] = { value: timestamp };
  response.body = {
    encoding: 'text',
    data: timestamp,
  };
  return response;
}
