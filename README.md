# Syncal Client

A web-based calendar sharing application that facilitates collaborative scheduling with friends and family. This platform allows multiple individuals to work together on the same calendar, making it easier to coordinate plans, events, and activities.
_Project 4 for Rocket Academy Bootcamp_

### Preview

<!-- ![kaching gif](./src/assets/preview.gif) -->

"Insert Image and Videos Here"

## Features

- Allowing users to login/signup, with the help of [Auth0](https://auth0.com/)
- CRUD funtions for calendars and events
- Having multiple calendars
- Allowing user to invite other users into the same calendar and share their schedules
- Enabling users to seamlessly import their Google Calendar events into the application.

## Tech Used

- Front end: [NextJS](https://nextjs.org/)
- UI: [Chakra UI](https://chakra-ui.com/), [Tailwind CSS](https://tailwindcss.com/)
- Storage: [Firebase](https://firebase.google.com/)
- Backend: [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/), [Sequelize](https://sequelize.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)

## Setup

**Pre-requisite: Need to have [Syncal Backend](https://github.com/shawn-goh24/backend-syncal) in order to run the full application. Guides on setting up the backend will be shown in that repository.**

This project is created using create-react-app. Before starting, it is required to run the following steps for the application to work

1. Clone repo to local

2. Configure `.env` file, make sure to get your own API keys stated below and insert it into your `.env` file
   - If unsure where to get API keys, refer to the Tech Used for the documents

```
SERVER = <Insert Sever URL>

AUTH0_SECRET = <Insert Auth0 Secret>
AUTH0_BASE_URL = <Insert Auth0 Base URL (e.g. localhost:3000)>
AUTH0_ISSUER_BASE_URL = <Insert Auth0 Isser Base URL>
AUTH0_CLIENT_ID = <Insert Auth0 Client ID>
AUTH0_CLIENT_SECRET = <Insert Auth0 Client Secret>
AUTH0_AUDIENCE = <Insert Auth0 Audience>

FIREBASE_API = <Insert Firebase API key>
FIREBASE_AUTH_DOMAIN = <Insert Firebase Auth Domain>
FIREBASE_PROJECT_ID = <Insert Firebase Project ID>
FIREBASE_STORAGE_BUCKET = <Insert Firebase Storage Bucket>
FIREBASE_MESSAGING_SENDER_ID = <Insert Firebase Sender ID>
FIREBASE_APP_ID = <Insert Firebase App ID>
```

3. Install all dependencies required in this repo, and run locally

```
npm i
npm start
```

4. Enjoy!

## Future improvements

- Mobile view
- Change Auth0 email when user changes email
- Include other calendar services (Microsoft Outlook & Apple Calendar)
- Allow real-time updates/sync
- Expanded customisation options for calendars and events

## Contributors

- [Me, Shawn Goh](https://github.com/shawn-goh24)
