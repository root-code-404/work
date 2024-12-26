const bikePurchase = require("../../models/purchase/bike/bikePurchaseModel");
const carPurchase = require("../../models/purchase/car/carPurchaseModel");
const menPurchase = require("../../models/purchase/men/menPurchaseModel");

const Car = require("../../models/vehicles/car/carModel");
const Bike = require("../../models/vehicles/bike/bikeModel");
const Men = require('../../models/clothes/men/menModel');



// Helper function to fetch and combine car and bike purchases with pagination
const getPurchases = async (filterQuery = {}, page = 1, limit = 5) => {
    const limitNumber = Math.max(Number(limit), 1); // Ensure limit is a positive number
    const pageNumber = Math.max(Number(page), 1); // Ensure page is a positive number

    const [carPurchases, bikePurchases, menPurchases] = await Promise.all([
        carPurchase
            .find(filterQuery)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate("userId", "name email")
            .populate("itemTypeId", "itemName itemCategory price itemBrand itemType model")
            .populate("itemId", "model"),

        bikePurchase
            .find(filterQuery)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate("userId", "name email")
            .populate("itemTypeId", "itemName itemCategory price itemBrand itemType model")
            .populate("itemId", "model"),
        menPurchase
            .find(filterQuery)
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .populate("userId", "name email")
            .populate("itemTypeId", "itemName itemCategory price itemBrand itemType model")
            .populate("itemId", "model")
    ]);

    return [
        ...carPurchases.map((purchase) => ({
            ...purchase.toObject(),
            itemType: "Car",
        })),
        ...bikePurchases.map((purchase) => ({
            ...purchase.toObject(),
            itemType: "Bike",
        })),
        ...menPurchases.map((purchase) => ({
            ...purchase.toObject(),
            itemType: "Bike",
        })),
    ];
};

// Helper function to count purchases based on a filter
const countPurchases = async (filterQuery) => {
    try {
        const carCount = await carPurchase.countDocuments(filterQuery);
        const bikeCount = await bikePurchase.countDocuments(filterQuery);
        const menCount = await menPurchase.countDocuments(filterQuery);

        return carCount + bikeCount + menCount;
    } catch (error) {
        throw new Error("Error counting purchases: " + error.message);
    }
};

