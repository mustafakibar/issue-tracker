# FCC Quality Assurance — Issue Tracker

Express + MongoDB REST API for per-project issue tracking with functional tests, built for the FreeCodeCamp Quality Assurance certification.

## Features

- `POST /api/issues/:project` — creates an issue bound to a project slug; requires `issue_title`, `issue_text`, `created_by`
- `GET /api/issues/:project` — lists issues for a project with optional filters (`open`, `assigned_to`, etc.)
- `PUT /api/issues/:project` — updates one or more fields of an existing issue by `_id`
- `DELETE /api/issues/:project` — deletes an issue by `_id`
- Issues are stored in MongoDB with `created_on`, `updated_on`, `open` status, and optional `assigned_to` / `status_text`
- Functional tests cover create, read, update, delete paths and error cases

## Tech Stack

- Node.js
- Express
- MongoDB / Mongoose
- Chai / Mocha

## Requirements

- Node.js 16+
- MongoDB 4+
- Yarn 1.x or npm 8+

## Installation

```bash
yarn install
```

## Environment Variables

Create a `.env` file in the project root with:

- `PORT` — server port (defaults to `3000`)
- `NODE_ENV` — `development` | `test` | `production`
- `DB_CONNECTION_URI` — MongoDB connection string

## Usage

```bash
yarn start
```

Server listens on `http://localhost:3000`.

## Testing

```bash
NODE_ENV=test yarn start
```

## API

- `GET /api/issues/:project` — list issues (filterable via query params)
- `POST /api/issues/:project` — create issue
- `PUT /api/issues/:project` — update issue
- `DELETE /api/issues/:project` — delete issue

## Project Structure

```
.
├── routes/
├── tests/
├── public/
├── views/
├── db.js
├── server.js
└── package.json
```

## License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file.
