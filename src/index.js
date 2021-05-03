import fs from "fs";
import path from "path";
import request from "request";
import rimraf  from 'rimraf';
import AdmZip from "adm-zip";
import ReplAPI from "replapi-it";

const replapi = ReplAPI({
  username: "RayhanADev",
});

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "X-Requested-With": "ArchiveIt",
  Referrer: "https://replit.com/",
  Origin: "https://replit.com/",
};

/**
 * Retrives a specific Repl's .zip file and then unzips it into the ./projects directory
 * @param urlPath <String> - the path to the Repl
 */
async function fetchFile(urlPath = "/") {
  const file = fs.createWriteStream(
    path.join(process.cwd(), `tmp/${urlPath.split("/")[2]}.zip`)
  );
  await new Promise((resolve, reject) => {
    request({
      uri: `https://staging.replit.com${urlPath}.zip`,
      headers,
      gzip: true,
    })
      .pipe(file)
      .on("finish", () => {
        resolve();
      })
      .on("error", (error) => {
        reject(error);
      });
  }).catch((error) => {
    console.log(`Something happened: ${error}`);
  });

	const zip = new AdmZip(path.join(process.cwd(), `tmp/${urlPath.split("/")[2]}.zip`));
	zip.extractAllTo(path.join(process.cwd(), `projects/${urlPath.split("/")[2]}`), true);
	rimraf.sync(path.join(process.cwd(), 'tmp/**.*'));
};

/**
 * Fetchs all of a user's Repls
 * @param username <String> - a username
 */
async function fetchRepls(username) {
	const myUser = new replapi.User(username);
	const userData = await myUser.userRestfulData()
	const userRepls = userData.repls.map(repl => repl.url);
	console.log(userRepls);
};