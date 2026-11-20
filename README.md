# Photo-sharing API

An Instagram-style REST API written in plain Node.js. (School project)

## What it does

- **Users:** register, confirm the account with a link, log in and get a JWT (passwords hashed with bcrypt).
- **Photos:** upload to a user's album, list, get one, update, delete.
- **Tags:** list the built-in tags, add new ones, attach tags to a photo.
- **Filters:** read image metadata and apply filters (flip, tint and others) with `sharp`; download the original or the filtered file.
- **Profile:** read and update the logged-in user's name.

Data is kept in memory, so it resets when the server restarts. Uploaded files are stored in `server/uploads/`.

## Stack

Node.js (ES modules), `jsonwebtoken`, `bcryptjs`, `formidable`, `sharp`, `dotenv`.

## Running it

```
npm install
copy server\.env.example server\.env
npm start
```

Set `KEY` in `server/.env` to any long random string.
The server listens on `http://localhost:3000`.

`tests_full.rest` walks through the whole API in order.


## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/user/register` | create a user |
| GET | `/api/user/confirm/:token` | confirm the account |
| POST | `/api/user/login` | log in, returns a JWT |
| GET | `/api/user` | list users (test helper) |
| GET, PATCH | `/api/profile` | read or update the logged-in user |
| GET, POST | `/api/photos` | list photos, upload a photo |
| GET, PATCH, DELETE | `/api/photos/:id` | one photo |
| GET, PATCH | `/api/photos/tags/:id` | tags of a photo |
| GET, POST | `/api/tags` | list tags, add a tag |
| GET | `/api/tags/raw` | tags as plain strings |
| GET | `/api/tags/:id` | one tag |
| GET | `/api/filters/metadata/:id` | image metadata |
| PATCH | `/api/filters` | apply a filter to a photo |
| GET | `/api/getimage/:id` | download the image file |
| GET | `/api/getimage/:id/filter/:name` | download the filtered file |

## Known limitations

Note: This is a school project, kept close to how it was submitted.

- No database, everything is kept in memory
- Not every endpoint is behind a token
- The code could be optimized further, especially the filters
