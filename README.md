# M-Drive API

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

## Check User Login [POST /api/users/]

- Request: Check wether the user is logged in or not

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

## Login a User [POST /api/users/login]

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

- Response: 200 (application/json)

  - Body

          "logout successfully"

## Logout (from all devices) [GET /api/users/logoutAll]

- Request: Logout user from all devices

  - Headers

        Authorization: YOUR_JWT

- Response: 200 (application/json)

  - Body

          "Logged out from All devices"

## Get User Profile [GET /api/users/me]

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

## Activate User Account [GET /api/users/account/activate/:id]

- Request: Activate user account from the email send to the user.
  It is one time activation link i.e. on Next click link
  will be expired.

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

## Reset Account Password [POST /api/users/forgot/password]

- Request: Reset account password by sending the reset link to
  the user e-mail id.

- Response: 200 (application/json)

  - Body

          "Reset password link send to your e-mail account"

## Redirect [GET /forgot/password/redirect/:id]

- Request: Redirect the user to the reset password UI so that
  user can reset the password.

## Update Account Password [PUT /api/users/reset/password]

- Request: Reset account password.

  - Headers

        Content-type: application/json

  - Body

            {
              "_id_": "",
              "password": ""
            }

- Response: 200 (application/json)

  - Body

          "Password updated successfully"

## Upload File [POST /api/users/upload]

- Request: Upload and store file to AWS S3.

  - Headers

        Authorization: YOUR_JWT

  - Body (in form-data)

            KEY:file (type-file) VALUE: YOUR_FILE

- Response: 200 (application/json)

  - Body

          {
            "ETag": "",
            "Location": "",
            "key": "",
            "Key": ""
          }
