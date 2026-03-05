# API Documentation - Portfolio Application

## Base URL

- **Development:** `http://localhost/api/v1`
- **Production:** `https://yourdomain.com/api/v1`

## Authentication

The API uses Laravel Sanctum for authentication with cookie-based sessions for the SPA.

### CSRF Protection

Before making any authenticated requests, you must first obtain a CSRF token:

```http
GET /sanctum/csrf-cookie
```

This sets a cookie that will be automatically included in subsequent requests.

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@amiruliman.dev",
  "password": "your-password"
}
```

**Success Response (200):**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "Amirul Iman",
      "email": "admin@amiruliman.dev"
    }
  }
}
```

**Error Response (401):**
```json
{
  "error": {
    "message": "Invalid credentials"
  }
}
```

### Logout

```http
POST /api/v1/auth/logout
```

Requires authentication.

**Success Response (200):**
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

### Get Authenticated User

```http
GET /api/v1/auth/me
```

Requires authentication.

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Amirul Iman",
    "email": "admin@amiruliman.dev"
  }
}
```

---

## Public Endpoints

### Get Profile

Get aggregated profile data for the home page.

```http
GET /api/v1/profile
```

**Success Response (200):**
```json
{
  "data": {
    "name": "Amirul Iman",
    "title": "Full Stack Web Software Engineer",
    "summary": "Full Stack Developer with experience...",
    "email": "amirul.iman698@gmail.com",
    "phone": "0143123321",
    "github": "https://github.com/iamirul2000",
    "linkedin": "www.linkedin.com/in/mirul-",
    "featured_projects": [
      {
        "id": 1,
        "title": "PilgrimPro",
        "slug": "pilgrimpro",
        "description": "Company operations system...",
        "technologies": ["Laravel", "PHP", "MySQL"],
        "thumbnail_url": "/storage/projects/pilgrimpro.jpg"
      }
    ],
    "skills_summary": {
      "Backend": ["Laravel", "PHP", "MySQL"],
      "Frontend": ["Angular", "TypeScript"],
      "Mobile": ["Flutter", "Swift", "Java"]
    }
  }
}
```

### List Projects

Get all projects with optional filtering.

```http
GET /api/v1/projects?featured=true&page=1
```

**Query Parameters:**
- `featured` (boolean, optional): Filter by featured status
- `page` (integer, optional): Page number for pagination

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "PilgrimPro",
      "slug": "pilgrimpro",
      "description": "Laravel-based web system...",
      "role": "Full Stack Developer",
      "start_date": "2023-09-01",
      "end_date": "2024-10-01",
      "highlights": [
        "Developed Laravel-based web system",
        "Designed normalized database schema"
      ],
      "technologies": ["Laravel", "PHP", "MySQL", "REST APIs"],
      "repo_url": null,
      "live_url": null,
      "thumbnail_url": "/storage/projects/pilgrimpro.jpg",
      "is_featured": true
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 3
  }
}
```

### Get Single Project

Get a single project by slug.

```http
GET /api/v1/projects/{slug}
```

**Success Response (200):**
```json
{
  "data": {
    "id": 1,
    "title": "PilgrimPro",
    "slug": "pilgrimpro",
    "description": "Laravel-based web system for company operations...",
    "role": "Full Stack Developer",
    "start_date": "2023-09-01",
    "end_date": "2024-10-01",
    "highlights": [
      "Developed and optimized Laravel-based web system",
      "Designed and normalized database schema",
      "Built RESTful APIs for frontend communication"
    ],
    "technologies": ["Laravel", "PHP", "MySQL", "REST APIs"],
    "repo_url": null,
    "live_url": null,
    "thumbnail_url": "/storage/projects/pilgrimpro.jpg",
    "is_featured": true
  }
}
```

**Error Response (404):**
```json
{
  "error": {
    "message": "Project not found"
  }
}
```

### List Experiences

Get all work experiences.

```http
GET /api/v1/experiences
```

**Success Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "company_name": "Asian Business Software Solutions (ABSS)",
      "role_title": "Full Stack Web Software Engineer",
      "location": "Malaysia",
      "company_domain": "Fintech",
      "start_date": "2024-10-20",
      "end_date": null,
      "is_current": true,
      "summary": "Working on Angular frontend and Laravel backend...",
      "highlights": [
        "Bug fixing and maintaining existing modules",
        "Improving stability and performance",
        "Collaborating with team"
      ],
      "technologies": ["Angular", "PHP", "Laravel", "MySQL", "Git"]
    }
  ]
}
```

### List Skills

Get all skills grouped by category.

```http
GET /api/v1/skills
```

**Success Response (200):**
```json
{
  "data": {
    "Backend": [
      {
        "id": 1,
        "name": "Laravel",
        "level": "Advanced"
      },
      {
        "id": 2,
        "name": "PHP",
        "level": "Advanced"
      }
    ],
    "Frontend": [
      {
        "id": 5,
        "name": "Angular",
        "level": "Intermediate"
      }
    ],
    "Mobile": [
      {
        "id": 8,
        "name": "Flutter",
        "level": "Intermediate"
      }
    ]
  }
}
```

### Submit Contact Form

Submit a contact message.

```http
POST /api/v1/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Job Opportunity",
  "message": "I would like to discuss..."
}
```

**Rate Limit:** 5 requests per hour per IP address

**Success Response (201):**
```json
{
  "data": {
    "message": "Thank you for your message. I'll get back to you soon!"
  }
}
```

**Validation Error (422):**
```json
{
  "error": {
    "message": "Validation failed",
    "details": {
      "email": ["The email field must be a valid email address."],
      "message": ["The message field is required."]
    }
  }
}
```

**Rate Limit Error (429):**
```json
{
  "error": {
    "message": "Too many requests. Please try again later."
  }
}
```

---

## Admin Endpoints

All admin endpoints require authentication via Laravel Sanctum.

### Dashboard Statistics

Get dashboard statistics and recent messages.

```http
GET /api/v1/admin/dashboard
```

**Success Response (200):**
```json
{
  "data": {
    "projects_count": 3,
    "experiences_count": 3,
    "skills_count": 15,
    "unread_messages_count": 5,
    "recent_messages": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "subject": "Job Opportunity",
        "created_at": "2024-03-05T10:30:00Z",
        "status": "new"
      }
    ]
  }
}
```

### Projects Management

#### List Projects

```http
GET /api/v1/admin/projects?page=1&per_page=15
```

**Query Parameters:**
- `page` (integer, optional): Page number
- `per_page` (integer, optional): Items per page

**Success Response (200):** Paginated list of projects

#### Create Project

```http
POST /api/v1/admin/projects
Content-Type: multipart/form-data

