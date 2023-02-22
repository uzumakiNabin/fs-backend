This project is initialized with `npm init`.

## Available Scripts

In the project directory, you can run:

### `npm start`

Starts server at [http://localhost:3001](http://localhost:3001).

### `npm run dev`

This uses nodemon package to start server. This will auto-restart server to reflect any changes done in code.
You can install nodemon as dev dependency with `npm install --save-dev nodemon`.

## API details

Following api endpoints are currently available

### `GET /api/persons`

Returns all available persons info.

### `GET /api/persons/{id}`

Returns a single person info of given id if available.

### `DELETE /api/persons/{id}`

Deletes a single person of given id if available.

### `POST /api/persons/`

Adds a person data in format {name: "", number: ""} passed as a request body.

This project uses Express.js to create server application. You can learn more about express js at [here](https://expressjs.com/en/4x/api.html).