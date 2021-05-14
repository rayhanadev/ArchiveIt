> This project has been archived due to the lockdown of the .zip paths. The code will not be maintained until a better solution is found.

# ArchiveIt!
A simple archiving tool for a Replit User. Creates a single folder containing all public Repls of a user.

## How to Use?
It's pretty simple! you can visit [this](https://replit.com/@RayhanADev/ArchiveIt) Repl, create a fork, and change your `.replit` file as shown:
```
run = "npm run start -- your-username-here"
```

or you can create a local copy of this repository and similarly run:
```sh
$ npm run start -- your-username-here
```

## Additional Options?
You can pass `--nozip` to omit creation of a final zip file containing all your Repls.

```sh
$ npm run start -- your-username-here --nozip
```

## Upcoming
An integration with Github to create a mono-repo style archive of all Repls
