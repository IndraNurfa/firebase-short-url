# URL Shortener Application

## Overview

This application is a URL shortener service. It allows users to input a long URL and get a shortened version. When a user accesses the shortened URL, they are redirected to the original long URL. The application uses Next.js with the App Router, MongoDB for the database, and Mongoose for object data modeling.

## Features

*   **URL Shortening:** Converts long URLs into short, unique codes.
*   **Redirection:** Redirects users from the short URL to the original long URL.
*   **MongoDB Integration:** Stores the URL mappings in a MongoDB database.
*   **Modern UI:** A clean and responsive user interface built with Next.js and Tailwind CSS.

## Project Structure

*   `/app`: Contains the application's routes and UI.
    *   `/api/shorten/route.ts`: API endpoint for creating short URLs.
    *   `/[shortUrl]/page.tsx`: Dynamic route for handling redirection.
    *   `page.tsx`: The main page with the URL shortening form.
    *   `layout.tsx`: The root layout of the application.
    *   `globals.css`: Global styles for the application.
*   `/lib`: Contains utility functions.
    *   `db.ts`: Handles the connection to the MongoDB database.
*   `/models`: Contains the Mongoose models.
    *   `Url.ts`: The Mongoose model for the URL data.
*   `.env.local`: Configuration file for environment variables, including the MongoDB connection string.
*   `blueprint.md`: This file, documenting the project.

## Current Plan

The current plan is to build the URL shortener application as described above. The following steps will be taken:

1.  Set up the MongoDB connection.
2.  Create the Mongoose model for the URL data.
3.  Implement the API endpoint for shortening URLs.
4.  Implement the redirection logic for short URLs.
5.  Create the user interface for the application.
6.  Style the application to be visually appealing and responsive.
