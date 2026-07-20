#!/usr/bin/env node

/**
 * Webiny CMS Content Entry Seeder
 *
 * Creates and publishes sample content entries for all models.
 * Run AFTER seed-content-models.mjs has been executed.
 *
 * Usage: node --env-file=.env scripts/seed-content-entries.mjs
 *
 * Required env vars (in .env):
 *   WEBINY_MANAGE_API_URL - e.g. https://d3l3e5h3f27nk0.cloudfront.net/cms/manage/en-US
 *   WEBINY_API_TOKEN      - API key with full Headless CMS manage permissions
 */

const MANAGE_API_URL =
  process.env.WEBINY_MANAGE_API_URL ||
  "https://d3l3e5h3f27nk0.cloudfront.net/cms/manage/en-US";

const API_TOKEN = process.env.WEBINY_API_TOKEN;

if (!API_TOKEN) {
  console.error(
    "Error: WEBINY_API_TOKEN is required.\n" +
      "Create one in Webiny Admin → Settings → API Keys with full Headless CMS manage access."
  );
  process.exit(1);
}

// --- Helper ---

async function gql(query, variables = {}) {
  const res = await fetch(MANAGE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();

  if (json.errors) {
    throw new Error(JSON.stringify(json.errors, null, 2));
  }

  return json.data;
}

// --- Sample Data ---

const ENTRIES = {
  heroContent: [
    {
      title: "JAMESWILLIAMS",
      tagline: "A Symphony of the Pacific",
      socialHandle: "@JAMESWILLIAMSMUSIC",
    },
  ],
  tourDate: [
    {
      date: "2025-08-12",
      city: "Malibu",
      state: "CA",
      venue: "Pacific Amphitheatre",
      status: "available",
      rsvpUrl: "https://tickets.example.com/malibu",
    },
    {
      date: "2025-09-03",
      city: "San Diego",
      state: "CA",
      venue: "Humphreys by the Bay",
      status: "few_left",
      rsvpUrl: "https://tickets.example.com/sandiego",
    },
    {
      date: "2025-10-01",
      city: "Portland",
      state: "OR",
      venue: "Revolution Hall",
      status: "sold_out",
    },
  ],
  album: [
    {
      title: "Golden Hour",
      year: 2025,
      spotifyEmbedUrl: "https://open.spotify.com/embed/album/REPLACE_WITH_ALBUM_ID",
      spotifyUrl: "https://open.spotify.com/album/REPLACE_WITH_ALBUM_ID",
      appleMusicUrl: "https://music.apple.com/album/REPLACE_WITH_ALBUM_ID",
    },
  ],
  merchItem: [
    { title: "Pacific Tee", price: 45, shopUrl: "https://shop.example.com/pacific-tee" },
    { title: "Coastline Cap", price: 35, shopUrl: "https://shop.example.com/coastline-cap" },
    { title: "Driftwood Tote", price: 30, shopUrl: "https://shop.example.com/driftwood-tote" },
    { title: "Golden Hour Vinyl", price: 28, shopUrl: "https://shop.example.com/vinyl" },
  ],
  siteSettings: [
    {
      artistName: "James Williams",
      copyright: "© 2026 James Williams Music. All rights reserved.",
      instagramUrl: "https://instagram.com/jameswilliamsmusic",
      spotifyUrl: "https://open.spotify.com/artist/jameswilliams",
      appleMusicUrl: "https://music.apple.com/artist/jameswilliams",
      youtubeUrl: "https://youtube.com/@jameswilliamsmusic",
      tiktokUrl: "https://tiktok.com/@jameswilliamsmusic",
    },
  ],
  aboutContent: [
    {
      heading: "About James",
      body: "James Williams is a singer-songwriter based in Melbourne, Australia. Blending folk, indie, and soul, his music tells stories of love, growth, and finding your way home. With a voice that feels both intimate and expansive, James creates songs that stay with you long after the last note fades.",
    },
  ],
};

// --- Mutations ---

/**
 * Webiny auto-generates GraphQL mutations per model.
 * Model "tourDate" becomes "createTourDate" / "publishTourDate"
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Map modelId to singularApiName (must match what we used in seed-content-models)
const MODEL_API_NAMES = {
  heroContent: "HeroContent",
  tourDate: "TourDate",
  album: "Album",
  merchItem: "MerchItem",
  siteSettings: "SiteSettings",
  aboutContent: "AboutContent",
};

async function createAndPublishEntry(modelId, data) {
  const modelName = MODEL_API_NAMES[modelId];

  // Create - content fields go inside `data.values`
  const createMutation = `
    mutation Create($data: ${modelName}Input!) {
      create${modelName}(data: $data) {
        data {
          id
          entryId
        }
        error {
          code
          message
          data
        }
      }
    }
  `;

  const createResult = await gql(createMutation, { data: { values: data } });
  const created = createResult[`create${modelName}`];

  if (created.error) {
    const detail = created.error.data ? JSON.stringify(created.error.data) : "";
    throw new Error(`Create ${modelId} failed: ${created.error.message} ${detail}`);
  }

  const entryId = created.data.id;
  console.log(`      Created: ${entryId}`);

  // Publish - use the full id (includes revision like #0001)
  const publishMutation = `
    mutation Publish($revision: ID!) {
      publish${modelName}(revision: $revision) {
        data {
          id
          entryId
        }
        error {
          code
          message
          data
        }
      }
    }
  `;

  const publishResult = await gql(publishMutation, { revision: entryId });
  const published = publishResult[`publish${modelName}`];

  if (published.error) {
    // Webiny may auto-publish, so ignore "already published" style errors
    if (published.error.code === "PUBLISH_ERROR") {
      console.log(`      ⚠️  Publish returned error (may already be published), continuing...`);
    } else {
      const detail = published.error.data ? JSON.stringify(published.error.data) : "";
      throw new Error(`Publish ${modelId} failed: ${published.error.message} ${detail}`);
    }
  }

  return entryId;
}

// --- Main ---

async function main() {
  console.log("🌱 Webiny Content Entry Seeder");
  console.log("================================");
  console.log(`API: ${MANAGE_API_URL}`);
  console.log("");

  try {
    for (const [modelId, entries] of Object.entries(ENTRIES)) {
      console.log(`\n📄 Seeding ${modelId} (${entries.length} entries)...`);

      for (const entry of entries) {
        const label = entry.title || entry.venue || entry.artistName || modelId;
        const id = await createAndPublishEntry(modelId, entry);
        console.log(`   ✅ Created & published: "${label}" (${id})`);
      }
    }

    console.log("\n================================");
    console.log("✅ All content entries created and published!");
    console.log(`\nRead API: ${MANAGE_API_URL.replace("/manage/", "/read/")}`);
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
