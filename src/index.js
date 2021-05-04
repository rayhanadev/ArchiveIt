import fs from "fs";
import path from "path";
import request from "request";
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

  const zip = new AdmZip(
    path.join(process.cwd(), `tmp/${urlPath.split("/")[2]}.zip`)
  );
  zip.extractAllTo(
    path.join(process.cwd(), `projects/${urlPath.split("/")[2]}`),
    true
  );
}

class UserPublicRepls extends replapi.CustomDataQuery {
  constructor(username) {
    const queryName = "UserRepls";
    const customQuery = `
      userByUsername(username: $username) {
        publicRepls(count: 100000) {
        	items {
        		slug
        	}
        }
      }`;
    const customVariables = { username };
    super(queryName, customQuery, customVariables);
  }
}

const myUser = new UserPublicRepls("RayhanADev");

/**
 * Fetchs all of a user's Repls
 * @param username <String> - a username
 */
async function fetchRepls(username) {
  const info = await myUser.getData();
  console.log();
  return info.userByUsername.publicRepls.items.map(
    (repl) => `/@${username}/${repl.slug}`
  );
}

/**
 * Create an archive of a user's Repls locally
 * @param username <String> - a username
 */
async function archiveReplsLocally(username) {
  console.log(`Creating an archive for @${username}!`);
  const repls = await fetchRepls(username);
  repls.forEach((repl) => {
    setTimeout(() => {
      console.log(`Fetching ${repl.split("/")[2]}.`);
      try {
        fetchFile(repl);
      } catch (error) {
        console.log(`Something happened: ${error}`);
      }
    }, 5000);
  });
}

if(!process.argv[2]) throw new Error('Missing Username Argument');
archiveReplsLocally(String(process.argv[2]));