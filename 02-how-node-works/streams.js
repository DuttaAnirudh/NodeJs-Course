const fs = require("fs");
const server = require("http").createServer();

/* Solution 1 */
// server.on("request", (req, res) => {
//   fs.readFile("test-file.txt", (err, data) => {
//     if (err) console.log(err);
//     res.end(data);
//   });
// });

/* Solution 2 */
// server.on("request", (req, res) => {
//   const readable = fs.createReadStream("test-file.txt");

//   // data event
//   readable.on("data", (chunk) => {
//     res.write(chunk);
//   });

//   // end event
//   readable.on("end", () => {
//     res.end();
//   });

//   //   error event
//   readable.on("error", (error) => {
//     console.log(error);
//     res.statusCode(500);
//     res.end("File not found");
//   });
// });

/* Solution 3 */
server.on("request", (req, res) => {
  const readable = fs.createReadStream("test-file.txt");
  // readableSource.pipe(writableDestination)
  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
