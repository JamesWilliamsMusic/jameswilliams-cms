# Custom Domain Setup – jameswilliamsmusic.store

## Overview

| Environment | Domain | CloudFront Distribution |
|-------------|--------|------------------------|
| Production | `cms.jameswilliamsmusic.store` | `d3l3e5h3f27nk0.cloudfront.net` (E2D2ZD0HMUFL1Y) |
| Development | `cms.dev.jameswilliamsmusic.store` | `d3l3e5h3f27nk0.cloudfront.net` (E2D2ZD0HMUFL1Y) |

- **Domain registrar:** get.store (DNS managed there, not Route 53)
- **AWS Account:** 986995923840
- **AWS CLI Profile:** `jameswilliams`

---

## ACM Certificate

| Field | Value |
|-------|-------|
| ARN | `arn:aws:acm:us-east-1:986995923840:certificate/3c3a8360-a17b-48e7-b21f-4289383a4f22` |
| Region | us-east-1 (required for CloudFront) |
| Domains | `cms.jameswilliamsmusic.store`, `cms.dev.jameswilliamsmusic.store` |
| Validation | DNS (manual CNAME records) |

---

## DNS Validation Records

Add these CNAME records in the get.store DNS panel:

### Record 1 – cms.jameswilliamsmusic.store

| Type | Name | Value |
|------|------|-------|
| CNAME | `_978a4d1baece1bae53047f50dcba9940.cms.jameswilliamsmusic.store` | `_de78702e19e06ec58376e8387218e737.jkddzztszm.acm-validations.aws` |

### Record 2 – cms.dev.jameswilliamsmusic.store

| Type | Name | Value |
|------|------|-------|
| CNAME | `_3377a849457ebf2e4ef5ccd982133005.cms.dev.jameswilliamsmusic.store` | `_a23eed55a32011794fdbc8ca5cf3da2e.jkddzztszm.acm-validations.aws` |

> **Note:** Some DNS providers require you to omit the trailing dot and/or the base domain from the Name field. For example, instead of `_978a4d1baece1bae53047f50dcba9940.cms.jameswilliamsmusic.store.`, you might enter just `_978a4d1baece1bae53047f50dcba9940.cms`.

---

## Domain Routing Records

After the certificate is validated (status changes to ISSUED), add these CNAME records to point the custom domains to CloudFront:

### Production

| Type | Name | Value |
|------|------|-------|
| CNAME | `cms.jameswilliamsmusic.store` | `d3l3e5h3f27nk0.cloudfront.net` |

### Development

| Type | Name | Value |
|------|------|-------|
| CNAME | `cms.dev.jameswilliamsmusic.store` | `d3l3e5h3f27nk0.cloudfront.net` |

---

## Verification Commands

```bash
# Check certificate validation status
aws acm describe-certificate \
  --profile jameswilliams \
  --region us-east-1 \
  --certificate-arn "arn:aws:acm:us-east-1:986995923840:certificate/3c3a8360-a17b-48e7-b21f-4289383a4f22" \
  --query "Certificate.Status"

# Check DNS propagation
dig CNAME _978a4d1baece1bae53047f50dcba9940.cms.jameswilliamsmusic.store
dig CNAME cms.jameswilliamsmusic.store
```

---

## Steps to Complete

1. ✅ ACM certificate requested in us-east-1
2. ⬜ Add DNS validation CNAME records in get.store DNS panel
3. ⬜ Wait for certificate to be ISSUED (usually 5–30 minutes after DNS propagates)
4. ⬜ Deploy Webiny with custom domain config (`webiny deploy --env=dev`)
5. ⬜ Add domain routing CNAME records pointing to CloudFront
6. ⬜ Verify `https://cms.jameswilliamsmusic.store` loads the admin panel
