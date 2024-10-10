# FSJ03 Portfolio Piece - Curated Finds Boutique

## Introduction

Curated Finds Boutique is an e-commerce platform designed to offer users a one-stop shopping experience. This application allows users to browse a curated selection of products, read and submit reviews, and manage their shopping experience. The project emphasizes user experience, responsive design, and accessibility, ensuring that customers can find what they need effortlessly.

## Features

- Product listings with detailed descriptions, images, and reviews.
- User authentication using Firebase Authentication.
- Review system that allows users to add, edit, and delete their reviews.
- Sorting functionality for reviews based on date and rating.
- A user-friendly interface that adapts to different screen sizes.

## Technologies Used

- **Next.js:** A React framework for server-side rendering and static site generation.
- - **Firebase**: A platform that provides authentication and database services.
- **React:** A JavaScript library for building user interfaces.
- **API**: Consuming a RESTful API hosted at `https://next-ecommerce-api.vercel.app` for product data.
- **Tailwind CSS:** A utility-first CSS framework for designing responsive layouts.
- **React Hooks**: For managing local component state and side effects.
- **JSDoc:** For documenting the JavaScript code.

## Setup Instructions

To set up the project locally, follow these steps:

1. **Clone the repository:** Open your terminal and select powershell, then:

   - git clone `https://github.com/OtlotlengMajuja/FSJ_Portfolio_Piece_OTLMAJ363_JSE2407_GroupD_Otlotleng-Majuja_FSJ03.git`
   - cd curated-finds-boutique

2. **Install dependencies:** Make sure you have Node.js installed, then run:

   - `npm install`

3. Set up Firebase:

   - Create a Firebase project and enable Authentication.
   - Add your Firebase configuration to a .env.local file in the root directory of the project.

   Example .env.local configuration:
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

4. **Running the project**
   - to start the development server run `npm run dev`

Open your browser and navigate to http://localhost:3000 to view the application

## Link to Hosted Application:[`https://vercel.live/link/curated-finds-boutique.vercel.app?via=project-dashboard-alias-list&p=1`]
