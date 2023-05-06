const fs = require("fs");
const path = require("path");

const pastFolder = path.resolve(__dirname, "files-copy");
const dataFolder = path.resolve(__dirname, "files");

fs.rm(pastFolder, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
  }

  fs.mkdir(pastFolder, { recursive: true }, (err) => {
    if (err) {
      console.error(err);
    }

    fs.readdir(dataFolder, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
        return;
      }

      files.forEach((file) => {
        fs.copyFile(
          path.join(dataFolder, file.name),
          path.join(pastFolder, file.name),
          (err) => {
            if (err) {
              console.error(err);
              return;
            }
          }
        );
      });
    });
  });
});
