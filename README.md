## Setup

### Install dependencies

- docker compose
- nodejs
- yarn
- ios simulator or android emulator

### Run the app

- `yarn`
- `yarn start`
- `yarn civalgo:reset` reset docker containers and start them again
- `yarn civalgo:migrate` run prisma migrations, electrify tables and generate prisma client
- `yarn start:ios` or `yarn start:android`

### Possible errors

- if you have an error related to `Local schema doesn't match server`, you need to delete the expo go app on the device and run `yarn start:ios` or `yarn start:android` again
