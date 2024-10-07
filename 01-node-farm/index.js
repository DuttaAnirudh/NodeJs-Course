const fs = require("fs");
const http = require("http");
const url = require("url");

// const hello = "Hello world";
// console.log(hello);

/**************************************/
/**************************************/
/** FILES **/

/** Blocking - Synchronous Way **/
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInput);

// const textOut = `This is what we know about the avocado: ${textInput} \n Created on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written");

/** Non-Blocking - Asynchronous Way **/
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("Error!");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);
//       fs.writeFile(`./txt/final.txt`, `${data2} \n ${data3}`, () => {
//         console.log("Your file has been written");
//       });
//     });
//   });
// });

/**************************************/
/**************************************/
/** SERVER **/

/** Creating a Server **/

const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathName = req.url;

  if (pathName === "/" || pathName === "/overview") {
    res.end("This is the Overview");
  } else if (pathName === "/product") {
    res.end("This is the Product");
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world", // custom header
    });
    res.end("<h1>404: Page does not exist</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
