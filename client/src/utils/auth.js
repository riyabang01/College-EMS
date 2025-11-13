// Login user and store access and refresh tokens
const loginUser = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
      console.log('Login Response:', data);  // Log response to verify
  
      if (response.ok) {
        if (data.accessToken && data.refreshToken && data.user) {
          // Save tokens and user data in localStorage
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          localStorage.setItem('user', JSON.stringify(data.user));  // Save user data including role
  
          console.log('Login successful!');
  
          // Check the user role and redirect accordingly
          if (data.user.role === 'admin') {
            // Redirect to admin dashboard
            window.location.href = '/admin-dashboard';
          } else {
            // Redirect to home page for regular users
            window.location.href = '/home';
          }
        } else {
          console.error('Login failed: Tokens or user data missing in response');
        }
      } else {
        console.error('Login failed:', data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  
  
  
  
  
  // Refresh access token using the refresh token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      console.error('No refresh token available.');
      return null;
    }
  
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        console.log('Access token refreshed!');
        return data.accessToken;
      } else {
        console.error('Token refresh failed:', data.message);
        return null;
      }
    } catch (error) {
      console.error('Error during token refresh:', error);
      return null;
    }
  };
  
  // Fetch data from a protected endpoint using the access token
  const fetchData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      console.error('No access token available.');
      return null;
    }
  
    try {
      const response = await fetch('/api/some-protected-endpoint', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Data fetched successfully:', data);
        return data;
      } else {
        console.error('Error fetching data:', data.message);
  
        if (data.message === 'Expired or invalid token') {
          // Try refreshing the token if expired
          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            // Retry the fetch request with the new access token
            return fetchData();
          } else {
            console.error('Unable to refresh access token.');
            return null;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };
  
  // Example usage:
  // loginUser('user@example.com', 'password123');
  // fetchData();
  // refreshToken();
  