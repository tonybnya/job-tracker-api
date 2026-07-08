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
  }'
```

Fields: `name` (min 2), `email` (valid), `password` (min 6).

Response: `201 Created`
```json
{ "message": "User registered successfully", "userId": "..." }
```

---

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

Response: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "name": "Alice Johnson", "email": "alice@example.com" }
}
```

Save the token for job endpoints:

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"password123"}' \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).token))")
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
  }'
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

Response: `201 Created` with the created job object.

---

### List All Jobs

```bash
curl http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN"
```

Response: `200 OK` with an array of jobs (newest first).

---

### Get Job by ID

```bash
curl http://localhost:3000/api/v1/jobs/<JOB_ID> \
  -H "Authorization: Bearer $TOKEN"
```

Example:

```bash
JOB_ID=$(curl -s http://localhost:3000/api/v1/jobs \
  -H "Authorization: Bearer $TOKEN" \
  | node -e "process.stdin.on('data',d=>console.log(JSON.parse(d)[0].id))")

curl http://localhost:3000/api/v1/jobs/$JOB_ID \
  -H "Authorization: Bearer $TOKEN"
```

Response: `200 OK` with the job object, or `404` if not found or not owned by you.

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
  }'
```

Same schema as create. Response: `200 OK` with the updated job.

---

### Delete Job

```bash
curl -X DELETE http://localhost:3000/api/v1/jobs/<JOB_ID> \
  -H "Authorization: Bearer $TOKEN"
```

Response: `200 OK`
```json
{ "message": "Job history entry removed successfully" }
```

---

## Health Check

```bash
curl http://localhost:3000/health
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
| `400` | Validation error — missing or invalid fields (`{ "errors": ... }`) |
| `401` | Missing or invalid token (`{ "error": "Access denied. Token missing" }`) |
| `403` | Token expired or invalid (`{ "error": "Invalid or expired token" }`) |
| `404` | Route not found or job not owned by you |
| `500` | Internal server error |
