// frontend/src/components/CropPrice.js

import React, { useState } from 'react';

function CropPrice() {
  const [formData, setFormData] = useState({
    State: '',
    Crop: '',
    CostCultivation: '',
    CostCultivation2: '',
    Production: '',
    Yield: '',
    Temperature: '',
    RainFallAnnual: ''
  });

  const [predictedPrice, setPredictedPrice] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:5000/predict-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setPredictedPrice(data.predicted_price);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-xl">
      <h1 className="mb-4 text-3xl font-bold text-center text-green-600">
        Crop Price Prediction
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((field, index) => (
          <input
            key={index}
            type="text"
            name={field}
            placeholder={field}
            value={formData[field]}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:border-green-500"
            required
          />
        ))}
        <button
          type="submit"
          className="w-full py-3 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
        >
          Predict Price
        </button>
      </form>
      {predictedPrice && (
        <h2 className="mt-4 text-2xl font-semibold text-center text-green-700">
          Predicted Price: ₹{predictedPrice}
        </h2>
      )}
    </div>
  );
}

export default CropPrice;
