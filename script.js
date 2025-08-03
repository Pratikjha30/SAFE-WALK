let isFlashlightActive = false;
let currentAlarmAudio = null;

function findPoliceStation() {
    const locationResultElem = document.getElementById('locationResult');
    const stationResultElem = document.getElementById('stationResult');

    locationResultElem.textContent = 'Attempting to find your location...';
    stationResultElem.innerHTML = '';

    if (!navigator.geolocation) {
        locationResultElem.textContent = 'Heads up! Geolocation is not supported by your browser. Please update it or try a different one.';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        handleGeolocationSuccess,
        handleGeolocationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function handleGeolocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    document.getElementById("locationResult").textContent =
        `Great! Your Location: Lat ${lat.toFixed(5)}, Lon ${lon.toFixed(5)}`;

    findNearestStation(lat, lon);
}

function handleGeolocationError(err) {
    const locationResultElem = document.getElementById('locationResult');

    switch (err.code) {
        case err.PERMISSION_DENIED:
            locationResultElem.textContent = 'Permission denied! Please enable location access in your browser settings to use this feature.';
            break;
        case err.POSITION_UNAVAILABLE:
            locationResultElem.textContent = 'Location information is unavailable. This might be due to GPS issues or network problems.';
            break;
        case err.TIMEOUT:
            locationResultElem.textContent = 'Request for location timed out. Your device might be having trouble getting a GPS fix.';
            break;
        case err.UNKNOWN_ERROR:
        default:
            locationResultElem.textContent = 'An unknown error occurred while trying to get your location. Please try again.';
            break;
    }
}

const policeStations = [
    { name: "Central Police Station (Simulated)", lat: 22.3146, lon: 87.3106, address: "Near IIT Kharagpur, West Bengal" },
    { name: "Town Police Station (Simulated)", lat: 22.3270, lon: 87.3190, address: "Kharagpur Town, West Bengal" },
    { name: "Hijli Police Station (Simulated)", lat: 22.3450, lon: 87.3000, address: "Hijli, Kharagpur, West Bengal" }
];

function findNearestStation(userLat, userLon) {
    let nearestStation = null;
    let minDistance = Infinity;

    policeStations.forEach(station => {
        const distance = getDistanceHaversine(userLat, userLon, station.lat, station.lon);
        if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
        }
    });

    const distanceInKm = minDistance.toFixed(2);
    const stationResultDiv = document.getElementById("stationResult");

    if (nearestStation) {
        stationResultDiv.innerHTML = `
            <h3>Nearest Help Found:</h3>
            <p><strong>${nearestStation.name}</strong></p>
            <p>${nearestStation.address}</p>
            <p>Approximately: ${distanceInKm} km away</p>
            <p><a href="https://www.google.com/maps/dir/?api=1&destination=${nearestStation.lat},${nearestStation.lon}&travelmode=driving" target="_blank" rel="noopener noreferrer" class="sms-btn">Get Directions on Map</a></p>
        `;
    } else {
        stationResultDiv.textContent = "No police stations found in our dummy data. This feature would be fully functional with a real API!";
    }
}

function getDistanceHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function turnOnFlashlight() {
    let flashlightOverlay = document.querySelector('.flashlight-overlay');

    if (!flashlightOverlay) {
        flashlightOverlay = document.createElement('div');
        flashlightOverlay.className = 'flashlight-overlay';
        document.body.appendChild(flashlightOverlay);

        flashlightOverlay.addEventListener('click', () => {
            turnOnFlashlight();
        });
    }

    flashlightOverlay.classList.toggle('active');
    isFlashlightActive = !isFlashlightActive;

    const flashlightButton = document.querySelector('.tools button:nth-child(1)');
    if (isFlashlightActive) {
        flashlightButton.textContent = '💡 Flashlight (ON)';
        flashlightButton.style.backgroundColor = '#FFD700';
        flashlightButton.style.color = '#333';
    } else {
        flashlightButton.textContent = '🔦 Flashlight';
        flashlightButton.style.backgroundColor = '#e91e63';
        flashlightButton.style.color = 'white';
    }
}

function playAlarm() {
    const alarmButton = document.querySelector('.tools button:nth-child(2)');

    if (currentAlarmAudio && !currentAlarmAudio.paused) {
        currentAlarmAudio.pause();
        currentAlarmAudio.currentTime = 0;
        currentAlarmAudio = null;
        alarmButton.textContent = '🚨 Alarm';
        alarmButton.style.backgroundColor = '#e91e63';
        alarmButton.style.color = 'white';
    } else {
        currentAlarmAudio = new Audio('alarm.mp3');
        currentAlarmAudio.loop = true;
        currentAlarmAudio.volume = 1.0;

        const playPromise = currentAlarmAudio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                alarmButton.textContent = '🛑 Stop Alarm';
                alarmButton.style.backgroundColor = '#DC3545';
                alarmButton.style.color = 'white';
            }).catch(error => {
                alert("The alarm could not start automatically. Your browser might require a user interaction (like a click) before playing audio.");
                alarmButton.textContent = '🚨 Alarm (Click to Start)';
                alarmButton.style.backgroundColor = '#e91e63';
                currentAlarmAudio = null;
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

});