function handler(event) {
  var request = event.request;
  var response = event.response;

  // Static browser assets must retain the body and content type from S3.
  if (request.uri.endsWith('.png') || request.uri === '/favicon.ico') {
    return response;
  }

  var now = new Date();
  var year = now.getUTCFullYear();
  var month = now.getUTCMonth() + 1;
  var day = now.getUTCDate();
  var hour = now.getUTCHours();
  var minute = now.getUTCMinutes();
  var second = now.getUTCSeconds();
  var pad2 = (n) => (n < 10 ? '0' + n : '' + n);
  var timestamp = `${year}${pad2(month)}${pad2(day)}T${pad2(hour)}${pad2(minute)}${pad2(second)}Z`;
  var accept = request.headers.accept ? request.headers.accept.value : '';
  var acceptsHtml = accept.split(',').some((entry) => {
    var parts = entry.trim().toLowerCase().split(';');
    var quality = parts.find((part) => part.trim().startsWith('q='));
    return parts[0].trim() === 'text/html' && (!quality || parseFloat(quality.split('=')[1]) > 0);
  });

  response.statusCode = 200;
  response.statusDescription = 'OK';
  response.headers['x-amz-date'] = { value: timestamp };
  response.headers['cache-control'] = { value: 'no-store' };

  if (acceptsHtml) {
    response.headers['content-type'] = { value: 'text/html; charset=utf-8' };
    response.body = {
      encoding: 'text',
      data: `<!DOCTYPE html>
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
</html>`,
    };
  } else {
    response.headers['content-type'] = { value: 'text/plain; charset=utf-8' };
    response.body = { encoding: 'text', data: timestamp };
  }

  return response;
}