{
  "title": "New Project",
  "description": "Project description...",
  "role": "Full Stack Developer",
  "start_date": "2024-01-01",
  "end_date": "2024-06-01",
  "highlights": ["Achievement 1", "Achievement 2"],
  "technologies": ["Laravel", "Angular"],
  "repo_url": "https://github.com/...",
  "live_url": "https://example.com",
  "is_featured": true,
  "thumbnail": <file>
}
```

**Success Response (201):** Created project data

#### Get Single Project

```http
GET /api/v1/admin/projects/{id}
```

**Success Response (200):** Project data

#### Update Project

```http
PUT /api/v1/admin/projects/{id}
Content-Type: multipart/form-data

{
  "title": "Updated Project",
  ...
}
```

**Success Response (200):** Updated project data

#### Delete Project

```http
DELETE /api/v1/admin/projects/{id}
```

**Success Response (204):** No content

### Experiences Management

#### List Experiences

```http
GET /api/v1/admin/experiences
```

#### Create Experience

```http
POST /api/v1/admin/experiences
Content-Type: application/json

{
  "company_name": "Company Name",
  "role_title": "Role Title",
  "location": "Location",
  "company_domain": "Domain",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "is_current": false,
  "summary": "Summary text...",
  "highlights": ["Highlight 1", "Highlight 2"],
  "technologies": ["Tech 1", "Tech 2"]
}
```

#### Get Single Experience

```http
GET /api/v1/admin/experiences/{id}
```

#### Update Experience

```http
PUT /api/v1/admin/experiences/{id}
```

#### Delete Experience

```http
DELETE /api/v1/admin/experiences/{id}
```

### Skills Management

#### List Skills

```http
GET /api/v1/admin/skills
```

#### Create Skill

```http
POST /api/v1/admin/skills
Content-Type: application/json

{
  "name": "Skill Name",
  "category": "Backend",
  "level": "Advanced",
  "order": 0
}
```

**Valid Categories:** Backend, Frontend, Mobile, Database, Tools
**Valid Levels:** Beginner, Intermediate, Advanced, Expert

#### Get Single Skill

```http
GET /api/v1/admin/skills/{id}
```

#### Update Skill

```http
PUT /api/v1/admin/skills/{id}
```

#### Delete Skill

```http
DELETE /api/v1/admin/skills/{id}
```

### Contact Messages Management

#### List Messages

```http
GET /api/v1/admin/contact-messages?status=new&page=1
```

**Query Parameters:**
- `status` (string, optional): Filter by status (new, read, all)
- `page` (integer, optional): Page number

**Success Response (200):** Paginated list of messages

#### Get Single Message

```http
GET /api/v1/admin/contact-messages/{id}
```

**Note:** Viewing a message automatically marks it as read.

**Success Response (200):** Message data

#### Update Message Status

```http
PATCH /api/v1/admin/contact-messages/{id}/status
Content-Type: application/json

{
  "status": "read"
}
```

**Valid Status Values:** new, read

**Success Response (200):** Updated message

#### Delete Message

```http
DELETE /api/v1/admin/contact-messages/{id}
```

**Success Response (204):** No content

---

## Error Responses

All error responses follow this format:

```json
{
  "error": {
    "message": "Error message",
    "details": {
      "field": ["Error detail"]
    }
  }
}
```

### Common HTTP Status Codes

- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **204 No Content:** Request successful, no content to return
- **401 Unauthorized:** Authentication required or failed
- **403 Forbidden:** Authenticated but not authorized
- **404 Not Found:** Resource not found
- **422 Unprocessable Entity:** Validation failed
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

---

## Rate Limiting

- **Contact Form:** 5 requests per hour per IP address
- **Admin Endpoints:** No rate limiting (protected by authentication)

---

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:4200` (development)
- Your production domain (configure in `.env`)

Credentials (cookies) are supported for authentication.

---

## Testing the API

### Using cURL

```bash
# Get CSRF token
curl -X GET http://localhost/sanctum/csrf-cookie -c cookies.txt

# Login
curl -X POST http://localhost/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -b cookies.txt -c cookies.txt \
  -d '{"email":"admin@amiruliman.dev","password":"password"}'

# Get authenticated user
curl -X GET http://localhost/api/v1/auth/me \
  -b cookies.txt
```

### Using Postman

1. Create a new request
2. Set method and URL
3. For authenticated requests:
   - First call `/sanctum/csrf-cookie`
   - Then make your authenticated request
   - Postman will automatically handle cookies

---

## Notes

- All dates are in `YYYY-MM-DD` format
- All timestamps are in ISO 8601 format with UTC timezone
- File uploads must use `multipart/form-data` content type
- Maximum file upload size: 5MB
- Supported image formats: jpg, png, webp
