import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthForm = ({ setUser }) => {
  const [name, setName] = useState(""); // Added name state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("user");
    setError("");
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
        ? { email, password }
        : { name, email, password, role }; // Include name in signup request

      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);

      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setUser(response.data.user);

        if (!isLogin) {
          navigate("/login"); // Redirect to login after signup
        } else {
          navigate(response.data.user.role === "admin" ? "/admin-dashboard" : "/");
        }
      } else {
        setError(isLogin ? "Login failed: Missing token in response." : "Signup failed: Missing token in response.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4 auth-form-container">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="text-center">{isLogin ? "Login" : "Signup"}</h2>
              {error && <p className="text-danger text-center">{error}</p>}
              <Form onSubmit={handleSubmit} autoComplete="off">
                
                {!isLogin && (
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin} // Name is required only for signup
                      name="name"
                      autoComplete="new-name"
                    />
                  </Form.Group>
                )}

                <Form.Group controlId="formBasicEmail" className="mt-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    name="email"
                    autoComplete="new-email"
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    name="password"
                    autoComplete="new-password"
                  />
                </Form.Group>

                {!isLogin && (
                  <Form.Group controlId="formBasicRole" className="mt-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)} required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                )}

                <Button variant="primary" type="submit" className="mt-3 w-100" disabled={loading}>
                  {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
                </Button>
              </Form>

              <Button variant="link" onClick={() => setIsLogin(!isLogin)} className="mt-3 w-100 text-center">
                {isLogin ? "Switch to Signup" : "Switch to Login"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
