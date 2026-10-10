const loginUser = async (email, password, navigate) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (data.accessToken && data.refreshToken && data.user) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));  

        if (data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
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

const refreshToken = async () => {
  const token = localStorage.getItem('refreshToken');
  if (!token) {
    console.error('No refresh token available.');
    return null;
  }

  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: token }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken);
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

const fetchData = async (url) => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('No access token available.');
    return null;
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      if (response.status === 401 || data.message === 'Expired or invalid token') {
        const newAccessToken = await refreshToken();
        if (newAccessToken) {
          return fetchData(url);
        }
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
