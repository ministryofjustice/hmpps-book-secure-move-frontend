# Prisoner Escort and Custody Service (PECS) Frontend

This is the rendering application for the PECS service.

## Dependencies

- [Node.js](https://nodejs.org/en/) (>= 11.14.0)
- [NPM](https://www.npmjs.com/) (>= 6.7.0)

## Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/ministryofjustice/pecs-frontend && cd pecs-frontend
   ```

1. Install node dependencies:

   ```
   npm install
   ```

1. Create a copy of the example environment variable file and add values for the keys:

   ```
   cp .env.example .env
   ```

1. Build the assets

    ```
    npm run build
    ```

## Running the application

#### In production mode

```
NODE_ENV=production npm start
```

The app will run on port 3000 by default and be available at [http://localhost:3000](http://localhost:3000).

#### In development mode

```
npm run develop
```

The app will be running at [http://localhost:3000](http://localhost:3000) or with browsersync at [http://localhost:3001](http://localhost:3001).
