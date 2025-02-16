# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

app = Flask(__name__)
CORS(app)

# Load Dataset
data = pd.read_csv('Crop_recommendation.csv')

# Preprocess Data
X = data.drop('label', axis=1)
y = data['label']

# Split Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save Model
with open('crop_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Load Model
with open('crop_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    # Get JSON data
    data = request.json
    features = [
        data['N'], data['P'], data['K'], 
        data['temperature'], data['humidity'], 
        data['ph'], data['rainfall']
    ]
    
    # Convert to NumPy array and reshape
    input_data = np.array(features).reshape(1, -1)
    
    # Predict Crop
    prediction = model.predict(input_data)
    return jsonify({'recommended_crop': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True)
