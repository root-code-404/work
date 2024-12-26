const Car = require("../../models/vehicles/car/carModel");
const Bike = require("../../models/vehicles/bike/bikeModel");
const Men = require('../../models/clothes/men/menModel');

const bikePurchase = require("../../models/purchase/bike/bikePurchaseModel");
const carPurchase = require("../../models/purchase/car/carPurchaseModel");
const menPurchase = require("../../models/purchase/men/menPurchaseModel");

const Item = require("../../models/item/itemModel");

const getDynamicCollection = (itemType) => {
  switch (itemType.toLowerCase()) {
    case "car":
      return carPurchase;
    case "bike":
      return bikePurchase;
    case "men":
      return menPurchase;
    default:
      return null;
  }
};

// Purchase Item
exports.purchaseItem = async (req, res) => {
  const { itemId, itemTypeId, userId, quantity, itemType } = req.body;

  const itemCollection = getDynamicCollection(itemType);
  const dynamicCollection = itemType === "Car" ? Car : itemType === "Bike" ? Bike : itemType === "Men" ? Men : null;

  if (!itemCollection || !dynamicCollection) {
    return res.status(400).json({ message: "Invalid item type" });
  }

  try {
    // Fetch the item from the dynamic collection (Car or Bike)
    const item = await dynamicCollection.findById(itemTypeId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in dynamic collection." });
    }

    // Fetch the item from the global Item collection
    const globalItem = await Item.findById(itemId);
    if (!globalItem) {
      return res.status(404).json({ message: "Item not found in global Item collection." });
    }

    // Check and update the quantity
    if (item.itemQuantity < quantity || globalItem.itemQuantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity." });
    }
    item.itemQuantity -= quantity;
    globalItem.itemQuantity -= quantity;

    await item.save();
    await globalItem.save();

    // Create a purchase record
    const purchase = new itemCollection({
      itemId,
      itemTypeId,
      userId,
      quantity,
      purchaseDate: new Date(),
    });

    await purchase.save();

    res.status(200).json({ message: "Purchase successful", purchase });
  } catch (error) {
    console.error("Error processing purchase:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

