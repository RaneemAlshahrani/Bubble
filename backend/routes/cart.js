const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const CustomOption = require("../models/CustomOption");

// Add to cart
router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity, customOptions, customPrice } = req.body;
    const qty = quantity || 1;

    // If customized soap, check and decrease selected option stocks
    if (customOptions) {
      const selectedNames = [
        ...(customOptions.scents || []),
        customOptions.texture,
        ...(customOptions.ingredients || []),
      ].filter(Boolean);

      const selectedOptions = await CustomOption.find({
        name: { $in: selectedNames },
      });

      for (const name of selectedNames) {
        const option = selectedOptions.find((item) => item.name === name);

        if (!option || !option.available || option.stock < qty) {
          return res.status(400).json({
            message: `${name} is out of stock or unavailable`,
          });
        }
      }

      await Promise.all(
        selectedOptions.map(async (option) => {
          option.stock -= qty;

          if (option.stock <= 0) {
            option.stock = 0;
            option.available = false;
          }

          await option.save();
        })
      );
    }

    let existingItem = null;

    if (!customOptions) {
      existingItem = await Cart.findOne({ userId, productId });
    }

    if (existingItem) {
      existingItem.quantity += qty;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const cartItem = new Cart({
      userId,
      productId,
      quantity: qty,
      customOptions,
      customPrice: customPrice || 0,
    });

    await cartItem.save();

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Get user cart
router.get("/:userId", async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId }).populate(
      "productId"
    );
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// Update quantity
router.put("/:id", async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      { quantity: req.body.quantity },
      { new: true }
    );

    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update cart item" });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete cart item" });
  }
});

module.exports = router;