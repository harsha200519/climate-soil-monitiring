const apiKey = '3L7RU39YN2203CC1'; // ThingSpeak API Key
const channelID = '2768473'; // ThingSpeak Channel ID

// Variables for graph data
let temperatureData = [];
let humidityData = [];
let soilMoistureData = [];
let timestamps = [];

// Fetch real-time data
async function fetchData() {
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=1`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.feeds && data.feeds.length > 0) {
            const latestFeed = data.feeds[0];
            document.getElementById('temperature').textContent = latestFeed.field1 + ' °C';
            document.getElementById('humidity').textContent = latestFeed.field2 + ' %';
            document.getElementById('soil-moisture').textContent = latestFeed.field3 + ' %';
        }
    } catch (error) {
        console.error('Error fetching real-time data:', error);
    }
}

// Fetch graph data
async function fetchGraphData() {
    const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${apiKey}&results=10`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.feeds) {
            // Reset data
            temperatureData = [];
            humidityData = [];
            soilMoistureData = [];
            timestamps = [];

            data.feeds.forEach(feed => {
                temperatureData.push(parseFloat(feed.field1));
                humidityData.push(parseFloat(feed.field2));
                soilMoistureData.push(parseFloat(feed.field3));
                timestamps.push(new Date(feed.created_at).toLocaleTimeString());
            });

            updateGraphs();
        }
    } catch (error) {
        console.error('Error fetching graph data:', error);
    }
}

// Save data (mock functionality)
function saveData() {
    const confirmation = document.getElementById('save-confirmation');
    confirmation.style.display = 'block';

    setTimeout(() => {
        confirmation.style.display = 'none';
    }, 3000);
}

// Initialize graphs
const temperatureChart = new Chart(document.getElementById('temperatureGraph'), {
    type: 'line',
    data: {
        labels: timestamps,
        datasets: [{
            label: 'Temperature (°C)',
            data: temperatureData,
            borderColor: '#ff5722',
            backgroundColor: 'rgba(255,87,34,0.2)',
            borderWidth: 2
        }]
    }
});

const humidityChart = new Chart(document.getElementById('humidityGraph'), {
    type: 'line',
    data: {
        labels: timestamps,
        datasets: [{
            label: 'Humidity (%)',
            data: humidityData,
            borderColor: '#03a9f4',
            backgroundColor: 'rgba(3,169,244,0.2)',
            borderWidth: 2
        }]
    }
});

const soilMoistureChart = new Chart(document.getElementById('soilMoistureGraph'), {
    type: 'line',
    data: {
        labels: timestamps,
        datasets: [{
            label: 'Soil Moisture (%)',
            data: soilMoistureData,
            borderColor: '#4caf50',
            backgroundColor: 'rgba(76,175,80,0.2)',
            borderWidth: 2
        }]
    }
});

// Update graphs with fetched data
function updateGraphs() {
    temperatureChart.data.labels = timestamps;
    temperatureChart.data.datasets[0].data = temperatureData;
    temperatureChart.update();

    humidityChart.data.labels = timestamps;
    humidityChart.data.datasets[0].data = humidityData;
    humidityChart.update();

    soilMoistureChart.data.labels = timestamps;
    soilMoistureChart.data.datasets[0].data = soilMoistureData;
    soilMoistureChart.update();
}

// Event Listeners
document.getElementById('refresh-data').addEventListener('click', fetchData);
document.getElementById('save-data').addEventListener('click', saveData);

// Fetch data
fetchData();
fetchGraphData();
setInterval(fetchGraphData, 60000);