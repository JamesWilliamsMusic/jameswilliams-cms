# Webiny CMS Content Models — James Williams Web

This document defines all content models needed in the Webiny Headless CMS to power the James Williams website. Create these models in **Webiny Admin → Headless CMS → Models**.

---

## 1. Hero Content

**Model Name:** Hero Content  
**Model ID (API Name):** `HeroContent`  
**Description:** Homepage hero section content

| Field | Field Type | API Name | Required | Notes |
|-------|-----------|----------|----------|-------|
| Title | Text | `title` | Yes | Display name, e.g. "JAMESWILLIAMS" |
| Tagline | Text | `tagline` | No | e.g. "A Symphony of the Pacific" |
| Social Handle | Text | `socialHandle` | Yes | e.g. "@JAMESWILLIAMSMUSIC" |
| Background Image | File | `backgroundImage` | Yes | Upload hero photo or paste URL. Use Webiny File Manager. |

**Sample Entry:**
```json
{
  "title": "JAMESWILLIAMS",
  "tagline": "A Symphony of the Pacific",
  "socialHandle": "@JAMESWILLIAMSMUSIC",
  "backgroundImage": "https://your-cdn.cloudfront.net/hero-image.jpg"
}
```

---

## 2. Show

**Model Name:** Show  
**Model ID (API Name):** `Show`  
**Description:** Upcoming shows and venues

| Field | Field Type | API Name | Required | Notes |
|-------|-----------|----------|----------|-------|
| Date | Date/Time | `date` | Yes | Date only (no time needed) |
| City | Text | `city` | Yes | e.g. "Malibu" |
| State | Text | `state` | Yes | e.g. "CA" |
| Venue | Text | `venue` | Yes | e.g. "Pacific Amphitheatre" |
| Status | Text | `status` | Yes | One of: `available`, `few_left`, `sold_out` |
| RSVP URL | Text | `rsvpUrl` | No | Link to ticket/RSVP page |

**Sample Entries:**
```json
[
  {
    "date": "2025-08-12",
    "city": "Malibu",
    "state": "CA",
    "venue": "Pacific Amphitheatre",
    "status": "available",
    "rsvpUrl": "https://tickets.example.com/malibu"
  },
  {
    "date": "2025-09-03",
    "city": "San Diego",
    "state": "CA",
    "venue": "Humphreys by the Bay",
    "status": "few_left",
    "rsvpUrl": "https://tickets.example.com/sandiego"
  },
  {
    "date": "2025-10-01",
    "city": "Portland",
    "state": "OR",
    "venue": "Revolution Hall",
    "status": "sold_out"
  }
]
```

---

## 3. Album

**Model Name:** Album  
**Model ID (API Name):** `Album`  
**Description:** Music albums with tracklists

| Field | Field Type | API Name | Required | Notes |
|-------|-----------|----------|----------|-------|
| Title | Text | `title` | Yes | e.g. "Golden Hour" |
| Year | Number | `year` | Yes | Release year |
| Track Count | Number | `trackCount` | Yes | Total number of tracks |
| Total Duration | Text | `totalDuration` | Yes | e.g. "37 min" |
| Cover Image | File | `coverImage` | Yes | Square album artwork |
| Tracks | Object (Repeatable) | `tracks` | Yes | See sub-fields below |

### Tracks Sub-fields (Repeatable Object)

| Field | Field Type | API Name | Required |
|-------|-----------|----------|----------|
| Title | Text | `title` | Yes |
| Duration | Text | `duration` | Yes |

**Sample Entry:**
```json
{
  "title": "Golden Hour",
  "year": 2025,
  "trackCount": 8,
  "totalDuration": "37 min",
  "coverImage": "https://your-cdn.cloudfront.net/golden-hour-cover.jpg",
  "tracks": [
    { "title": "Golden Hour", "duration": "4:23" },
    { "title": "Pacific Drift", "duration": "3:56" },
    { "title": "Saltwater Hymn", "duration": "5:11" },
    { "title": "Malibu Twilight", "duration": "4:02" },
    { "title": "Tides of Change", "duration": "3:47" },
    { "title": "Amber Skies", "duration": "6:15" },
    { "title": "Coastline", "duration": "4:38" },
    { "title": "The Last Wave", "duration": "5:30" }
  ]
}
```

---

## 4. Merch Item

