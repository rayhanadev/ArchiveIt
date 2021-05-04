# ArchiveIt!
An simple archiving tool for a Replit User. Creates a single folder containing all public Repls of a user.

## How to use?
It's pretty simple! you can visit [this](https://replit.com/@RayhanADev/ArchiveIt) Repl, create a fork, and change your `.replit` file as shown:
```
run = "npm run start -- your-username-here"
```

or you can create a local copy of this repository, create a `/projects` and `/tmp` folder in your current directory and then run:
```sh
$ npm run start -- your-username-here
```

Simple! After creating your archive you can clear the `/tmp` folder or use:
```sh
$ npm run clean:tmp
```

to empty the folder.

## Upcoming
An integration with Github to create a mono-repo style archive of all Repls
