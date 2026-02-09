# Google OAuth Integration Guide

## Setup Instructions

### 1. Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: Web application
   - Authorized origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173/auth/google/callback`
5. Copy your **Client ID** and **Client Secret**

### 2. Environment Variables

Create `.env` file in `frontend/` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_API_URL=http://localhost:5000
```

### 3. Frontend Integration

Install Google OAuth library:

```bash
npm install @react-oauth/google
```

### 4. Update AuthContext

Wrap your app with GoogleOAuthProvider:

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

export const App = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <YourApp />
  </GoogleOAuthProvider>
);
```

### 5. Update LoginPage & SignUpPage

Replace mock Google login with real implementation:

```jsx
import { useGoogleLogin } from '@react-oauth/google';

const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (response) => {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: response.access_token }),
    });
    const data = await res.json();
    login(data.token, data.user);
    navigate('/');
  },
  onError: () => setError('Google login failed'),
});
```

### 6. Backend Setup

Create Google OAuth endpoint in Express:

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    // Create or update user in database
    // Return JWT token
    
    res.json({
      token: jwtToken,
      user: { email: payload.email, name: payload.name },
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});
```

## Current Implementation

- **Mock Login**: Works without real Google OAuth
- **Demo Credentials**: See LoginPage for test accounts
- **Ready for Production**: All UI/UX is in place, just connect to real endpoints

## Demo Accounts

- **Admin**: admin@topspeed.com / admin123
- **User**: user@topspeed.com / user123
