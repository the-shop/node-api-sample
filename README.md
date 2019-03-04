# Node API Sample

node-api-sample by The Shop

### About the codebase

Application that serves as REST API and is written on top of Node.JS and Express.JS.

Application is event driven and code structure allows easy micro service deployment.

#### Why events?

Given the code microservice structure making it event based made sense just because of easier code functionality
extending in the future.

All developer has to do is listen to specific event to re-use the logic, without finding
a good place in code to extract the functionality to - place is already there - the `src/Listeners/` directory (more
on that below where code structure is explained).

### Registered Services

Following services are set up:

 - NewRelic
 - Crud
   - Users
   - Posts
   - Comments
 - Authorization
   - Enabled strategies: 
     - PasswordStrategy

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
 - `Mailgun` - for transactional emails
 - `S3` - for file uploads

## Configuration

Application depends on environment variables, so configure the
environment in `.env` file in root of the project with correct
information.

## Filesystem organization

 - `admin/` source of React administration
 - `docs/` documentation on specific topics
 - `public/` express uses this directory to serve static assets
 - `src/` main source code for the project

   - `cron/` directory contains all of cron jobs
   - `Database/` directory contains seeders and Database class
   - `Framework/` directory all of the files used to run the application
   - `Helpers/` directory all of the helper classes used in the project
   - `Services/` directory contains all of services

     - `<SERVICE_NAME>` name of the service

        - `Adapters/` directory contains all of API output adapters for specific service
        - `Collections/` directory contains all collections that service depends on
        - `Models/` directory contains all models that service depends on
        - `Listeners/` directory contains all service listeners

   - `Templates/` directory contains custom transactional email templates

 - `test/` directory contains test files
 - `tools/` is used for various tasks (such is app startup)

## Data

Project also uses [Admin on REST](https://marmelab.com/admin-on-rest/) React library to provide data administration interface.

You can access it at: [http://localhost:3030/admin](http://localhost:3030/admin) when API is running.

## Events

Both list of all defined (and triggered) events and map of what listener listens to what event can be found in `docs/EVENTS.md`.

Explanation on how to implement new listeners can be found in `src/Listeners/README.md`.

Each of services can have own events.

## Testing

Repository is set up with linter and unit tests. Both run on auto-installed pre-commit hook (hook installs on initial
node_modules instalation).

To run linter run:

    $ yarn lint # or or `npm run lint`

To run unit tests run:

    $ yarn unit:test # or `npm run unit:test`

To run all:

    $ yarn test # or `npm run test`

To run code coverage report run:

    $ yarn coverage:html # or `npm run coverage:html`

And it will generate output html in `coverage/` directory.

## Seeding data

Seeders are found in `src/Database/seed/` directory.

## Development

### How are docs generated

API documentation (swagger) is auto-generated from annotations in Adapters and Actions.

Events documentation (file: `docs/EVENTS.md`) is re-generated on application start.
