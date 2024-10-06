const fs = require("fs");

// const hello = "Hello world";
// console.log(hello);

const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textInput);

const textOut = `This is what we know about the avocado: ${textInput} \n Created on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File written");
