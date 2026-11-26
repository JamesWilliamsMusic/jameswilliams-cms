#!/usr/bin/env node

/**
 * Webiny CMS Content Model Seeder
 *
 * Creates all content models programmatically via the Manage GraphQL API.
 * Run with: node --env-file=.env scripts/seed-content-models.mjs
 *
 * Required env vars (in .env):
 *   WEBINY_MANAGE_API_URL - e.g. https://<your-cloudfront-domain>/cms/manage/en-US
 *   WEBINY_API_TOKEN      - API key with full Headless CMS manage permissions
 */

const MANAGE_API_URL = process.env.WEBINY_MANAGE_API_URL;

const API_TOKEN = process.env.WEBINY_API_TOKEN;

if (!MANAGE_API_URL) {
  console.error(
    "Error: WEBINY_MANAGE_API_URL is required (no default, to avoid seeding the wrong environment)."
  );
  process.exit(1);
}

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

// --- Content Model Definitions ---

const CONTENT_MODEL_GROUP = {
  name: "James Williams",
  slug: "james-williams",
  description: "Content models for the James Williams website",
  icon: "fas/music",
};

const MODELS = [
  {
    name: "Hero Content",
    modelId: "heroContent",
    singularApiName: "HeroContent",
    pluralApiName: "HeroContents",
    description: "Homepage hero section content",
    fields: [
      {
        fieldId: "title",
        type: "text",
        label: "Title",
        validation: [{ name: "required", message: "Title is required" }],
      },
      {
        fieldId: "tagline",
        type: "text",
        label: "Tagline",
        validation: [],
      },
      {
        fieldId: "socialHandle",
        type: "text",
        label: "Social Handle",
        validation: [{ name: "required", message: "Social Handle is required" }],
      },
      {
        fieldId: "backgroundImage",
        type: "file",
        label: "Background Image",
      },
    ],
    layout: [["title"], ["tagline"], ["socialHandle"], ["backgroundImage"]],
    titleFieldId: "title",
  },
  {
    name: "Show",
    modelId: "show",
    singularApiName: "Show",
    pluralApiName: "Shows",
    description: "Upcoming shows and venues",
    fields: [
      {
        fieldId: "date",
        type: "datetime",
        label: "Date",
        validation: [{ name: "required", message: "Date is required" }],
        settings: { type: "date" },
      },
      {
        fieldId: "city",
        type: "text",
        label: "City",
        validation: [{ name: "required", message: "City is required" }],
      },
      {
        fieldId: "state",
        type: "text",
        label: "State",
        validation: [{ name: "required", message: "State is required" }],
      },
      {
        fieldId: "country",
        type: "text",
        label: "Country",
        validation: [{ name: "required", message: "Country is required" }],
      },
      {
        fieldId: "venue",
        type: "text",
        label: "Venue",
        validation: [{ name: "required", message: "Venue is required" }],
      },
      {
        fieldId: "status",
        type: "text",
        label: "Status",
        help: "One of: available, few_left, sold_out",
        validation: [
          { name: "required", message: "Status is required" },
          {
            name: "pattern",
            settings: { preset: "custom", regex: "^(available|few_left|sold_out)$" },
            message: "Must be one of: available, few_left, sold_out",
          },
        ],
      },
      {
        fieldId: "rsvpUrl",
        type: "text",
        label: "RSVP URL",
        help: "Link to ticket/RSVP page",
      },
    ],
    layout: [["date"], ["city", "state", "country"], ["venue"], ["status"], ["rsvpUrl"]],
    titleFieldId: "venue",
  },
  {
    name: "Album",
    modelId: "album",
    singularApiName: "Album",
    pluralApiName: "Albums",
    description: "Music albums with tracklists",
    fields: [
      {
        fieldId: "title",
        type: "text",
        label: "Title",
        validation: [{ name: "required", message: "Title is required" }],
      },
      {
        fieldId: "releaseDate",
        type: "datetime",
        label: "Release Date",
        validation: [{ name: "required", message: "Release Date is required" }],
        settings: { type: "date" },
      },
      {
        fieldId: "year",
        type: "number",
        label: "Year",
        validation: [{ name: "required", message: "Year is required" }],
      },
      {
        fieldId: "coverImage",
        type: "file",
        label: "Cover Image",
      },
      {
        fieldId: "embedUrl",
        type: "text",
        label: "Embed URL",
        help: "Spotify embed URL e.g. https://open.spotify.com/embed/album/YOUR_ALBUM_ID?utm_source=generator",
      },
      {
        fieldId: "spotifyUrl",
        type: "text",
        label: "Spotify URL",
        help: "Direct link to album on Spotify",
      },
      {
        fieldId: "appleMusicUrl",
        type: "text",
        label: "Apple Music URL",
        help: "Direct link to album on Apple Music",
      },
    ],
    layout: [["title", "releaseDate"], ["year"], ["coverImage"], ["embedUrl"], ["spotifyUrl", "appleMusicUrl"]],
    titleFieldId: "title",
  },
  {
    name: "Merch Item",
    modelId: "merchItem",
    singularApiName: "MerchItem",
    pluralApiName: "MerchItems",
    description: "Merchandise products",
    fields: [
      {
        fieldId: "title",
        type: "text",
        label: "Title",
        validation: [{ name: "required", message: "Title is required" }],
      },
      {
        fieldId: "price",
        type: "number",
        label: "Price",
        help: "Price in USD (no currency symbol)",
        validation: [{ name: "required", message: "Price is required" }],
      },
      {
        fieldId: "image",
        type: "file",
        label: "Image",
      },
      {
        fieldId: "shopUrl",
        type: "text",
        label: "Shop URL",
        help: "Link to purchase page",
      },
    ],
    layout: [["title", "price"], ["image"], ["shopUrl"]],
    titleFieldId: "title",
  },
  {
    name: "Site Settings",
    modelId: "siteSettings",
    singularApiName: "SiteSettings",
    pluralApiName: "SiteSettingsPlural",
    description: "Global site configuration (create only one entry)",
    fields: [
      {
        fieldId: "artistName",
        type: "text",
        label: "Artist Name",
        validation: [{ name: "required", message: "Artist Name is required" }],
      },
      {
        fieldId: "copyright",
        type: "text",
        label: "Copyright",
        validation: [{ name: "required", message: "Copyright is required" }],
      },
      {
        fieldId: "instagramUrl",
        type: "text",
        label: "Instagram URL",
      },
      {
        fieldId: "spotifyUrl",
        type: "text",
        label: "Spotify URL",
      },
      {
        fieldId: "appleMusicUrl",
        type: "text",
        label: "Apple Music URL",
      },
      {
        fieldId: "youtubeUrl",
        type: "text",
        label: "YouTube URL",
      },
      {
        fieldId: "tiktokUrl",
        type: "text",
        label: "TikTok URL",
      },
      {
        fieldId: "favicon",
        type: "file",
        label: "Favicon",
        help: "Site favicon (ICO, PNG, or SVG)",
      },
    ],
    layout: [["artistName"], ["copyright"], ["favicon"], ["instagramUrl"], ["spotifyUrl"], ["appleMusicUrl"], ["youtubeUrl"], ["tiktokUrl"]],
    titleFieldId: "artistName",
  },
  {
    name: "About Content",
    modelId: "aboutContent",
    singularApiName: "AboutContent",
    pluralApiName: "AboutContents",
    description: "About section content (singleton - only one entry)",
    fields: [
      {
        fieldId: "heading",
        type: "text",
        label: "Heading",
        validation: [{ name: "required", message: "Heading is required" }],
      },
      {
        fieldId: "body",
        type: "long-text",
        label: "Body",
        validation: [{ name: "required", message: "Body is required" }],
      },
      {
        fieldId: "image",
        type: "file",
        label: "Image",
      },
    ],
    layout: [["heading"], ["body"], ["image"]],
    titleFieldId: "heading",
  },
  {
    name: "Contact Page",
    modelId: "contactPageContent",
    singularApiName: "ContactPageContent",
    pluralApiName: "ContactPageContents",
    description: "Content for the /contact page (singleton - only one entry)",
    fields: [
      {
        fieldId: "image",
        type: "file",
        label: "Image",
        help: "Featured image displayed beside the contact form (4:5 aspect ratio recommended)",
      },
    ],
    layout: [["image"]],
    titleFieldId: "image",
  },
  {
    name: "New Release",
    modelId: "newRelease",
    singularApiName: "NewRelease",
    pluralApiName: "NewReleases",
    description: "Featured singles/EPs with embed player",
    fields: [
      {
        fieldId: "title",
        type: "text",
        label: "Title",
        validation: [{ name: "required", message: "Title is required" }],
      },
      {
        fieldId: "releaseDate",
        type: "datetime",
        label: "Release Date",
        validation: [{ name: "required", message: "Release Date is required" }],
        settings: { type: "date" },
      },
      {
        fieldId: "coverImage",
        type: "file",
        label: "Cover Image",
      },
      {
        fieldId: "embedUrl",
        type: "text",
        label: "Embed URL",
        help: "Spotify/Apple Music embed URL",
        validation: [{ name: "required", message: "Embed URL is required" }],
      },
      {
        fieldId: "type",
        type: "text",
        label: "Type",
        help: "One of: single, ep, album",
        validation: [
          { name: "required", message: "Type is required" },
          {
            name: "pattern",
            settings: { preset: "custom", regex: "^(single|ep|album)$" },
            message: "Must be one of: single, ep, album",
          },
        ],
      },
    ],
    layout: [["title", "type"], ["releaseDate"], ["coverImage"], ["embedUrl"]],
    titleFieldId: "title",
  },
];

