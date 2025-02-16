import React, { useState, useEffect } from "react";
import "./App.css";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-10 w-full bg-white shadow-md">
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        <h1 className="text-2xl font-bold text-green-600">Crop Advisor</h1>
        <ul className="flex space-x-6">
          <li>
            <a href="#cropRecommendation" className="text-gray-600 hover:text-green-600">
              Crop Recommendation
            </a>
          </li>
          <li>
            <a href="#history" className="text-gray-600 hover:text-green-600">
              History
            </a>
          </li>
          <li>
            <a href="#marketPrice" className="text-gray-600 hover:text-green-600">
              Market Price
            </a>
          </li>
          <li>
            <a href="#fertilizerRecommendation" className="text-gray-600 hover:text-green-600">
              Fertilizer Recommendation
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

function App() {
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
  const [translatedText, setTranslatedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("hi");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [cropImage, setCropImage] = useState("");

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("cropHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("cropHistory", JSON.stringify(history));
  }, [history]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInput = () => {
    const { N, P, K, temperature, humidity, ph, rainfall } = formData;
    if (
      N < 0 || P < 0 || K < 0 ||
      temperature < -50 || temperature > 60 ||
      humidity < 0 || humidity > 100 ||
      ph < 0 || ph > 14 ||
      rainfall < 0
    ) {
      setErrorMessage("Please enter valid input values.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setIsLoading(true);
    setRecommendedCrop(""); 
    setTranslatedText("");
    setCropImage("");
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

      const imageUrl = `/images/${data.recommended_crop.toLowerCase()}.jpg`;
      setCropImage(imageUrl);

      const newEntry = {
        input: { ...formData },
        result: data.recommended_crop,
        image: imageUrl,
        date: new Date().toLocaleString(),
      };
      setHistory([newEntry, ...history]);
    } catch (error) {
      console.error("Error:", error);
      setRecommendedCrop("Error fetching recommendation");
    }
    setIsLoading(false);
  };

  const handleTranslate = async () => {
    if (!recommendedCrop) return;
    try {
      const response = await fetch("https://libretranslate.de/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: recommendedCrop,
          source: "en",
          target: selectedLanguage,
          format: "text",
        }),
      });
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error("Translation Error:", error);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cropHistory");
  };

  return (
    <div className="bg-green-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-28">
        <div id="cropRecommendation" className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl">
          <h1 className="mb-4 text-3xl font-bold text-center text-green-600">
            Crop Recommendation System
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map(
              (field, index) => (
                <div key={index} className="w-full">
                  <label className="block mb-1 text-sm font-semibold text-gray-600">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="number"
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              )
            )}
            <button
              type="submit"
              className="w-full py-3 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Recommend Crop"}
            </button>
          </form>
        </div>

        {recommendedCrop && (
          <div className="w-full max-w-3xl p-8 mt-8 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-center text-green-600">Recommended Crop</h2>
            <p className="text-center text-gray-700">{recommendedCrop}</p>
            {cropImage && (
              <img src={cropImage} alt={recommendedCrop} className="w-48 h-48 mx-auto mt-4 rounded-lg" />
            )}
           
          </div>
        )}

        {history.length > 0 && (
          <div id="history" className="w-full max-w-3xl p-8 mt-8 bg-white rounded-lg shadow-xl">
            <h2 className="mb-4 text-2xl font-bold text-center text-green-600">Recommendation History</h2>
            <ul className="space-y-4">
              {history.map((entry, index) => (
                <li key={index} className="p-4 bg-gray-100 rounded-lg shadow">
                  <p className="font-semibold">Input:</p>
                  <ul className="pl-4">
                    {Object.entries(entry.input).map(([key, value]) => (
                      <li key={key}>
                        {key}: {value}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2">
                    <span className="font-semibold">Recommended Crop:</span> {entry.result}
                  </p>
                  {entry.image && (
                    <img src={entry.image} alt={entry.result} className="w-24 h-24 mt-2 rounded-lg" />
                  )}
                  <p className="text-gray-500">Date: {entry.date}</p>
                </li>
              ))}
            </ul>
            <button onClick={clearHistory} className="px-4 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700">
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;
