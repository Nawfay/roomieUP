# Firebase Authentication Setup

## Installation

Install Firebase:

```bash
npm install firebase
# or
pnpm add firebase
```

## Configuration

1. Create a `.env.local` file in the root directory
2. Copy the contents from `.env.local.example`
3. Replace the placeholder values with your Firebase project credentials

To get your Firebase credentials:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > General
4. Scroll down to "Your apps" and click the web icon (</>)
5. Register your app and copy the config values

## Firebase Console Setup

Enable authentication methods:
1. Go to Firebase Console > Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Enable "Google" provider

## Usage

The auth forms are located in `components/auth/`:
- `login-form.tsx` - Handles email/password and Google login
- `signup-form.tsx` - Handles email/password and Google signup

Both forms redirect to `/dashboard` on successful authentication.
