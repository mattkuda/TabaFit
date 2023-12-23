# Abcountable 🆎

<i>Six-packs responsibly</i>

This is a Tabata Timer application built with React Native and Expo. A Tabata Timer performs a particular exercise 8 times, separated by rest intervals. You can configure the number of exercises, the duration of each exercise, and the rest interval.

The application provides visual cues for the different states (work, rest, cooldown) with a large, easy-to-read timer countdown. It also displays the number of exercises completed and the total workout time.

## Getting Started

To get this project running on your local machine, follow the steps outlined below.

### Prerequisites

Ensure that you have the following installed on your local machine:

- [Node.js & npm](https://nodejs.org/en/download/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)

### Installation & Setup

#### Frontend

1. Clone this repository and navigate into it

   ```bash
   git clone https://github.com/yourUsername/yourRepoName.git
   cd yourRepoName
   ```

2. Navigate into the `mobile` directory

   ```bash
   cd mobile
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Start the application via Expo
   ```bash
   npx expo start
   ```

This will open Expo Dev Tools in the browser. You can then use an emulator or a physical device connected to your machine to run the application.

#### Backend

1. Navigate back to the root directory and then into the `server` directory

   ```bash
   cd ..
   cd server && cd src
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the server

   ```bash
   npm start
   ```

The server will start running at http://localhost:3000.

## Firebase Service Account Setup

To set up Firebase Admin in your local environment:

1. Rename `firebaseServiceAccountKey.ts.template` to `firebaseServiceAccountKey.ts` in the `/server/src/config` directory.
2. Fill in the placeholders in `firebaseServiceAccountKey.ts` with your actual Firebase service account details.
   - You can find these details in your Firebase project settings under Service Accounts.
3. Ensure that `firebaseServiceAccountKey.ts` is included in your `.gitignore` file to avoid exposing sensitive information.

## Features

- Configurable number of exercises
- Configurable exercise duration
- Configurable rest interval
- Display of total workout time
- Countdown timer for current interval
- Visual cues for different states

## License

This project is licensed under the terms of the [MIT license](LICENSE).
