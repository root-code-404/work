import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const FormPage = () => {
    const location = useLocation();
    const { category: selectedCategoryFromState, type: selectedTypeFromState } = location.state || {};
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [itemBrands, setItemBrands] = useState([]);
    const [itemNames, setItemNames] = useState([]);
    const [itemNos, setItemNos] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [itemTypes, setItemTypes] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(selectedCategoryFromState || '');
    const [selectedType, setSelectedType] = useState(selectedTypeFromState || '');
    const [selectedItemType, setSelectedItemType] = useState('');
    const [selectedItemBrand, setSelectedItemBrand] = useState('');
    const [selectedItemName, setSelectedItemName] = useState('');
    const [selectedItemNo, setSelectedItemNo] = useState('');
    const [selectedItemQnty, setSelectedItemQnty] = useState('');

    const fileInputRef = useRef(null);

    const [itemDetails, setItemDetails] = useState({
        year: '',
        features: '',
        description: '',
        price: '',
        priceUnit: 'Lakh',
        itemImage: '',
    });

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/items/categories/all');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch types based on selected category
    useEffect(() => {
        if (selectedCategory) {
            const fetchTypes = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/items/categories/${selectedCategory}/types`
                    );
                    setTypes(response.data);
                } catch (error) {
                    console.error('Error fetching types:', error);
                }
            };
            fetchTypes();
        }
    }, [selectedCategory]);

    // Fetch item types based on selected category and type
    useEffect(() => {
        if (selectedCategory && selectedType) {
            const fetchItemTypes = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models`
                    );
                    setItemTypes(response.data);
                } catch (error) {
                    console.error('Error fetching item types:', error);
                }
            };
            fetchItemTypes();
        }
    }, [selectedCategory, selectedType]);

    // Fetch item brands based on selected category, type, and item type
    useEffect(() => {
        if (selectedCategory && selectedType && selectedItemType) {
            const fetchItemBrands = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedItemType}/brand`);
                    setItemBrands(response.data);
                } catch (error) {
                    console.error('Error fetching item brands:', error);
                }
            };
            fetchItemBrands();
        }
    }, [selectedCategory, selectedType, selectedItemType]);

    // Fetch item names based on selected category, type, item type, and brand
    useEffect(() => {
        if (selectedCategory && selectedType && selectedItemType && selectedItemBrand) {
            const fetchItemNames = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedItemType}/brand/${selectedItemBrand}/name`
                    );
                    setItemNames(response.data);
                } catch (error) {
                    console.error('Error fetching item names:', error);
                }
            };
            fetchItemNames();
        }
    }, [selectedCategory, selectedType, selectedItemType, selectedItemBrand]);

    // Fetch item numbers based on selected item name
    useEffect(() => {
        if (selectedCategory && selectedType && selectedItemType && selectedItemBrand && selectedItemName) {
            const fetchItemNos = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedItemType}/brand/${selectedItemBrand}/name/${selectedItemName}/number`
                    );
                    setItemNos(response.data);
                } catch (error) {
                    console.error('Error fetching item numbers:', error);
                }
            };
            fetchItemNos();
        }
    }, [selectedCategory, selectedType, selectedItemType, selectedItemBrand, selectedItemName]);

    // Fetch item quantity based on selected item number
    useEffect(() => {
        if (
            selectedCategory &&
            selectedType &&
            selectedItemType &&
            selectedItemBrand &&
            selectedItemName &&
            selectedItemNo
        ) {
            const fetchItemQnty = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/api/items/categories/${selectedCategory}/types/${selectedType}/models/${selectedItemType}/brand/${selectedItemBrand}/name/${selectedItemName}/number/${selectedItemNo}/qnty`
                    );
                    setSelectedItemQnty(response.data);
                } catch (error) {
                    console.error('Error fetching item quantity:', error);
                }
            };
            fetchItemQnty();
        }
    }, [
        selectedCategory,
        selectedType,
        selectedItemType,
        selectedItemBrand,
        selectedItemName,
        selectedItemNo,
    ]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setItemDetails((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check quantity limit
        if (selectedItemQnty && selectedItemQnty <= 0) {
            alert('Item quantity has been exhausted. Cannot add more items for this item number.');
            return;
        }

        const formData = new FormData();
        formData.append('itemCategory', selectedCategory);
        formData.append('itemType', selectedType);
        formData.append('itemBrand', selectedItemBrand);
        formData.append('itemName', selectedItemName);
        formData.append('itemNo', selectedItemNo);
        formData.append('itemQuantity', selectedItemQnty);
  
        formData.append('model', selectedItemType);
        formData.append('year', itemDetails.year);
        formData.append('price', itemDetails.price);
        formData.append('priceUnit', itemDetails.priceUnit);
        formData.append('description', itemDetails.description);
        formData.append('features', itemDetails.features);
        formData.append('itemImage', fileInputRef.current?.files[0] || '');

        // Log the form data
        console.log("Form Data being sent:", formData);
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }


        try {
            const response = await axios.post('http://localhost:5000/api/itemtype', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Item added successfully!');
            // Clear form and reset state
        } catch (error) {
            if (error.response?.status === 409) {
                setErrorMessage('A item with the same details already exists.');
            } else {
                setErrorMessage('Error submitting form. Please try again.');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Add Item Details</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-2">{errorMessage}</div>
                )}

                {/* Category Dropdown */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Category</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="border rounded w-full p-2"
                        disabled
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type Dropdown */}
                {selectedCategory && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="border rounded w-full p-2"
                            disabled
                        >
                            <option value="">Select Type</option>
                            {types.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Item Type Dropdown */}
                {selectedType && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Item Type</label>
                        <select
                            value={selectedItemType}
                            onChange={(e) => setSelectedItemType(e.target.value)}
                            className="border rounded w-full p-2"
                        >
                            <option value="">Select Item Type</option>
                            {itemTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Item Brand Dropdown */}
                {selectedItemType && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Brand</label>
                        <select
                            value={selectedItemBrand}
                            onChange={(e) => setSelectedItemBrand(e.target.value)}
                            className="border rounded w-full p-2"
                        >
                            <option value="">Select Brand</option>
                            {itemBrands.map((brand) => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Item Name Dropdown */}
                {selectedItemBrand && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Item Name</label>
                        <select
                            value={selectedItemName}
                            onChange={(e) => setSelectedItemName(e.target.value)}
                            className="border rounded w-full p-2"
                        >
                            <option value="">Select Item Name</option>
                            {itemNames.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Item Number Dropdown */}
                {selectedItemName && (
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Item Number</label>
                        <select
                            value={selectedItemNo}
                            onChange={(e) => setSelectedItemNo(e.target.value)}
                            className="border rounded w-full p-2"
                        >
                            <option value="">Select Item Number</option>
                            {itemNos.map((no) => (
                                <option key={no} value={no}>
                                    {no}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                

                {/* Item Quantity */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Item Quantity</label>
                    <input
                        type="number"
                        value={selectedItemQnty}
                        className="border rounded w-full p-2"
                        readOnly
                    />
                </div>
                {/* Car Details Inputs */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Year</label>
                    <input
                        type="number"
                        name="year"
                        value={itemDetails.year}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        placeholder="Year of Manufacture"
                    />
                </div>


                {/* Price */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={itemDetails.price}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        placeholder="Item Price"
                    />
                </div>

                {/* Price Unit */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Price Unit</label>
                    <select
                        name="priceUnit"
                        value={itemDetails.priceUnit}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                    >
                        <option value="Hundred">Hundred</option>
                        <option value="Thousand">Thousand</option>
                        <option value="Lakh">Lakh</option>
                    </select>
                </div>

                {/* Features */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Features</label>
                    <textarea
                        name="features"
                        value={itemDetails.features}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        placeholder="Item Features"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={itemDetails.description}
                        onChange={handleChange}
                        className="border rounded w-full p-2"
                        placeholder="Item Description"
                    />
                </div>

                {/* Item Image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1">Item Image</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="border rounded w-full p-2"
                    />
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormPage;
