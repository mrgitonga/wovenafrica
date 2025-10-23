const fs = require('fs');
const path = require('path');

console.log("Starting geo data pre-processing...");

const csvPath = path.resolve(__dirname, '../csv-Kenya-Counties-Constituencies-Wards.csv');
const outputPath = path.resolve(__dirname, '../src/data/kenya-geo.json');

// Create the output directory if it doesn't exist
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const fileContent = fs.readFileSync(csvPath, 'utf8');
const lines = fileContent.trim().split('\n');
const geoData = {};

// Start from the second line to skip the header
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  // Use a regex to handle potential commas within names, though this data seems clean
  const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

  // Clean up column names from the CSV if they have extra characters
  const countyName = parts[1]?.trim().toUpperCase();
  const constituencyName = parts[3]?.trim().toUpperCase();
  const wardName = parts[5]?.trim(); // Keep original case for wards

  if (!countyName || !constituencyName || !wardName) continue;

  if (!geoData[countyName]) {
    geoData[countyName] = {};
  }
  if (!geoData[countyName][constituencyName]) {
    geoData[countyName][constituencyName] = [];
  }
  if (!geoData[countyName][constituencyName].includes(wardName)) {
    geoData[countyName][constituencyName].push(wardName);
  }
}

// Sort wards within each constituency
for (const county in geoData) {
    for (const constituency in geoData[county]) {
        geoData[county][constituency].sort();
    }
}

fs.writeFileSync(outputPath, JSON.stringify(geoData, null, 2));

console.log(`✅ Geo data successfully processed and saved to ${outputPath}`);