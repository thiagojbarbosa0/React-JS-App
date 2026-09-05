# Lumen Gallery

A small full-stack image gallery: drag-and-drop upload, a responsive grid, a
lightbox viewer, and one-click delete. Built with a React frontend and an
Express API backend.

```
React-JS-App-main/
├── my-app/            React frontend (Create React App)
└── exp5/
    └── server/         Express API (upload, list, delete images)
```

The frontend talks to the backend over HTTP. Nothing is bundled together —
they run as two separate processes, on two separate ports, during
development.

## Features

- Drag-and-drop or click-to-browse image upload, with a live progress ring
- Responsive image grid with a full-size lightbox viewer
- Delete images with an optimistic UI update
- File type and size validation (JPG, PNG, GIF, WEBP — up to 8MB)
- Toast notifications for success/error feedback
- Loading skeletons and empty/error states

## Prerequisites

- **Node.js 18 or newer** (includes npm). Check your version with:
  ```
  node -v
  npm -v
  ```
  If you need to install or upgrade Node.js, get it from
  [nodejs.org](https://nodejs.org/) or a version manager like `nvm`.
- **Git** (only needed if you're cloning the repository rather than using a
  downloaded copy).

## Project structure

| Folder            | What it is                              | Port (dev) |
|--------------------|------------------------------------------|------------|
| `exp5/server`      | Express API that stores and serves images | 5000       |
| `my-app`           | React frontend (Create React App)        | 3000       |

Each folder has its own `package.json`, so dependencies are installed
separately for the client and the server.

## Environment variables

Both apps read configuration from a `.env` file. Example files are provided —
copy them and adjust if needed.

**Server** (`exp5/server/.env`):
```
PORT=5000
CLIENT_ORIGIN=http://localhost:3000
```

**Client** (`my-app/.env`):
```
REACT_APP_API_URL=http://localhost:5000
```

If you skip this step, both apps fall back to the same defaults shown above,
so a local run works out of the box.

## Running the project from the terminal

You'll run two processes at once: the API server and the React app. Open two
terminal windows/tabs — one per process — or use the background/multiplexing
approach shown for your OS below.

### macOS / Linux (bash or zsh)

```bash
# 1) Clone or unzip the project, then move into it
cd React-JS-App-main

# 2) Install and start the API server
cd exp5/server
npm install
cp .env.example .env      # optional — defaults already work
npm start                 # server runs at http://localhost:5000
```

Open a **second terminal tab/window** for the client:

```bash
cd React-JS-App-main/my-app
npm install
cp .env.example .env      # optional — defaults already work
npm start                 # opens http://localhost:3000 in your browser
```

To run both from a single terminal without opening a second window, you can
background the server:

```bash
cd React-JS-App-main/exp5/server && npm install && npm start &
cd ../../my-app && npm install && npm start
```

### Windows — PowerShell

```powershell
# 1) Move into the project
cd React-JS-App-main

# 2) Install and start the API server
cd exp5\server
npm install
Copy-Item .env.example .env      # optional — defaults already work
npm start                        # server runs at http://localhost:5000
```

Open a **second PowerShell window** for the client:

```powershell
cd React-JS-App-main\my-app
npm install
Copy-Item .env.example .env      # optional — defaults already work
npm start                        # opens http://localhost:3000 in your browser
```

### Windows — Command Prompt (cmd.exe)

```cmd
cd React-JS-App-main

cd exp5\server
npm install
copy .env.example .env
npm start
```

Open a **second cmd window** for the client:

```cmd
cd React-JS-App-main\my-app
npm install
copy .env.example .env
npm start
```

> On Windows, `npm start` for the client and server each occupy their own
> terminal (they run in the foreground). Keep both windows open while you
> use the app.

## Available scripts

**Server** (`exp5/server`):
| Command       | What it does                                   |
|---------------|-------------------------------------------------|
| `npm start`   | Starts the API server with plain Node.js        |
| `npm run dev` | Starts the server with `--watch`, auto-restarting on file changes |

**Client** (`my-app`):
| Command         | What it does                                          |
|-----------------|--------------------------------------------------------|
| `npm start`     | Runs the app in development mode at `localhost:3000`   |
| `npm test`      | Runs the test suite in watch mode                       |
| `npm run build` | Builds an optimized production bundle into `build/`     |

## API reference

Base URL: `http://localhost:5000` (or whatever `PORT`/`REACT_APP_API_URL`
you configured).

| Method   | Route                | Description                                  |
|----------|-----------------------|-----------------------------------------------|
| `GET`    | `/api/health`          | Health check                                  |
| `GET`    | `/api/images`          | List all images, newest first                 |
| `POST`   | `/api/images`          | Upload an image (multipart field: `image`)    |
| `DELETE` | `/api/images/:filename`| Delete an image by filename                   |
| `GET`    | `/img/:filename`       | Static file access to a stored image          |

## Building for production

The client can be built as a static bundle and served by any static host or
by the Express server itself:

```bash
cd my-app
npm run build
```

This produces a `build/` folder with the production-ready app. Deploy it to
any static hosting provider (Netlify, Vercel, GitHub Pages, an S3 bucket,
etc.), and point `REACT_APP_API_URL` (set before building) at your deployed
API server's URL.

The server has no build step — deploy `exp5/server` as-is to any Node.js
host (Render, Railway, Fly.io, a VPS, etc.) and set `PORT` and
`CLIENT_ORIGIN` as environment variables there.

## Troubleshooting

- **"Could not reach the server" in the browser** — make sure the API
  server (`exp5/server`) is running and that `REACT_APP_API_URL` in
  `my-app/.env` points at the right port.
- **CORS errors in the browser console** — check that `CLIENT_ORIGIN` in
  `exp5/server/.env` matches the URL the React app is actually running on.
- **`npm start` fails with "command not found"** — run `npm install` first
  in that folder; scripts rely on packages installed into `node_modules`.
- **Port already in use** — change `PORT` (server) or stop the process using
  that port, then restart.

## Notes on this repository

This project previously contained an incomplete, unused scaffold at
`exp5/client` (a `create-react-app` project with dependencies installed but
no source code). It has been removed — `my-app` is the single, working React
client, and `exp5/server` is the single, working API. `node_modules` folders
are excluded from version control via `.gitignore`; run `npm install` in
each app folder as shown above before starting them.