// --- Mutations ---

async function createGroup() {
  console.log(`\n📁 Creating content model group: "${CONTENT_MODEL_GROUP.name}"...`);

  const query = `
    mutation CreateGroup($data: CmsContentModelGroupInput!) {
      createContentModelGroup(data: $data) {
        data {
          id
          name
          slug
        }
        error {
          code
          message
        }
      }
    }
  `;

  const data = await gql(query, { data: CONTENT_MODEL_GROUP });
  const result = data.createContentModelGroup;

  if (result.error) {
    if (result.error.message?.includes("already exists")) {
      console.log(`   ⚠️  Group already exists, fetching existing...`);
      return await getExistingGroup();
    }
    throw new Error(`Failed to create group: ${result.error.message}`);
  }

  console.log(`   ✅ Created group: ${result.data.name} (${result.data.id})`);
  return result.data.id;
}

async function getExistingGroup() {
  const query = `
    query ListGroups {
      listContentModelGroups {
        data {
          id
          name
          slug
        }
        error {
          code
          message
        }
      }
    }
  `;

  const data = await gql(query);
  const groups = data.listContentModelGroups.data;
  const group = groups.find((g) => g.slug === CONTENT_MODEL_GROUP.slug);

  if (!group) {
    throw new Error("Could not find existing group");
  }

  console.log(`   ✅ Found group: ${group.name} (${group.id})`);
  return group.id;
}

