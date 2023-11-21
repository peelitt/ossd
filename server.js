var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    mime = require("mime"),
    port = process.argv[2] || 8888;

http.createServer(function (request, response) {
  var uri = url.parse(request.url).pathname;
  var filename = path.join(process.cwd(), "/freeboard", uri);

  fs.access(filename, fs.constants.F_OK, (err) => {
    if (err) {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) {
      filename += '/index.html';
    }

    fs.readFile(filename, "binary", function (err, file) {
      if (err) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write(err + "\n");
        response.end();
        return;
      }

      response.writeHead(200, { "Content-Type": mime.getType(filename) }); // 수정된 부분
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));

console.log("Freeboard Server running as PORT " + port + "\nPress CTRL + C to stop");
