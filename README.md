# Node API Sample

node-api-sample by The Shop

### About the codebase

Application that serves as REST API and is written on top of Node.JS and Express.JS.

Application is event driven and code structure allows easy micro service deployment.

### Registered Services

Following services are set up:


 - Crud
   - Users
   - Posts
   - Comments
 - Authorization
   - Enabled strategies: 
     - PasswordStrategy
 - Statistics

### API documentation

Documentation is generated from inline [Swagger](https://swagger.io/) annotations.

Documentation is available at: [http://localhost:3030/api-docs/](http://localhost:3030/api-docs/) when API is started.

## Repository setup

### Instructions:

    $ yarn # or `npm install`
    $ cp .env.example .env
    $ # fill in data in .env
    $ yarn start # or `npm run start` for development or
    $ yarn start:live # or `npm run start:live` for production

### Optionally:

    $ yarn database seed # or `npm run database seed` - will create sample dataset

## Third party dependencies

 - `NewRelic` - for monitoring
 - TODO: S3,...

## Configuration

Application depends on environment variables, so configure the
environment in `.env` file in root of the project with correct
information.

## Filesystem organization

 - `admin/` source of React administration
 - `docs/` documentation on specific topics
 - `src/` main source code for the project

   - `Cron/` directory contains all of cron jobs
   - `Database/` directory contains seeders and Database class
   - `Framework/` directory all of the files used to run the application
   - `Helpers/` directory all of the helper classes used in the project
   - `Services/` directory contains all of services

     - `<SERVICE_NAME>`

        - `Adapters/` directory contains all of API output adapters for specific service
         - `Collections/` directory contains all collections that service depends on
        - `Models/` directory contains all models that service depends on
        - `Listeners/` directory contains all service listeners

 - `test/` directory contains test files
 - `tools/` is used for various tasks (such is app startup)

## Data

Project also uses [Admin on REST](https://marmelab.com/admin-on-rest/) React library to provide data administration interface.

You can access it at: [http://localhost:3030/admin](http://localhost:3030/admin) when API is running.

## Events

Both list of all defined (and triggered) events and map of what listener listens to what event can be found in `docs/EVENTS.md`.

Explanation on how to implement new listeners can be found in `src/Listeners/README.md`.

Also, each of services can have own events.

## Testing

Repository is set up with linter and unit tests. Both run on auto-installed pre-commit hook (hook installs on initial
node_modules instalation).

To run linter run:

    $ yarn lint # or or `npm run lint`

To run unit tests run:

    $ yarn unit:test # or `npm run unit:test`

To run all:

    $ yarn test # or `npm run test`

## Seeding data

Seeders are found in `src/Database/seed/` directory.

## Development

TODO: explain how docs are generated, how to follow structure...
