# API Documentation

## Description

This API provides endpoints to manage users and user authentication. It is built with Node.js and PostgreSQL, and it is dockerized for easy deployment.

## User Data Schema

The user data follows the following JSON format:

```json
{
  "id": "string",
  "email": "string",
  "password": "string",
  "name": "string",
}
```

## API Versioning

The API follows versioning to maintain backward compatibility as it evolves. 
Currently, the API version is `v1`.

Example: `http://localhost:8080/api/v1/users`

## Running the Application

To run the application, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/fouadmen/node-user-api.git
cd node-user-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database (if not using the dockerized database):

   - Create a PostgreSQL database with the required configuration (host, port, name, username, password) see .env_template for refernce.
   - Update the `.env` file with the appropriate database connection details.

4. Start the Node.js server:

```bash
npm run dev
```

The API should now be accessible at `http://localhost:8080/`.

## Testing the API

To run the automated tests, use:

```bash
npm test
```

This will execute the test under `tests` folder.

## Endpoints

### 1. `GET /api/v1/users`

- Description: Retrieves a list of all users.
- Authorization: Requires user authentication (valid JWT token).
- Role: Any authenticated user can access this endpoint.
- Response:
  - 200 OK: Returns an array of user objects.
  - 401 Unauthorized: If the request lacks a valid JWT token.
  - 403 Forbidden: If the authenticated user does not have the necessary permissions.
  - 500 Internal Server Error: If there was an issue retrieving the users.

### 2. `GET /api/v1/users/:id`

- Description: Retrieves a specific user by their ID.
- Authorization: Requires user authentication (valid JWT token) and user authorization (own user or admin role).
- Role: Any authenticated user can access this endpoint for their own user details. Admin can access all user details.
- Parameters:
  - `id`: The unique ID of the user to retrieve.
- Response:
  - 200 OK: Returns the user object.
  - 401 Unauthorized: If the request lacks a valid JWT token.
  - 403 Forbidden: If the authenticated user does not have the necessary permissions.
  - 404 Not Found: If the user with the specified ID does not exist.
  - 500 Internal Server Error: If there was an issue retrieving the user.

### 3. `PUT /api/v1/users/:id`

- Description: Updates a specific user's information.
- Authorization: Requires user authentication (valid JWT token) and user authorization (own user or admin role).
- Role: Any authenticated user can update their own user details. Admin can update any user details.
- Parameters:
  - `id`: The unique ID of the user to update.
- Request Body: Provide the updated user data in JSON format.
- Response:
  - 200 OK: Returns the updated user object.
  - 400 Bad Request: If the request body does not follow the validation schema.
  - 401 Unauthorized: If the request lacks a valid JWT token.
  - 403 Forbidden: If the authenticated user does not have the necessary permissions.
  - 404 Not Found: If the user with the specified ID does not exist.
  - 500 Internal Server Error: If there was an issue updating the user.

### 4. `DELETE /api/v1/users/:id`

- Description: Deletes a specific user by their ID.
- Authorization: Requires user authentication (valid JWT token) and user authorization (own user or admin role).
- Role: Any authenticated user can delete their own user account. Admin can delete any user account.
- Parameters:
  - `id`: The unique ID of the user to delete.
- Response:
  - 204 No Content: If the user was successfully deleted.
  - 400 Bad Request: If the request cannot be satisfied.
  - 403 Forbidden: If the authenticated user does not have the necessary permissions.
  - 404 Not Found: If the user with the specified ID does not exist.
  - 500 Internal Server Error: If there was an issue deleting the user.

### 5. `POST /api/v1/register`

- Description: Registers a new user.
- Request Body: Provide the user registration data in JSON format.
- Response:
  - 201 Created: If the user was successfully registered.
  - 400 Bad Request: If the request body does not follow the validation schema or user already exists.
  - 500 Internal Server Error: If there was an issue registering the user.

### 6. `POST /api/v1/login`

- Description: Authenticates a user and returns a JWT token.
- Request Body: Provide the user login credentials (email and password) in JSON format.
- Response:
  - 200 OK: Returns a JWT token on successful authentication.
  - 400 Bad Request: If the request body does not follow the validation schema or if the login credentials are invalid or user not found.
  - 500 Internal Server Error: If there was an issue during login.