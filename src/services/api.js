// src/services/api.js
const API_URL = "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem("token");

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Get current user ID
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id || user?._id || null;
};

// Generic fetch function with authentication
export const authFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// Sign Up
export const signup = async (userData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }
  
  return data;
};

// Sign In
export const signin = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }
  
  return data;
};

// Verify Token
export const verifyToken = async () => {
  return authFetch("/auth/verify");
};

// Logout
export const logout = async () => {
  try {
    await authFetch("/auth/logout", { method: "POST" });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
  }
};

// Save user to localStorage
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};