# Development

## Running locally

### Major Dependencies

- [Node.js](https://nodejs.org/en/) (>= 14)
- [NPM](https://www.npmjs.com/) (>= 6.14)
- [Redis](https://redis.io/) (>= 5.0.5)

### Installation

1. Clone repository and change directory:

   ```
   git clone https://github.com/ministryofjustice/hmpps-book-secure-move-frontend && cd hmpps-book-secure-move-frontend
   ```

2. Install node dependencies:

   ```
   npm install
   ```

3. Build the assets

   ```
   npm run build
   ```


## Configuring the application

Create a copy of the example environment variable file and add values for the keys:

```
cp .env.example .env
```

Set the [environment variables](#environment-variables) accordingly.

## Running the application

### In production mode

```
NODE_ENV=production npm start
```

The app will run on port 3000 by default and be available at [http://localhost:3000](http://localhost:3000).

### In development mode

Ensure Redis is installed and running.

```
npm run develop
```

The app will be running at:

- [http://localhost:3000](http://localhost:3000) in normal webserving mode
- [http://localhost:3001](http://localhost:3001) with browsersync
- [ws://localhost:9299](ws://localhost:9299) with node debugger support

#### Running with debug logging

Some extra levels of debugging have been added to aid development.

To see app level debug logs run:

```
DEBUG=app:* npm run develop
```

To see all axios requests/responses run:

```
DEBUG=axios npm run develop
```

To see form wizard debug logs run:

```
DEBUG=hmpo:controller* npm run develop
```

You can combine and filter out namespaces, for example:

```
DEBUG=axios,app:*,-app:api-client:axois* npm run develop
```

#### Running with node debugger

In development mode, node debugger support is enabled. Various IDEs and standalone applications are available to step through running code.

## Book a secure move frameworks

The frontend uses the [Book a secure move frameworks](https://github.com/ministryofjustice/hmpps-book-secure-move-frameworks) repo to build and maintain
certain features like the Person Escort Record.

The frontend maintains a list of versions of the framework that are supported in the package.json manifest under a scope of `@hmpps-book-secure-move-frameworks`. Each version is then maintained as a folder underneath that scope, for example `@hmpps-book-secure-move-frameworks/0.1.0`.

The frontend needs to maintain separate versions so that it can render any previous records created using the framework or allow users to continue
to edit existing records that have been created using specific versions.

### To support a new version

- Add a new item under the framework scope to the package manifest:

  ```
  "@hmpps-book-secure-move-frameworks/{semanticVersion}": "github:ministryofjustice/hmpps-book-secure-move-frameworks#v{semanticVersion}"
  ```

### To override the current version

The current version is used when creating new framework resources. It can be overridden using an environment variable (`FRAMEWORKS_VERSION`),
for example when adding support for a new version but we want to still create records using an older version.
