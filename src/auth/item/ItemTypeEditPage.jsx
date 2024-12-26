import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap'; // React Bootstrap components

const ItemTypeEditPage = () => {
    const [item, setItem] = useState({
        brand: '',
        model: '',
        itemType: '',
        features: '',
        description: '',
        price: '',
        priceUnit: '',
        itemImage: '',
    
});
    const [loading, setLoading] = useState(true);
    const [imagePreview, setImagePreview] = useState('');
    const { itemTypeId } = useParams();
    const [showDropdown, setShowDropdown] = useState(false); 


    


// To toggle dropdown visibility
    const navigate = useNavigate();

    const handleSelectitemType = (type) => {
        setItem({ ...item, itemType: type });
        setShowDropdown(false); // Close dropdown after selection
    };
  
    useEffect(() => {
        const fetchitem = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/itemtype/${itemTypeId}`
                );
                // setItem(response.data.item);
                setItem(response.data.item);
                // Ensure the itemImage path is correct
                if (response.data.item.itemImage) {
                    setImagePreview(`http://localhost:5000/${response.data.item.itemImage}`);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching item details:', error);
                setLoading(false);
            }
        };
        fetchitem();
    }, [itemTypeId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem((previtem) => ({
            ...previtem,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setItem({ ...item, itemImage: file });
            setImagePreview(URL.createObjectURL(file)); // Create a URL for the selected image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in item) {
            formData.append(key, item[key]);
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/itemtype/${itemTypeId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log('Update Response:', response.data); // Check the response for any issues
            navigate('/adminpage/list');
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-8">
            <h2 className="text-2xl font-bold mb-6">Edit item Details</h2>
            <Form onSubmit={handleSubmit} className="space-y-6">
                {/* Brand */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Item Brand</Form.Label>
                    <Form.Control
                        type="text"
                        name="brand"
                        value={item.itemBrand || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                        readOnly
                    />
                </div>

                {/* Model */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700"> Item Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={item.itemName || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                        readOnly
                    />
                </div>
                {/* Year */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Year</Form.Label>
                    <Form.Control
                        type="number"
                        name="year"
                        value={item.year || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Model Type Dropdown */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Model</Form.Label>
                    <Form.Control
                        type="text"
                        name="model"
                        value={item.model || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                        readOnly
                    />
                </div>
                    

                {/* Features */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Features</Form.Label>
                    <Form.Control
                        type="text"
                        name="features"
                        value={item.features || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                        placeholder="Comma-separated list of features"
                    />
                </div>

                {/* Description */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        name="description"
                        value={item.description || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Price */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Price</Form.Label>
                    <Form.Control
                        type="number"
                        name="price"
                        value={item.price || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                    />
                </div>

                {/* Price Unit */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">Price Unit</Form.Label>
                    <Form.Control
                        type="text"
                        name="priceUnit"
                        value={item.priceUnit || ''}
                        onChange={handleChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                    />
                </div>

                {/* item Image */}
                <div className="mb-4">
                    <Form.Label className="block text-sm font-medium text-gray-700">item Image</Form.Label>
                    <Form.Control
                        type="file"
                        name="itemImage"
                        onChange={handleImageChange}
                        className="mt-2 p-2 w-full border border-gray-300 rounded-lg"
                    />
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="item Preview"
                            className="mt-4 w-32 h-32 object-cover rounded-lg"
                        />
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Update
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default ItemTypeEditPage;