**Model Name:** Merch Item  
**Model ID (API Name):** `MerchItem`  
**Description:** Merchandise products

| Field | Field Type | API Name | Required | Notes |
|-------|-----------|----------|----------|-------|
| Title | Text | `title` | Yes | Product name |
| Price | Number | `price` | Yes | Price in USD (no currency symbol) |
| Image | File | `image` | Yes | Product photo (4:5 aspect ratio preferred) |
| Shop URL | Text | `shopUrl` | No | Link to purchase page |

**Sample Entries:**
```json
[
  {
    "title": "Pacific Tee",
    "price": 45,
    "image": "https://your-cdn.cloudfront.net/pacific-tee.jpg",
    "shopUrl": "https://shop.example.com/pacific-tee"
  },
  {
    "title": "Coastline Cap",
    "price": 35,
    "image": "https://your-cdn.cloudfront.net/coastline-cap.jpg",
    "shopUrl": "https://shop.example.com/coastline-cap"
  },
  {
    "title": "Driftwood Tote",
    "price": 30,
    "image": "https://your-cdn.cloudfront.net/driftwood-tote.jpg",
    "shopUrl": "https://shop.example.com/driftwood-tote"
  },
  {
    "title": "Golden Hour Vinyl",
    "price": 28,
    "image": "https://your-cdn.cloudfront.net/golden-hour-vinyl.jpg",
    "shopUrl": "https://shop.example.com/vinyl"
  }
]
```

---

## 5. Site Settings

**Model Name:** Site Settings  
**Model ID (API Name):** `SiteSettings`  
**Description:** Global site configuration (create only one entry)

| Field | Field Type | API Name | Required | Notes |
|-------|-----------|----------|----------|-------|
| Artist Name | Text | `artistName` | Yes | e.g. "James Williams" |
| Copyright | Text | `copyright` | Yes | e.g. "© 2026 James Williams Music. All rights reserved." |
| Social Links | Object (Repeatable) | `socialLinks` | Yes | See sub-fields below |

### Social Links Sub-fields (Repeatable Object)

| Field | Field Type | API Name | Required | Notes |
|-------|-----------|----------|----------|-------|
| Platform | Text | `platform` | Yes | One of: `instagram`, `spotify`, `apple_music`, `youtube`, `tiktok` |
| URL | Text | `url` | Yes | Full URL to profile |

**Sample Entry:**
```json
{
  "artistName": "James Williams",
  "copyright": "© 2026 James Williams Music. All rights reserved.",
  "socialLinks": [
    { "platform": "instagram", "url": "https://instagram.com/jameswilliamsmusic" },
    { "platform": "spotify", "url": "https://open.spotify.com/artist/jameswilliams" },
    { "platform": "apple_music", "url": "https://music.apple.com/artist/jameswilliams" },
    { "platform": "youtube", "url": "https://youtube.com/@jameswilliamsmusic" },
    { "platform": "tiktok", "url": "https://tiktok.com/@jameswilliamsmusic" }
  ]
}
```

---

## API Connection

Once models are created and entries are published, the web app connects via:

```env
# .env.local in jameswilliams-web
WEBINY_API_URL=https://<your-cloudfront-domain>/cms/read/en-US
WEBINY_API_TOKEN=<your-api-token>
```

### Creating an API Token

1. Go to **Webiny Admin → Settings → API Keys**
2. Click **New API Key**
3. Name: `jameswilliams-web-read`
4. Permissions:
   - **Headless CMS:** Access level → `Read only`
   - **Content Models:** All models (or select specific ones)
   - **Locales:** `en-US`
5. Save and copy the generated token

### GraphQL Endpoint Structure

```
Read API:    https://<your-cloudfront-domain>/cms/read/en-US
Preview API: https://<your-cloudfront-domain>/cms/preview/en-US
Manage API:  https://<your-cloudfront-domain>/cms/manage/en-US
```

The web app uses the **Read API** — it only returns published content entries.

---

## Deployment Notes

- The web app falls back to mock data when `WEBINY_API_URL` is not set
- Content is revalidated every 60 seconds (ISR-style via `next: { revalidate: 60 }`)
- Images served from Webiny's S3/CloudFront are already configured in `next.config.js`
- Remember to **publish** entries in Webiny Admin — draft entries won't appear on the Read API
