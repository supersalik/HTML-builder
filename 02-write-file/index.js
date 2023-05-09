const fs = require("fs");
const path = require("path");
const { stdin, stdout } = process;

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

writeFileA(path.resolve(__dirname, "text.txt"), "")
  .then(() =>
    stdout.write(
      "Hi! Please, write something to text.txt. For exit from this mega-funny programm write exit in the console!\n"
    )
  )
  .then(() =>
    stdin.on("data", async (data) => {
      if (data.toString().trim() === "exit") {
        process.on("exit", () =>
          stdout.write("See you later, Node.js love you!")
        );
        process.exit();
      } else {
        await appendFileA(path.resolve(__dirname, "text.txt"), data);
      }
    })
  )

  .catch((err) => console.log(err.message));

process.on("SIGINT", function () {
  console.log("You used CTRL+C for exit");
  process.exit();
});