async function createModel(model, groupId) {
  console.log(`\n📝 Creating model: "${model.name}"...`);

  const createQuery = `
    mutation CreateModel($data: CmsContentModelCreateInput!) {
      createContentModel(data: $data) {
        data {
          modelId
          name
        }
        error {
          code
          message
        }
      }
    }
  `;

  const createData = {
    name: model.name,
    modelId: model.modelId,
    singularApiName: model.singularApiName,
    pluralApiName: model.pluralApiName,
    group: groupId,
    description: model.description,
  };

  const createResult = await gql(createQuery, { data: createData });
  const created = createResult.createContentModel;

  if (created.error) {
    if (created.error.code === "MODEL_ALREADY_EXISTS" || created.error.message?.includes("already exists")) {
      console.log(`   ⚠️  Model "${model.name}" already exists, updating fields...`);
    } else {
      throw new Error(`Failed to create model: ${created.error.message}`);
    }
  } else {
    console.log(`   ✅ Created model: ${created.data.name}`);
  }

  // Now update with fields and layout
  const updateQuery = `
    mutation UpdateModel($modelId: ID!, $data: CmsContentModelUpdateInput!) {
      updateContentModel(modelId: $modelId, data: $data) {
        data {
          modelId
          name
          fields {
            fieldId
            type
            label
          }
        }
        error {
          code
          message
        }
      }
    }
  `;

  // Webiny requires an `id` and `renderer` on each field definition
  const RENDERER_MAP = {
    text: { name: "text-input" },
    number: { name: "number-input" },
    datetime: { name: "date-time-input" },
    file: { name: "file-input" },
    object: { name: "object" },
  };

  const fieldsWithIds = model.fields.map((field) => {
    const f = {
      id: field.fieldId,
      renderer: RENDERER_MAP[field.type] || { name: "text-input" },
      ...field,
    };
    // Also add ids and renderers to nested object fields
    if (f.settings?.fields) {
      f.settings = {
        ...f.settings,
        fields: f.settings.fields.map((sf) => ({
          id: sf.fieldId,
          renderer: RENDERER_MAP[sf.type] || { name: "text-input" },
          ...sf,
        })),
      };
    }
    return f;
  });

  const updateData = {
    fields: fieldsWithIds,
    layout: model.layout,
    titleFieldId: model.titleFieldId,
  };

  const updateResult = await gql(updateQuery, {
    modelId: model.modelId,
    data: updateData,
  });

  const updated = updateResult.updateContentModel;

  if (updated.error) {
    throw new Error(`Failed to update model fields: ${updated.error.message}`);
  }

  console.log(`   ✅ Fields configured: ${updated.data.fields.map((f) => f.fieldId).join(", ")}`);
}

// --- Main ---

async function main() {
  console.log("🚀 Webiny Content Model Seeder");
  console.log("================================");
  console.log(`API: ${MANAGE_API_URL}`);
  console.log("");

  try {
    // 1. Create content model group
    const groupId = await createGroup();

    // 2. Create each model
    for (const model of MODELS) {
      await createModel(model, groupId);
    }

    console.log("\n================================");
    console.log("✅ All content models created successfully!");
    console.log("\nNext steps:");
    console.log("  1. Go to Webiny Admin → Headless CMS → Models to verify");
    console.log("  2. Create content entries for each model");
    console.log("  3. Publish entries so they appear on the Read API");
    console.log(`  4. Set WEBINY_API_URL=${MANAGE_API_URL.replace("/manage/", "/read/")} in your web app`);
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    process.exit(1);
  }
}

main();
