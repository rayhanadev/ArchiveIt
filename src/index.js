import fs from 'fs';
import path from 'path';
import request from 'request';
import AdmZip from 'adm-zip';
import ReplAPI from 'replapi-it';

const replapi = ReplAPI({
	username: 'RayhanADev',
});

const headers = {
	'Content-Type': 'application/json',
	Accept: 'application/json',
	'Accept-Encoding': 'gzip, deflate, br',
	Connection: 'keep-alive',
	'X-Requested-With': 'ArchiveIt',
	Referrer: 'https://replit.com/',
	Origin: 'https://replit.com/',
};

/**
 * Retrives a specific Repl's .zip file and then unzips it into the ./projects directory
 * @param urlPath <String> - the path to the Repl
 */
async function fetchFile(urlPath = '/') {
	const file = fs.createWriteStream(
		path.join(process.cwd(), `tmp/${urlPath.split('/')[2]}.zip`)
	);
	await new Promise((resolve, reject) => {
		request({
			uri: `https://staging.replit.com${urlPath}.zip`,
			headers,
			gzip: true,
		})
			.pipe(file)
			.on('finish', () => {
				console.log(`Fetched ${urlPath.split('/')[2]}.`);
				resolve();
			})
			.on('error', (error) => {
				reject(error);
			});
	}).catch((error) => {
		console.log(`Something happened: ${error}`);
	});

	const zip = new AdmZip(
		path.join(process.cwd(), `tmp/${urlPath.split('/')[2]}.zip`)
	);
	zip.extractAllTo(
		path.join(process.cwd(), `projects/${urlPath.split('/')[2]}`),
		true
	);
	console.log(`Unzipped ${urlPath.split('/')[2]}.`);
}

class UserPublicRepls extends replapi.CustomDataQuery {
	constructor(username) {
		const queryName = 'UserRepls';
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

const myUser = new UserPublicRepls('RayhanADev');

/**
 * Fetchs all of a user's Repls
 * @param username <String> - a username
 */
async function fetchRepls(username) {
	const info = await myUser.getData();
	return info.userByUsername.publicRepls.items.map((repl) => {
		if (repl.slug !== process.env.REPL_SLUG)
			return `/@${username}/${repl.slug}`;
		return undefined;
	});
}

/**
 * Create a delay (interval fetching)
 * @param n <Number> - seconds to delay
 */
function delay(n) {
	return new Promise((resolve) => {
		setTimeout(resolve, n * 1000);
	});
}

/**
 * Create an archive of a user's Repls locally
 * @param username <String> - a username
 */
async function archiveReplsLocally(username, options) {
	console.log(`Creating an archive for @${username}!`);
	if (options === 'nozip') console.log('Omitting creation of final .zip file.');

	const repls = await fetchRepls(username);
	for (let i = repls.length - 1; i > -1; i -= 1) {
		delay(1.5);
		if (repls[i]) {
			await fetchFile(repls[i]).catch((error) => {
				console.log(`Something happened: ${error}`);
			});
		}
	}

	if (options !== 'nozip') {
		console.log('Creating final .zip file.');
		const projectsZip = new AdmZip();
		projectsZip.addLocalFolder(path.join(process.cwd(), `projects/`));
		projectsZip.writeZip(
			path.join(process.cwd(), `${username.toLowerCase()}-repls.zip`)
		);
		console.log('Created final .zip file.');
	}

	console.log('\n\nFinished creating archive.');
	console.log(
		`View unzipped archive at ${path.join(process.cwd(), 'projects')}.`
	);
	if (options !== 'nozip') {
		console.log(
			`View zipped archive at ${path.join(
				process.cwd(),
				`${username.toLowerCase()}-repls.zip`
			)}.`
		);
	}
}

if (!process.argv[2]) {
	throw new Error('Missing Username Argument!');
} else if (String(process.argv[3]) === '--nozip') {
	archiveReplsLocally(String(process.argv[2]), 'nozip');
} else {
	archiveReplsLocally(String(process.argv[2]));
}
