# WhatEatsWell Web Application

WhatEatsWell is a web application that allows users to search for nutrition information about various products and wholefoods. Users can create an account, search for foods, and save their favorite items to their profile. The application is designed to be intuitive and user-friendly, providing consistent serving size representations and nutrition blocks while omitting unnecessary information.
This application was inspired by the need for a more convenient way to track nutrition information, especially for individuals with dietary requirements such as diabetes. By having quick access to consistent and accurate nutrition data, users can manage their diet more effectively and understand portion sizes and the effects of foods and meals on their body at a glance.

## Table of Contents

<div align="center">
<tr>
  <td>

  [Features](#features)
   · [Technologies](#tech-stack)
   · [Installation](#installation)
   · [Running the Application](#running-the-application)
   · [Testing](#running-tests)
   · [API Documentation](#api-documentation)
   · [Contact](#contact)
   · [License](#license)
  
  </td>
</tr>

</div>

## Features

- **User Accounts:** Users can create an account, log in, and add foods to their account.
- **Search and Filter:** Users can search for products and wholefoods, and filter the results based on various criteria (filtering to be implemented).
- **Food Management(to-do):** Users can add foods to their profile and categorize them into different lists such as breakfast, lunch, dinner, etc.
- **Nutrition Information:** The app provides detailed nutrition information for each food item, helping users make informed dietary choices.
- **Meal Planning (to-do):** Users will be able to create custom meals from their saved foods and get nutritional summaries.
- **Easy Image Representation(to-do)** Nutrition categories (such as carbohydrates) will have image representation to showcase food nutrition facts into perspective


## Tech Stack

<div align="center">
<table>
<tr>
<th> Frontend </th>
<th> Backend </th>
</tr>
<tr>
<td>

```js
- React
- Vite
- JavaScript (ES6+)
- CSS (TailwindCSS)
```

</td>
<td>

```js
- Node.js
- Express
- MongoDB (MongoDB Atlas)
- JWT for authentication
```

</td>
</tr>
</table>
</div>

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/en/download/prebuilt-installer) v20.14.0 (LTS) and npm installed on your machine
- [MongoDB Atlas](https://www.mongodb.com/atlas) account allowing application's IP access with the database `accounts` and `foods` accessed through a `URI`

### Clone the Repository

```sh
git clone https://github.com/lenover12/WhatEatsWell
cd WhatEatsWell
```

### Backend

1. Navigate to the `server` directory:
    ```sh
    cd server
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the `server` directory with the following variables:
    ```env
    BASE_DB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/retryWrites=true&w=majority&appName=Cluster0
    PORT=404
    JWT_SECRET=<your_jwt_secret>
    ```

    - `BASE_DB_URI`: Replace `<username>` and `<password>` with your MongoDB Atlas credentials.
    - `PORT`: The port number the server will run on. Note that this value is currently hardcoded in the frontend.
    - `JWT_SECRET`: A secret key for JWT authentication.



### Frontend

1. Navigate to the `client` directory:
    ```sh
    cd client
    ```

2. Install the dependencies:
    ```sh
    npm install
    ```

Note: The `PORT` value in the `.env` file is currently hardcoded in the frontend. If you change it in the `.env` file, you will also need to update it in `App.jsx`:

```jsx
const port = 404;
```
## Running the Application
(development)

1. Navigate to the `server` directory:
    ```sh
    cd server
    ```
    
2. Start the backend server:
    ```sh
    npm start
    ```
3. Navigate to the `client` directory:
    ```sh
    cd ../server
    ```
 4. Start the frontend development server:   
    ```sh
    npm run dev
    ```

## Running Tests

### Backend Tests

The backend/server tests can be run from the `server` directory. These include unit tests for specific functions using mock MongoDB data, and integration tests for testing the server with a live MongoDB connection.

To run the tests:

```sh
cd server
npx ava
```

## API Documentation

For details on the Open Food Facts API and how it's used in this project, refer to the [Open Food Facts API Documentation](https://world.openfoodfacts.org/files/api-documentation.html).

No authentication is required for READ operations, but you must include a User-Agent HTTP Header with the name of your app, version, system, and a URL (if any) to avoid being blocked.

Example:
```
User-Agent: MyAppsName - Web - Version 1.0 - www.mywebsite.com
```

The search functionality may soon be updated once a stable release of the new API is available. Currently, we are using v1 for search. For more details, see the [Open Food Facts API v2 Documentation](https://openfoodfacts.github.io/openfoodfacts-server/api/ref-v2/#get-/api/v2/search).

## Contact

Feel free to reach out via [Email](mailto:lennymcdonald247+whateatswell@hotmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/leonard-mcdonald).

## License

This project is licensed under the GPL-3.0 License. See the LICENSE file for details.


## Extra: Migration Script

A `migrate.js` script is available to create the structure of the schemas in the MongoDB Atlas database. This script is not necessary for running the application, but it can be used to set up the database structure if needed.

To run the migration script, navigate to the `server` directory and run:

```sh
cd server
node migrate.js
```
