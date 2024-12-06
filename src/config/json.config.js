const fs = require('fs');
const path = require('path');

// Path to the JSON file
const jsonFilePath = path.resolve('./src/constData/data.json');

// In-memory store for JSON data
let jsonData = {};

// Function to read data from the JSON file
function loadDataFromFile() {
    try {
        if (fs.existsSync(jsonFilePath)) {
            const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
            console.log("Data loaded successfully.")
            jsonData = JSON.parse(rawData);
            console.log(jsonData,"sdsd")
        } else {
            jsonData = {}; // Initialize as empty if the file doesn't exist
        }
    } catch (error) {
        console.error('Error loading data from file:', error.message);
        jsonData = {}; // Initialize as empty if an error occurs
    }
}

// Function to save data to the JSON file
function saveDataToFile() {
    try {
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf-8');
        console.log('Data saved successfully to the file.');
    } catch (error) {
        console.error('Error saving data to file:', error.message);
    }
}

// Function to get data
function getData() {
    return jsonData;
}

// Function to update or create data
function updateData(key, value) {
    jsonData[key] = value;
}

module.exports ={
    loadDataFromFile,
    saveDataToFile,
    updateData,
    getData,
}
