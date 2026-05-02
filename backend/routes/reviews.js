// backend/routes/reviews.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const { authenticateToken, authorizeRole } = require("../middleware/auth");

// GET all reviews (Admin only)
router.get("/admin/all", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const reviews = await Review.find().populate("productId", "name image").sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET reviews for a specific product
router.get("/product/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST add a review (authenticated users)
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    
    const review = new Review({
      productId,
      userId: req.user.userId,
      userName: req.user.fullName || "User",
      userEmail: req.user.email,
      rating: rating || 5,
      text,
    });
    
    await review.save();
    await review.populate("productId", "name image");
    
    res.status(201).json(review);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE review (Admin only)
router.delete("/admin/:id", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;