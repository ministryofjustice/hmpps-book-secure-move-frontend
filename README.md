# Book a secure move frontend

[![CircleCI](https://circleci.com/gh/ministryofjustice/hmpps-book-secure-move-frontend.svg?style=svg)](https://circleci.com/gh/ministryofjustice/hmpps-book-secure-move-frontend)
[![Coverage Status](https://coveralls.io/repos/github/ministryofjustice/hmpps-book-secure-move-frontend/badge.svg)](https://coveralls.io/github/ministryofjustice/hmpps-book-secure-move-frontend)

Book a secure move is part of the HMPPS Prisoner Escort and Custody
Service (PECS) programme.

There are three main repositories that comprise the Book a secure move service:

- This is the rendering application for the Book a secure move service.
- There is an [api repository](https://github.com/ministryofjustice/hmpps-book-secure-move-api) that contains the backend API
  - This is the primary backend service providing most of the data used by the frontend application.
  - There is another external system, NOMIS Elite 2 API, which is also used for some data requests.
- There is a [shared framework repository](https://github.com/ministryofjustice/hmpps-book-secure-move-frameworks)
  - This contains sections, steps and questions needed to complete journeys. Currently it only supports the Person Escort Record.
  - Further integration details can be [found here](./docs/development.md#book-a-secure-move-frameworks)

## Quick Start

### Major Dependencies

- [Node.js](https://nodejs.org/en/) (>= 16.13.1)
- [NPM](https://www.npmjs.com/) (>= 8.1.0)
- [Redis](https://redis.io/) (>= 5.0.5)

### Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/ministryofjustice/hmpps-book-secure-move-frontend && cd hmpps-book-secure-move-frontend
   ```

1. Install node dependencies:

   ```
   npm install
   ```

1. Build the assets

   ```
   npm run build
   ```

### Configuring the application

Create a copy of the example environment variable file and add values for the keys:

```
cp .env.example .env
```

Set the [environment variables](./docs/environment-variables.md) accordingly.

### Running the application

#### In production mode

```
NODE_ENV=production npm start
```

The app will run on port 3000 by default and be available at [http://localhost:3000](http://localhost:3000).

#### In development mode

Ensure Redis is installed and running.

```
npm run develop
```

The app will be running at [http://localhost:3000](http://localhost:3000) or with browsersync at [http://localhost:3001](http://localhost:3001).

## Licence

Unless stated otherwise, the codebase is released under the [MIT License](./LICENSE).

## Contribution guidelines

If you want to help us improve Book a secure move, view our [contribution guidelines](./CONTRIBUTING.md)
