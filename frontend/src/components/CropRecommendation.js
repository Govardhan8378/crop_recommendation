import React, { useState } from "react";

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });
  const [recommendedCrop, setRecommendedCrop] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setRecommendedCrop(data.recommended_crop);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div id="cropRecommendation" className="p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold text-green-600">Crop Recommendation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map((field, index) => (
          <input
            key={index}
            type="number"
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
          className="w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          Recommend Crop
        </button>
      </form>
      {recommendedCrop && (
        <div className="mt-4 text-xl font-semibold text-center text-green-700">
          Recommended Crop: {recommendedCrop}
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
