# Horizon D'arts - Interactive Art Gallery Platform

## Overview
Horizon D'arts is a modern, interactive art gallery platform that connects artists, art enthusiasts, and collectors. The platform features a dynamic gallery space, upcoming exhibitions, and seamless artwork transactions powered by Stripe.

## Features

### For Art Enthusiasts
- Browse an extensive collection of artworks
- View detailed artwork information and artist profiles
- Participate in upcoming exhibitions
- Purchase artworks securely through Stripe
- Save favorite artworks to personal collections
- Receive notifications about new exhibitions and featured artists

### For Artists
- Create and manage artist profiles
- Upload and showcase artwork
- Participate in upcoming exhibitions
- Track artwork views and engagement
- Receive secure payments through Stripe
- Manage exhibition submissions

### Exhibition Features
- Interactive virtual exhibition spaces
- Real-time exhibition updates
- Secure artwork submission process
- Exhibition participation tracking
- Automated payment processing for submissions

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- React Query
- React Hot Toast
- Stripe Elements

### Backend
- Node.js
- Express.js
- MongoDB
- Stripe API
- JWT Authentication
- WebSocket for real-time features

## Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Stripe Account
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/horizon-darts.git
cd horizon-darts
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - Add necessary environment variables (see `.env.example` files)

## Configuration

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

```

## API Documentation

The API documentation is available at `/api-docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@horizondarts.com or join our Slack channel.

## Acknowledgments

- All contributing artists
- The open-source community
- Stripe for payment processing
- MongoDB for database services
