const fs = require("fs");
const superagent = require("superagent");

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   const breed = data;

//   superagent
//     .get(`https://dog.ceo/api/breed/${breed}/images/random`)
//     .end((err, res) => {
//       if (err) {
//         return console.log(err.body.message);
//       }
//       console.log(res.body.message);

//       fs.writeFile("dog-img.txt", res.body.message, (err) => {
//         console.log("Random dog image saved to file");
//       });
//     });
// });

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//     const breed = data;

//     superagent
//       .get(`https://dog.ceo/api/breed/${breed}/images/random`)
//       .then((res) => {
//         console.log(res.body.message);

//         fs.writeFile("dog-img.txt", res.body.message, (err) => {
//           console.log("Random dog image saved to file");
//         });
//       })
//       .catch((err) => console.log(err.message));
//   });

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("File could not be found");

      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject("There was an error creating file");
      }
      resolve("Success");
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     const breed = data;

//     return superagent.get(`https://dog.ceo/api/breed/${breed}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     return writeFilePro("dog-img.txt", res.body.message);
//   })
//   .then(() => console.log("Random dog image saved to file!"))
//   .catch((err) => console.log(err.message));

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    );
    console.log(res.body.message);

    await writeFilePro("dog-img.txt", res.body.message);

    console.log("Random dog image saved to file!");
  } catch (err) {
    console.log(err.message);
  }
};

getDogPic();
