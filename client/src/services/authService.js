axios.post("/api/auth/login", userData)
  .then(res => {
    if (res.data.token) {
      console.log("🔹 Token received:", res.data.token);
      localStorage.setItem("token", res.data.token); 
    } else {
      console.error("Token missing in response.");
    }
  })
  .catch(err => {
    
    const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
    console.error("Login error:", errorMessage);
  });
