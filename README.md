# Car Listings Search App

This project is a React application that lets users search for car listings from two popular online marketplaces in Ethiopia, **Mekina.net** and **Jiji.com.et**, by scraping the sites directly. The app fetches and displays car details such as title, price, image, and location with various filters.

## Features

- Scrapes car listings from **Mekina.net** and **Jiji.com.et**.
- Allows users to search for cars based on a query (e.g., model, brand).
- Apply filters based on **brand**, **price range**, and **location**.
- Toggle between **light** and **dark modes**.
- View detailed car listings with options to visit the original listing pages.
- Caches search results for faster access on repeated searches.

## Requirements

Before setting up the application, make sure you have the following:

- **Node.js** (version 14 or higher)
- **npm** or **yarn**
- **Puppeteer** installed for scraping car listings (this is done in the backend).

You will also need to have the scraping backend set up.

## Backend Setup

To get started with scraping, you'll need the backend, which uses **Puppeteer** to scrape car listings from **Mekina.net** and **Jiji.com.et**.

1. Clone the **Car Listings Scraper API** repository to your local machine:

   ```bash
   git clone https://github.com/leul8/Car-Finder-For-Ethiopia.git
   cd car-listings-scraper-api

