const fs = require("fs");
const path = require("path");

const folderStyles = path.join(__dirname, "styles");

const writeFileA = async (path, data) => {
  return new Promise((resolve, reject) =>
    fs.writeFile(path, "", (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve();
    })
  );
};

const appendFileA = async (path, data) => {
  return new Promise((resolve, reject) =>
    fs.appendFile(path, data, (err) => {
      if (err) {
        return reject(err.message);
      }
      resolve();
    })
  );
};

writeFileA(path.resolve(__dirname, "project-dist", "bundle.css"), "")
  .then(() => {
    fs.readdir(folderStyles, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        const fileName = file.name.split(".");
        const fileExtention = fileName[fileName.length - 1];
        // console.log(file.name);
        // const filePath = path.join(folderStyles, file.name);

        if (fileExtention === "css") {
          const filePath = path.join(folderStyles, file.name);
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error(err);
              return;
            }

            appendFileA(
              path.resolve(__dirname, "project-dist", "bundle.css"),
              data
            );
          });
        }
      });
    });
  })

  .catch((err) => console.log(err.message));
