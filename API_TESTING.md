# API Testing Guide

## Prerequisites

```bash
# Start the dev server
npm run dev
```

Base URL: `http://localhost:3000/api/v1`

---

## Auth Endpoints

### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123"
  }' | jq
```

Fields: `name` (min 2), `email` (valid), `password` (min 6).

Response: `201 Created`
```json
{ "success": true, "data": { "userId": "..." } }
```

---

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }' | jq
```

Response: `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "...", "name": "Alice Johnson", "email": "alice@example.com" }
  }
}
```

Save the token for job endpoints:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"password123"}' \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).data.token))")
```

Seeded users (password `password123` for all):

| Name | Email |
|------|-------|
| Alice Johnson | alice@example.com |
| Bob Smith | bob@example.com |
| Carol Davis | carol@example.com |
| Dan Wilson | dan@example.com |
| Eve Martin | eve@example.com |
| Frank Lee | frank@example.com |
| Grace Kim | grace@example.com |
| Henry Brown | henry@example.com |
| Ivy Chen | ivy@example.com |
| Jack Taylor | jack@example.com |

---

## Job Endpoints

All job endpoints require `Authorization: Bearer <token>` header.

### Create Job

```bash
curl -X POST http://localhost:3000/api/v1/jobs \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "company": "Stripe",
    "url": "https://stripe.com/jobs",
    "position": "Backend Engineer",
    "location": "Remote - US",
    "jobType": "remote",
    "status": "applied",
    "hiringPerson": "Sarah Chen",
    "notes": "Referred by a friend",
    "appliedDate": "2026-07-01T12:00:00.000Z"
  }' | jq
```

Fields:

| Field | Required | Valid values |
|---|---|---|
| `company` | yes | min 1 char |
| `url` | yes | valid URL |
| `position` | yes | min 1 char |
| `location` | yes | min 1 char |
| `jobType` | yes | `on-site`, `remote`, `hybrid`, `internship`, `contract`, `part-time` |
| `status` | yes | `applied`, `phone-screen`, `interviewed`, `offer`, `rejected`, `ghosted` |
| `hiringPerson` | no | string or null |
| `notes` | no | string or null |
| `appliedDate` | no | ISO 8601 datetime (defaults to now if omitted) |

Response: `201 Created`
```json
{ "success": true, "data": { ...job } }
```

---

### List All Jobs

```bash
# All jobs (newest first)
curl http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN" | jq

# Filtered by status
curl "http://localhost:3000/api/v1/jobs?status=interviewed" \
  -H "Authorization: Bearer $TOKEN" | jq

# Sorted ascending by date
curl "http://localhost:3000/api/v1/jobs?sort=date" \
  -H "Authorization: Bearer $TOKEN" | jq

# Paginated (page 1, 5 per page)
curl "http://localhost:3000/api/v1/jobs?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq

# Combined
curl "http://localhost:3000/api/v1/jobs?status=rejected&sort=date&page=1&limit=3" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Query parameters:

| Param | Type | Description |
|---|---|---|
| `status` | string | Filter by job status (`applied`, `phone-screen`, `interviewed`, `offer`, `rejected`, `ghosted`) |
| `sort` | string | Set to `date` for ascending order (defaults to newest first) |
| `page` | integer | Page number (starts at 1) |
| `limit` | integer | Items per page (max 100, defaults to 10 when `page` is set) |

Response (without pagination): `200 OK`
```json
{ "success": true, "data": [ ...jobs ] }
```

Response (with `page` & `limit`): `200 OK`
```json
{
  "success": true,
  "data": {
    "jobs": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 5,
      "total": 50,
      "totalPages": 10
    }
  }
}
```

---

### Get Application Stats

```bash
curl "http://localhost:3000/api/v1/jobs/stats" \
  -H "Authorization: Bearer $TOKEN" | jq
```

Response: `200 OK`
```json
{
  "success": true,
  "data": [
    { "status": "applied", "count": 1 },
    { "status": "phone-screen", "count": 1 },
    { "status": "interviewed", "count": 1 },
    { "status": "offer", "count": 1 },
    { "status": "rejected", "count": 0 },
    { "status": "ghosted", "count": 0 }
  ]
}
```
Only statuses with at least one job are returned.

---

### Get Job by ID

```bash
curl http://localhost:3000/api/v1/jobs/<JOB_ID> \
  -H "Authorization: Bearer $TOKEN" | jq
```

Example:

```bash
JOB_ID=$(curl -s http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN" \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).data[0].id))")

curl http://localhost:3000/api/v1/jobs/$JOB_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

Response: `200 OK`
```json
{ "success": true, "data": { ...job } }
```
Returns `{ "success": false, "error": "Job entry not found or unauthorized" }` with `404` if not found.

---

### Update Job

```bash
curl -X PUT http://localhost:3000/api/v1/jobs/<JOB_ID> \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "company": "Stripe",
    "url": "https://stripe.com/jobs",
    "position": "Senior Backend Engineer",
    "location": "Remote - US",
    "jobType": "remote",
    "status": "interviewed",
    "hiringPerson": "Sarah Chen",
    "notes": "Had a great first round"
  }' | jq
```

Same schema as create. Response: `200 OK`
```json
{ "success": true, "data": { ...updatedJob } }
```

---

### Delete Job

```bash
curl -X DELETE http://localhost:3000/api/v1/jobs/<JOB_ID> \
  -H "Authorization: Bearer $TOKEN" | jq
```

Response: `200 OK`
```json
{ "success": true, "data": { "message": "Job history entry removed successfully" } }
```

---

## Health Check

```bash
curl http://localhost:3000/health | jq
```

Response: `200 OK`
```json
{
  "status": "UP",
  "timestamp": "2026-07-08T13:39:21.860Z",
  "services": {
    "express": "UP",
    "database": "UP"
  }
}
```

Returns `503` if the database is unreachable.

---

## Error Responses

| Status | Meaning |
|---|---|
| `400` | Validation error — missing or invalid fields (`{ "success": false, "error": { ... } }`) |
| `401` | Missing or invalid token (`{ "success": false, "error": "Access denied. Token missing" }`) |
| `403` | Token expired or invalid (`{ "success": false, "error": "Invalid or expired token" }`) |
| `404` | Route not found or job not owned by you |
| `500` | Internal server error |
