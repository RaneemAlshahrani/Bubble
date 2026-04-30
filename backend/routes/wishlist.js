const express = require("express");
const router = express.Router();
const Wishlist = require("../models/Wishlist");

// Add to wishlist
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const existingItem = await Wishlist.findOne({ userId, productId });

    if (existingItem) {
      return res.status(200).json(existingItem);
    }

    const wishlistItem = new Wishlist({
      userId,
      productId,
      quantity: quantity || 1,
    });

    await wishlistItem.save();
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
});

// Get user wishlist
router.get("/:userId", async (req, res) => {
  try {
    const wishlistItems = await Wishlist.find({
      userId: req.params.userId,
    }).populate("productId");

    res.status(200).json(wishlistItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to get wishlist" });
  }
});

// Update quantity
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Wishlist.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update wishlist item" });
  }
});

// Delete wishlist item
router.delete("/:id", async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete wishlist item" });
  }
});

module.exports = router;