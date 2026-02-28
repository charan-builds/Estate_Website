# Real Estate Admin Panel

This project is a Next.js 14 application designed for managing real estate projects. It features an admin panel that allows users to perform CRUD operations on real estate listings, utilizing Firebase for backend services and Cloudinary for image uploads. The application is styled using Tailwind CSS for a modern and responsive design.

## Project Structure

```
real-estate-admin
├── app
│   ├── layout.tsx
│   ├── page.tsx
│   ├── admin
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── projects
│   │   │   ├── page.tsx
│   │   │   └── [id]
│   │   │       └── page.tsx
│   ├── components
│   │   ├── Navbar.tsx
│   │   └── ...
├── components
│   ├── ProjectCard.tsx
│   └── ...
├── lib
│   ├── firebase.ts
│   └── cloudinary.ts
├── public
├── styles
│   ├── globals.css
│   └── tailwind.css
├── middleware.ts
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/charan-builds/Estate_Website.git
   cd Estate_Website/real-estate-admin
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Firebase Configuration**
   - Create a Firebase project and set up Firestore and Authentication.
   - Update the `lib/firebase.ts` file with your Firebase configuration.

4. **Cloudinary Configuration**
   - Create a Cloudinary account and obtain your API credentials.
   - Update the `lib/cloudinary.ts` file with your Cloudinary configuration.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Open your browser and navigate to `http://localhost:3000` to view the application.

## Features

- **Admin Panel**: A dedicated section for managing real estate projects.
- **CRUD Operations**: Create, Read, Update, and Delete projects with ease.
- **Responsive Design**: Built with Tailwind CSS for a modern look and feel.
- **Image Uploads**: Seamless integration with Cloudinary for handling project images.

## Usage Guidelines

- Use the admin panel to manage real estate listings effectively.
- Ensure that you have the necessary permissions set up in Firebase for authentication and Firestore access.
- Customize the project as needed to fit your specific requirements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.