// Get all purchases (Cars and Bikes) with pagination
exports.getAllPurchases = async (req, res) => {
    const { page = 1, limit = 5 } = req.query;
    try {
        const allPurchases = await getPurchases({}, page, limit);
        const totalItems = await countPurchases({});
        res.status(200).json({
            purchases: allPurchases,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        console.error("Error fetching all purchases:", error);
        res.status(500).json({ message: "Failed to fetch purchase history", error: error.message });
    }
};

// Get all purchases for a specific user with pagination
exports.getUserPurchases = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    try {
        const filterQuery = { userId };
        const userPurchases = await getPurchases(filterQuery, page, limit);
        const totalItems = await countPurchases(filterQuery);
        res.status(200).json({
            purchases: userPurchases,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        console.error(`Error fetching purchases for user ${userId}:`, error);
        res.status(500).json({ message: "Error fetching user purchases", error: error.message });
    }
};


// Get purchases by item category (e.g., 'Car', 'Bike') with pagination
exports.getPurchasesByItemCategory = async (req, res) => {
    const { itemCategory } = req.params; // Ensure itemCategory is passed as a route parameter
    const { page = 1, limit = 5 } = req.query; // Pagination parameters

    let dynamicCollections = []; // Array to hold multiple collections

    if (itemCategory === "Vehicles") {
        dynamicCollections = [carPurchase, bikePurchase]; // Store both collections in an array
    } else if (itemCategory === "Clothes") {
        dynamicCollections = [menPurchase]; // Example for clothes, adjust as needed
    } else {
        return res.status(400).json({ message: "Invalid item category" });
    }

    console.log("Dynamic Collections: ", dynamicCollections);

    try {
        let allPurchases = [];

        // Loop through each collection and fetch data
        for (let collection of dynamicCollections) {
            const purchases = await collection
                .find() // Apply filters as needed
                .skip((page - 1) * limit) // Pagination
                .limit(Number(limit)) // Pagination
                .populate("userId", "name email") // Populating user info
                .populate("itemId", "model")
                .populate("itemTypeId", "itemName itemCategory price itemBrand itemType model"); // Populating item model info
                 // Populating item model info

            allPurchases = [...allPurchases, ...purchases]; // Combine the results from both collections
        }

        // Count total items matching the filter
        const totalItems = await dynamicCollections[0].countDocuments(); // Can change if you want to count from all collections
        console.log("Fetched Purchases: ", allPurchases);

        res.status(200).json({
            purchases: allPurchases,
            totalItems,
            currentPage: Number(page),
            totalPages: Math.ceil(totalItems / limit),
        });

    } catch (error) {
        console.error("Error fetching purchases:", error);
        res.status(500).json({
            message: "Failed to fetch purchases",
            error: error.message,
        });
    }}




// Get purchases by item brand with pagination
exports.getPurchasesByItemBrand = async (req, res) => {
    const { itemTypeId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    try {
        const filterQuery = { itemTypeId };
        const userPurchases = await getPurchases(filterQuery, page, limit);
        const totalItems = await countPurchases(filterQuery);
        res.status(200).json({
            purchases: userPurchases,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        console.error(`Error fetching purchases for user ${userId}:`, error);
        res.status(500).json({ message: "Error fetching user purchases", error: error.message });
    }
};
// Get purchases by item name with pagination
exports.getPurchasesByItemName = async (req, res) => {
    const { itemTypeId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    try {
        const filterQuery = { itemTypeId };
        const userPurchases = await getPurchases(filterQuery, page, limit);
        const totalItems = await countPurchases(filterQuery);
        res.status(200).json({
            purchases: userPurchases,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        console.error(`Error fetching purchases for user ${userId}:`, error);
        res.status(500).json({ message: "Error fetching user purchases", error: error.message });
    }
};
// Get purchases by model with pagination
exports.getPurchasesByModel = async (req, res) => {
    const { itemTypeId } = req.params;
    const { page = 1, limit = 5 } = req.query;
    try {
        const filterQuery = { itemTypeId };
        const userPurchases = await getPurchases(filterQuery, page, limit);
        const totalItems = await countPurchases(filterQuery);
        res.status(200).json({
            purchases: userPurchases,
            totalItems,
            currentPage: page,
            totalPages: Math.ceil(totalItems / limit),
        });
    } catch (error) {
        console.error(`Error fetching purchases for user ${userId}:`, error);
        res.status(500).json({ message: "Error fetching user purchases", error: error.message });
    }
};


exports.getPurchasesByItemType = async (req, res) => {
    const { itemType } = req.params; // Corrected line: using req.params instead of req.body
    const { page = 1, limit = 5 } = req.query; // Pagination parameters

    let dynamicCollection = null;

    if (itemType === "Car") {
        dynamicCollection = carPurchase;
    } else if (itemType === "Bike") {
        dynamicCollection = bikePurchase;
    } 
    else if (itemType === "Men") {
        dynamicCollection = menPurchase;
    } else {
        return res.status(400).json({ message: "Invalid item type" });
    }

    console.log("Dynamic Collection: ", dynamicCollection);

    try {
        // Adjusted filter query to use the correct field (assuming itemType is a string)
      

        const purchases = await dynamicCollection
            .find() // Apply filter query
            .skip((page - 1) * limit) // Pagination
            .limit(Number(limit)) // Pagination
            .populate("userId", "name email") // Populating user info
            .populate("itemTypeId", "itemName itemCategory price itemBrand itemType model")
            .populate("itemId", "model"); // Populating item model info

        const totalItems = await dynamicCollection.countDocuments();
        console.log("Fetched Purchases: ", purchases);

        res.status(200).json({
            purchases,
            totalItems,
            currentPage: Number(page),
            totalPages: Math.ceil(totalItems / limit),
        });

    } catch (error) {
        console.error("Error fetching purchases by item type:", error);
        res.status(500).json({
            message: "Failed to fetch purchases by item type",
            error: error.message,
        });
    }
};




