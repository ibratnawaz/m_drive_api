# Contact Keeper API

This is a Node/Express/MongoDB REST API for M-Drive application that uses JWT authentication. All private endpoints are protected using JWT. It is the API ONLY. The fullstack app can be found [here](https://github.com/nawazibrat/M-Drive)

## Getting Started

```
  Create .env file and add your mongoURI, jwtSecret key and other private credentials
```

```bash
  npm install
  npm run dev # Runs on http://localhost:5000
```

# API Usage & Endpoints

## Register a User [POST /api/users/register]

- Request: Add user and send email for account activation

  - Headers

        Content-type: application/json

  - Body

            {
              "first_name": "",
              "last_name": "",
              "email": "",
              "password": ""
            }

- Response: 201 (application/json)

  - Body

          {
            "user": ""
          }

## Login with a User [POST /api/users/login]

- Request: Login with credentials to receive a JSON web token

  - Headers

        Content-type: application/json

  - Body

            {
              "email": "",
              "password": ""
            }

- Response: 200 (application/json)

  - Body

          {
            "user": ""
            "token": ""
          }

## Logout (current session) [GET /api/users/logout]

- Request: Logout user from the current session

  - Headers

        Authorization: YOUR_JWT

* Response: 200 (application/json)

  - Body

          "logout successfully"

## Logout (from all devices) [POST /api/users/logoutAll]

- Request: Logout user from all devices

  - Headers

        Authorization: YOUR_JWT

- Response: 200 (application/json)

  - Body

          "Logged out from All devices"

## Get User Profile [PUT /api/users/me]

- Request: Get user profile details

  - Headers

        Authorization: YOUR_JWT

- Response: 200 (application/json)

  - Body

          {
            "_id": "",
            "first_name": "",
            "last_name": "",
            "email": "",
            "createdAt": "",
            "updatedAt": "",
            "__v": ""
          }

## Update User Profile [PUT /api/users/me]

- Request: Update user profile details

  - Headers

        Authorization: YOUR_JWT

* Response: 200 (application/json)

  - Body

          {
            "_id": "",
            "first_name": "",
            "last_name": "",
            "email": "",
            "createdAt": "",
            "updatedAt": "",
            "__v": ""
          }

## Activate User Account [GET /api/users/account/activate/:id]

- Request: Activate user account from the email send to the user.
  It is one time activation link i.e. on Next click link
  will be expired.

* Response: 200 (application/json)

  - Body

          {
            "_id": "",
            "first_name": "",
            "last_name": "",
            "email": "",
            "createdAt": "",
            "updatedAt": "",
            "__v": ""
          }
