# DevHub

A developer documentation portal built with **Astro**, **EmDash**, and **React**.

DevHub demonstrates how EmDash can be used as a content management layer while Astro provides the developer-focused presentation layer and application structure.

## Overview

DevHub provides:

* Developer documentation
* API reference documentation
* Interactive API Explorer
* Practical development guides
* Changelog / product updates
* CMS-managed content through EmDash
* Documentation layout
* SEO metadata and canonical URLs
* Loading and error states in interactive UI

## Tech Stack

* **Astro 7** — application and presentation layer
* **EmDash 0.38** — CMS/content layer
* **React 19** — interactive UI components
* **TypeScript** — type-safe application code
* **SQLite** — local EmDash data storage
* **pnpm** — package management
* **Node.js** — server runtime

## Architecture

The application separates content management from the presentation layer:

```text
                    DevHub
                       |
          +------------+------------+
          |                         |
     EmDash CMS                 Astro
          |                         |
     SQLite data          Presentation / routing
          |                         |
     Pages / Posts       React interactive components
          |                         |
          +------------+------------+
                       |
                    Browser
```

### Content layer

EmDash manages the documentation and changelog content.

Examples of CMS-managed pages include:

* Getting Started
* Authentication
* Projects API
* Users API
* Webhooks API
* Error Handling
* Working with Webhooks
* Resources

Published posts are used for the changelog / latest updates section.

### Presentation layer

Astro provides the application shell, routing, SEO metadata, navigation, responsive layout, and page rendering.

React is used selectively where client-side interactivity is useful, most notably for the API Explorer.

## API Explorer

The API Explorer is an interactive demonstration of the DevHub API.

It currently provides three example endpoints:

```text
GET  /v1/projects
GET  /v1/users
POST /v1/webhooks
```

Users can:

* Select an endpoint
* Enter an API key
* Configure a webhook URL
* Inspect the generated request
* Send the request
* See loading, success, and error states
* Inspect an example JSON response

### Important implementation detail

The API Explorer is intentionally a **frontend simulation** for this assignment. It does not make requests to a production backend or expose real credentials.

The simulated behavior allows the UI and interaction model to be demonstrated without requiring a separate API service.

## Routing

EmDash documentation pages use CMS-managed slugs.

The Astro catch-all route:

```text
src/pages/[...slug].astro
```

allows both single-level and nested documentation paths, for example:

```text
/getting-started
/authentication
/api/projects
/api/users
/api/webhooks
/guides/error-handling
/guides/webhooks
```

The catch-all route was necessary because a standard `[slug].astro` route only matches a single URL segment.

Custom application routes are implemented separately, including:

```text
/api/explorer
/posts
/posts/[slug]
```

## Project Structure

```text
src/
├── components/
│   └── ApiExplorer.tsx
│
├── layouts/
│   └── Base.astro
│
├── pages/
│   ├── [...slug].astro
│   ├── index.astro
│   ├── 404.astro
│   │
│   ├── api/
│   │   └── explorer.astro
│   │
│   ├── posts/
│   │   ├── index.astro
│   │   └── [slug].astro
│   │
│   ├── category/
│   │   └── [slug].astro
│   │
│   └── tag/
│       └── [slug].astro
│
├── styles/
│   └── global.css
│
└── utils/
    └── site-identity.ts

seed/
└── seed.json
```

## Why Astro + EmDash?

**EmDash** is responsible for structured content management, allowing documentation and updates to be edited through the CMS rather than hard-coded into the frontend.

**Astro** is responsible for the developer portal experience: routing, layout, SEO, navigation, and rendering.

This separation keeps content management and application presentation concerns distinct while still allowing them to work together in the same application.

React is used only where client-side interaction is needed instead of turning the entire application into a client-rendered React application.

## Running Locally

### Requirements

* Node.js
* pnpm

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The application will be available at:

```text
http://localhost:4321
```

### Production build

Check TypeScript and Astro diagnostics:

```bash
pnpm typecheck
```

Build the production application:

```bash
pnpm build
```

Run the production server:

```bash
pnpm start
```

## Cross-platform Development

The project is designed to run on both Windows and macOS.

It uses the standard Astro/Node.js runtime and does not depend on platform-specific paths or tooling.

## Validation

The current implementation has been validated with:

```text
pnpm typecheck
0 errors
0 warnings
0 hints
```

The production build also completes successfully with:

```text
pnpm build
Build complete
```

The production server has been tested locally, including:

* Main homepage
* Documentation pages
* Nested documentation routes
* API reference pages
* Guides
* Resources
* Changelog
* Post detail pages
* API Explorer
* API Explorer success/error states

## Trade-offs and Future Improvements

For the scope of this assignment, the implementation intentionally avoids unnecessary infrastructure.

Potential production improvements could include:

* Connecting the API Explorer to a real API service
* Implementing real authentication and authorization
* Adding API request persistence and rate limiting
* Configuring a production cache provider
* Adding automated tests
* Adding CI/CD
* Adding analytics and observability
* Optimizing larger JavaScript chunks
* Deploying the CMS/database using production infrastructure

These were kept outside the current scope so the implementation could focus on the core developer-portal experience and demonstrate the integration between EmDash, Astro, and React.
