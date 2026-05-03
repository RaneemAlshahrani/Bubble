// frontend/src/services/api.js

const API_URL = import.meta.env.PROD
  ? "/api"
  : "/api";

const makeUrl = (endpoint) => {
  if (endpoint.startsWith("/api/")) return endpoint;
  if (endpoint.startsWith("/")) return `${API_URL}${endpoint}`;
  return `${API_URL}/${endpoint}`;
};

export const getAuthToken = () => localStorage.getItem("token");

export const setAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id || user?._id || null;
};

export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

const parseResponse = async (response, fallbackMessage = "Something went wrong") => {
  const text = await response.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    console.error("Invalid server response:", text);
    throw new Error("Server returned invalid JSON");
  }

  if (!response.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
};

export const logout = async () => {
  try {
    const token = getAuthToken();

    if (token) {
      await fetch(makeUrl("/auth/logout"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("logout"));
    window.dispatchEvent(new Event("storage"));
  }
};

export const authFetch = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(makeUrl(endpoint), {
    ...options,
    headers,
  });

  return parseResponse(response);
};

// Auth
export const signup = async (userData) => {
  const response = await fetch(makeUrl("/auth/signup"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return parseResponse(response, "Signup failed");
};

export const signin = async (email, password) => {
  const response = await fetch(makeUrl("/auth/signin"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return parseResponse(response, "Login failed");
};

export const getUserProfile = async () => authFetch("/auth/profile");

export const updateUserProfile = async (profileData) =>
  authFetch("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });

export const uploadProfileImage = async (file) => {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(makeUrl("/auth/profile/image"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse(response, "Upload failed");
};

export const changePassword = async (currentPassword, newPassword) =>
  authFetch("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

export const verifyToken = async () => authFetch("/auth/verify");

// Products
export const getProducts = async () =>
  parseResponse(await fetch(makeUrl("/products")), "Failed to fetch products");

export const getProduct = async (id) =>
  parseResponse(await fetch(makeUrl(`/products/${id}`)), "Product not found");

// Cart
export const getCart = async (userId) =>
  parseResponse(await fetch(makeUrl(`/cart/${userId}`)), "Failed to fetch cart");

export const addToCart = async (data) =>
  authFetch("/cart", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCartItem = async (id, quantity) =>
  authFetch(`/cart/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

export const removeFromCart = async (id) =>
  authFetch(`/cart/${id}`, {
    method: "DELETE",
  });

export const clearCart = async (userId) => {
  const cart = await getCart(userId);
  await Promise.all(cart.map((item) => removeFromCart(item._id)));
};

// Wishlist
export const getWishlist = async (userId) =>
  parseResponse(await fetch(makeUrl(`/wishlist/${userId}`)), "Failed to fetch wishlist");

export const addToWishlist = async (data) =>
  authFetch("/wishlist", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const removeFromWishlist = async (id) =>
  authFetch(`/wishlist/${id}`, {
    method: "DELETE",
  });

export const updateWishlistItem = async (id, quantity) =>
  authFetch(`/wishlist/${id}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });

// Orders
export const createOrder = async (orderData) =>
  authFetch("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

export const getUserOrders = async () => authFetch("/orders/my-orders");

export const getOrderById = async (id) => authFetch(`/orders/${id}`);

// Reviews
export const getProductReviews = async (productId) =>
  parseResponse(await fetch(makeUrl(`/reviews/product/${productId}`)), "Failed to fetch reviews");

export const addReview = async (reviewData) =>
  authFetch("/reviews", {
    method: "POST",
    body: JSON.stringify(reviewData),
  });

export const deleteReview = async (id) =>
  authFetch(`/reviews/admin/${id}`, {
    method: "DELETE",
  });

// FAQ
export const getFAQs = async () =>
  parseResponse(await fetch(makeUrl("/faqs")), "Failed to fetch FAQs");

export const createFAQ = async (faqData) =>
  authFetch("/faqs", {
    method: "POST",
    body: JSON.stringify(faqData),
  });

export const updateFAQ = async (id, faqData) =>
  authFetch(`/faqs/${id}`, {
    method: "PUT",
    body: JSON.stringify(faqData),
  });

export const deleteFAQ = async (id) =>
  authFetch(`/faqs/${id}`, {
    method: "DELETE",
  });

// Tickets
export const getTickets = async () => authFetch("/tickets");

export const createTicket = async (ticketData) =>
  authFetch("/tickets", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });

export const updateTicket = async (id, ticketData) =>
  authFetch(`/tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify(ticketData),
  });

export const deleteTicket = async (id) =>
  authFetch(`/tickets/${id}`, {
    method: "DELETE",
  });

// Custom Options
export const getCustomOptions = async () =>
  parseResponse(await fetch(makeUrl("/custom-options")), "Failed to fetch custom options");

export const updateCustomOption = async (id, data) =>
  authFetch(`/custom-options/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

// Admin
export const getAdminDashboard = async (salesFilter = "all") =>
  authFetch(`/admin/dashboard?salesFilter=${salesFilter}`);

export const getAllOrders = async () => authFetch("/admin/orders");

export const updateOrderStatus = async (orderId, status) =>
  authFetch(`/admin/orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

export const getAllProducts = async () =>
  parseResponse(await fetch(makeUrl("/admin/products")), "Failed to fetch products");

export const createProduct = async (productData) => {
  const token = getAuthToken();
  const formData = new FormData();

  Object.keys(productData).forEach((key) => {
    if (key === "image" && productData.image instanceof File) {
      formData.append("image", productData.image);
    } else if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key]);
    }
  });

  const response = await fetch(makeUrl("/admin/products"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse(response, "Failed to create product");
};

export const updateProduct = async (id, productData) => {
  const token = getAuthToken();
  const formData = new FormData();

  Object.keys(productData).forEach((key) => {
    if (key === "image" && productData.image instanceof File) {
      formData.append("image", productData.image);
    } else if (productData[key] !== undefined && productData[key] !== null) {
      formData.append(key, productData[key]);
    }
  });

  const response = await fetch(makeUrl(`/admin/products/${id}`), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse(response, "Failed to update product");
};

export const deleteProduct = async (id) =>
  authFetch(`/admin/products/${id}`, {
    method: "DELETE",
  });

export const getAllPromotions = async () =>
  parseResponse(await fetch(makeUrl("/admin/promotions")), "Failed to fetch promotions");

export const createPromotion = async (promoData) =>
  authFetch("/admin/promotions", {
    method: "POST",
    body: JSON.stringify(promoData),
  });

export const deletePromotion = async (id) =>
  authFetch(`/admin/promotions/${id}`, {
    method: "DELETE",
  });

export const getAllReviews = async () => authFetch("/reviews/admin/all");

export const getInventory = async () =>
  parseResponse(await fetch(makeUrl("/admin/inventory")), "Failed to fetch inventory");

export const updateInventory = async (id, stock) =>
  authFetch(`/admin/inventory/${id}`, {
    method: "PUT",
    body: JSON.stringify({ stock }),
  });
