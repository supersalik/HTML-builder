const fs = require("fs").promises;
const path = require("path");

const folderStyles = path.resolve(__dirname, "styles");
const projectFolder = path.resolve(__dirname, "project-dist");

const writeFileA = async (path, data) => {
  try {
    await fs.writeFile(path, "", "utf8");
  } catch (err) {
    console.log(err.message);
  }
};

const appendFileA = async (path, data) => {
  try {
    await fs.appendFile(path, data, "utf8");
  } catch (err) {
    console.log(err.message);
  }
};

const removeDir = async (path) => {
  try {
    await fs.rm(path, { recursive: true, force: true });
  } catch (err) {
    console.log(err.message);
  }
};

const makeDir = async (path) => {
  try {
    await fs.mkdir(path, { recursive: true });
  } catch (err) {
    console.log(err.message);
  }
};

const styleFilecreator = async () => {
  try {
    const files = await fs.readdir(folderStyles, { withFileTypes: true });
    for (const file of files) {
      const fileName = file.name.split(".");
      const fileExtention = fileName[fileName.length - 1];

      if (fileExtention === "css") {
        const filePath = path.join(folderStyles, file.name);
        const data = await fs.readFile(filePath, "utf8");
        await appendFileA(path.join(projectFolder, "style.css"), data);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

const copyFolder = async () => {
  try {
    const pastFolder = path.resolve(__dirname, "project-dist", "assets");
    const dataFolder = path.resolve(__dirname, "assets");

    await fs.rm(pastFolder, { recursive: true, force: true });

    await fs.mkdir(pastFolder, { recursive: true });

    const files = await fs.readdir(dataFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        const pastFolderDir = path.resolve(
          __dirname,
          "project-dist",
          "assets",
          file.name
        );

        const dataFolderDir = path.resolve(__dirname, "assets", file.name);

        await fs.mkdir(pastFolderDir, { recursive: true });
        const filesDir = await fs.readdir(dataFolderDir, {
          withFileTypes: true,
        });
        for (const fileIn of filesDir) {
          await fs.copyFile(
            path.join(dataFolderDir, fileIn.name),
            path.join(pastFolderDir, fileIn.name)
          );
        }
      }

      if (file.isFile()) {
        await fs.copyFile(
          path.join(dataFolder, file.name),
          path.join(pastFolder, file.name)
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

const htmlBuilder = async () => {
  try {
    let html = await fs.readFile(
      path.resolve(__dirname, "template.html"),
      "utf-8"
    );

    const componentsFolder = path.resolve(__dirname, "components");
    const files = await fs.readdir(componentsFolder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile() && file.name.slice(-4) === "html") {
        const componentName = file.name.slice(0, -5);
        const code = await fs.readFile(
          path.resolve(componentsFolder, file.name),
          "utf-8"
        );
        if (html.includes(`{{${componentName}}}`)) {
          html = html.replace(`{{${componentName}}}`, code);
        }
      }
    }
    fs.writeFile(path.resolve(projectFolder, "index.html"), html);
  } catch (err) {
    console.log(err.message);
  }
};

removeDir(projectFolder)
  .then(() => {
    return makeDir(projectFolder);
  })

  .then(() => {
    return writeFileA(path.resolve(__dirname, "project-dist", "style.css"), "");
  })

  .then(() => {
    return styleFilecreator();
  })

  .then(() => {
    return copyFolder();
  })

  .then(() => {
    return htmlBuilder();
  })

  .catch((err) => console.log(err.message));
