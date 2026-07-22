# James Williams CMS

Headless CMS powering the James Williams Music website. Built on [Webiny](https://www.webiny.com/) 6.3.0, deployed to AWS.

## Content Models

### Hero Content
Homepage hero section (singleton). Title, tagline, social handle, and background image.

### Show
Upcoming shows and venues. Date, city, state, country, venue, ticket status, and RSVP link.

### Album
Music albums. Title, year, cover image, embed URL, and streaming links (Spotify, Apple Music).

### New Release
Featured singles/EPs. Title, release date, cover image, embed URL, and release type (single/ep/album).

### Merch Item
Merchandise products. Title, price, image, and shop link.

### About Content
About section (singleton). Heading, body text, and image.

### Contact Page
Contact page content (singleton). Featured image beside the contact form.

### Site Settings
Global config (singleton). Artist name, copyright, social links, and favicon.

## Scripts

```bash
# Seed content models
node --env-file=.env scripts/seed-content-models.mjs

# Seed sample content entries
node --env-file=.env scripts/seed-content-entries.mjs
```

## Deployment

```bash
# Deploy dev
AWS_PROFILE=jameswilliams npx webiny deploy --env=dev

# Deploy prod
AWS_PROFILE=jameswilliams WEBINY_ENCRYPTION_PASSPHRASE="..." npx webiny deploy --env=prod
```

## Setup

1. Copy `.env.example` to `.env` and fill in your API URL and token
2. Run `npm install`
3. Seed models, then seed entries
4. Deploy to desired environment
