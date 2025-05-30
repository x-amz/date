function handler(event) {
  var response = event.response;
  
  if (request.uri.endsWith('.png')) {
    return response;
  }

  var now = new Date();

  // Precompute each part manually to avoid closure + method calls
  var year = now.getUTCFullYear();
  var month = now.getUTCMonth() + 1;
  var day = now.getUTCDate();
  var hour = now.getUTCHours();
  var minute = now.getUTCMinutes();
  var second = now.getUTCSeconds();

  // Inline padding with arithmetic to avoid string method overhead
  var pad2 = (n) => (n < 10 ? '0' + n : '' + n);

  var timestamp = `${year}${pad2(month)}${pad2(day)}T${pad2(hour)}${pad2(minute)}${pad2(second)}Z`;

  response.statusCode = 200;
  response.statusDescription = 'OK';
  response.headers['x-amz-date'] = { value: timestamp };
  response.headers['content-type'] = { value: 'text/html' };
  response.headers['cache-control'] = { value: 'no-store' };
  response.body = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>x-amz-date</title>
  <meta property="og:title" content="x-amz-date" />
  <meta property="og:image" content="https://x-amz.date/preview.png" />
  <meta property="og:description" content="Current x-amz-date timestamp" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://x-amz.date/" />
</head>
<body>
  <code>${timestamp}</code>
</body>
</html>
  `;

  return response;
}
