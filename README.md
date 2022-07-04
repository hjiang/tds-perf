This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

This is used for quarterly self-assessment and peer-reviews.

## Getting Started

The following environment variables must be set at runtime:

- `LEANCLOUD_APP_ID`: automatically set when running on LeanEngine
- `LEANCLOUD_APP_KEY`: automatically set when running on LeanEngine
- `LEANCLOUD_APP_MASTER_KEY`: automatically set when running on LeanEngine
- `LEANCLOUD_API_SERVER`: automatically set when running on LeanEngine
- `COOKIE_KEY`: must be longer than 32 characters in production
- `MAILGUN_API_KEY`: if not set, no email will be sent. The sign-in links are printed in the log.
- `DOMAIN`: used for generating sign-in links.

First, install the dependencies:

```bash
npm ci
```

and run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

Use [LeanEngine](https://docs.leancloud.cn/sdk/engine/overview/).

## URL structure

Work in progress ...

### User-facing pages

- `/` - home page
- `/login` - login
- `/self-reviews/[cycle]` - page for the current user to write self-review for a given cycle
- `/peer-reviews/[cycle]/invites` - page for the current user to invite others to write peer reviews
- `/peer-reviews/[cycle]/inbox` - page for the current user to view others' reviews for her
- `/peer-reviews/[cycle]/outbox` - page for the current user to write reviews for other people

### API paths
