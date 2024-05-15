# TabaFit

<i>Your Tabata Workout Community</i>

Welcome to TabaFit, the ultimate Tabata Timer application built with React Native and Expo. TabaFit goes beyond just timing your workouts; it brings together a vibrant community of fitness enthusiasts where you can generate custom workouts on the fly based on your preferences, explore and save a variety of workouts, and share your own routines with the world.

### Key Features
- Generate Workouts: Create personalized Tabata workouts tailored to your specific preferences and goals.
- Explore and Save Workouts: Browse through a diverse collection of workouts created by the community and save your favorites for easy access.
- Share Your Workouts: Publish your own workout routines and share them with the TabaFit community.
- Follow Users: Follow other users to keep up with their latest workouts and fitness activities.
- Engage with the Community: Like, comment, and engage with workouts shared by other users to build connections and stay motivated.

Join TabaFit today and be part of a community that shares your passion for fitness and helps you achieve your workout goals!

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
