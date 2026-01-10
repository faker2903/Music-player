# Music Streaming App

A React Native music streaming application built with Expo, using the JioSaavn API.

## Features
- **Search**: Search for songs, artists, and albums.
- **Recent Searches**: History of your recent queries.
- **Player**: (Coming Soon) Full music player with queue management.

## Prerequisites
- Node.js (LTS version recommended)
- npm or yarn
- Expo Go app on your physical device (Android/iOS) OR Android Studio / Xcode for emulators.

## Installation

1.  **Install dependencies**:
    ```bash
    npm install
    ```

## Running the App

1.  **Start the development server**:
    ```bash
    npx expo start
    ```

2.  **Run on a Device/Emulator**:
    -   **Physical Device**: Scan the QR code displayed in the terminal using the **Expo Go** app (Android) or the Camera app (iOS).
    -   **Android Emulator**: Press `a` in the terminal window.
    -   **iOS Simulator** (Mac only): Press `i` in the terminal window.
    -   **Web**: Press `w` in the terminal window.

## Project Structure
-   `src/api`: API client and service functions.
-   `src/components`: Reusable UI components.
-   `src/constants`: Theme and configuration constants.
-   `src/navigation`: Navigation setup.
-   `src/screens`: Application screens.
-   `src/store`: Zustand state management stores.
-   `src/types`: TypeScript definitions.
