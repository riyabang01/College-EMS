axios.post("/api/auth/login", userData)
  .then(res => {
    if (res.data.accessToken) {
      localStorage.setItem("accessToken", res.data.accessToken); 
      if (res.data.refreshToken) {
        localStorage.setItem("refreshToken", res.data.refreshToken);
      }
    } else {
      console.error("Token missing in response.");
    }
  })
  .catch(err => {
    const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
    console.error("Login error:", errorMessage);
  });
