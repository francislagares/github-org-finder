![Image](https://res.cloudinary.com/jobber-app/image/upload/v1684787771/github-banners/mern_tvu7kz.webp)

# Node.js API - GitHub Repositories Explorer

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/francislagares/github-org-finder/ci.yaml?style=for-the-badge)

![Image](https://res.cloudinary.com/jobber-app/image/upload/v1733915642/Screenshot_From_2024-12-11_12-10-49_wthrkp.png)

This project is a Node.js-based API for exploring GitHub organization repositories. The API supports both local and Dockerized environments. Follow the instructions below to set up and run the project.

---

## **Prerequisites**

Before you begin, make sure you have the following installed:

1. **Node.js** (recommended version: 23 or later).
2. **pnpm** (preferred package manager for this project).
3. **Docker** and **Docker Compose**.
4. A GitHub personal access token for API authentication.

---

# Setup Instructions

## 1. Running Locally

To run the API locally:

1. Clone the repository and install dependencies.

```sh
# clone repository
git clone git@github.com:francislagares/github-org-finder.git

# cd into
cd github-org-finder

# install required dependencies
pnpm install
```

<br />

## **Environment Variables**

The API requires the following environment variables. Configure these in a `.env` or `.env.development.local` file in the api directory.

```env
GITHUB_SECRET=your_github_secret
REDIS_HOST=localhost
DATABASE_URL=mongodb://localhost:27017/repos_db
CORS_ORIGIN=http://localhost:5173
```

## Running with Docker

To run the API using Docker:

1. Ensure Docker and Docker Compose are installed and running on your system.

2. Create a `.env` or `.env.development.local` file in the api directory with the following Docker environment variables.

```env
GITHUB_SECRET=your_github_secret
REDIS_HOST=redis
DATABASE_URL=mongodb://mongodb:27017/repos_db
CORS_ORIGIN=http://localhost:5173
```

3. Build and start the Docker containers:

```sh
docker-compose up --build
```

4. Verify the API is running by accessing http://localhost:4000/api/v1/health

## API Endpoints

### **Health Check**

- **URL:** `/health`
- **Method:** `GET`
- **Description:** Checks if the API is running.

### **Fetch Repositories**

- **URL:** `/api/v1/orgs/:orgName/repos`
- **Method:** `GET`
- **Query Parameters:**
  - `page` (optional): Page number for pagination (default is `1`).
  - `limit` (optional): Limit number for repositories (default is `10`).
- **Description:** Retrieves repositories for a given GitHub organization.

### **Save Repositories to Database**

- **URL:** `/api/v1/repos/save`
- **Method:** `POST`
- **Description:** Saves repositories to the MongoDB database.

### **Delete Repository**

- **URL:** `/api/v1/repos/:id`
- **Method:** `DELETE`
- **Description:** Deletes a repository from the MongoDB database by its ID.

## Query the API in Swagger

This project provides an API that you can interact with using Swagger, an interactive API documentation tool. To query the API correctly, you need to configure your environment with the GITHUB_SECRET token, which is required to access certain routes of the API.

### 2. Access Swagger

Once the `GITHUB_SECRET` variable is configured, you can access Swagger to explore and query the API.

- **Swagger URL**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs) _(adjust the port if needed)_.

### 3. Authenticate with GitHub Secret

When accessing the API documentation via Swagger, you need to authenticate using the `GITHUB_SECRET` token. This is done via an HTTP header for routes that require authentication.

#### Add the token in Swagger

1. Open the Swagger page in your browser.
2. At the top, you'll find an "Authorize" button.
3. Click on "Authorize".
4. In the authentication field, enter your actual GITHUB_SECRET token for the `Authorization` header like so:

```
ghp_12345abcdef6789test
```

(Replace ghp_12345abcdef6789 with your actual GITHUB_SECRET token).

5. Click "Authorize" to confirm.

Now you will be able to make authenticated requests to the API routes that require the GITHUB_SECRET token.

## Current Project Status

While the API is already functional the client side is still in development and additional features are being developed and refined. <br /> Please check the client folder for the latest updates.

## Author

- [Francis Lagares](https://www.linkedin.com/in/francislagares)
- [Portfolio](https://francislagares.vercel.app/)

## All contributions are welcome

Contributions are more than welcomed.

Feel free to open issues for asking questions, suggesting features or other things!
