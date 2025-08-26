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

    // Update SMS link with original message + location
    const smsLink = document.getElementById("smsLink");
    const message = `HELP! I’m being harassed near my location. Please send help.\nMy location: https://maps.google.com/?q=${lat},${lon}`;
    smsLink.setAttribute("href", `sms:100?body=${encodeURIComponent(message)}`);
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

async function findNearestStation(lat, lon) {
    const stationResultDiv = document.getElementById("stationResult");

    try {
        const query = `https://nominatim.openstreetmap.org/search?format=json&q=police station&limit=5&bounded=1&viewbox=${lon - 0.05},${lat + 0.05},${lon + 0.05},${lat - 0.05}`;

        const response = await fetch(query, {
            headers: {
                'Accept-Language': 'en' // ensures response is in English
            }
        });
        const data = await response.json();

        if (data.length > 0) {
            const nearest = data[0];
            stationResultDiv.innerHTML = `
                <h3>Nearest Police Station (Live Search):</h3>
                <p><strong>${nearest.display_name}</strong></p>
                <p>Coordinates: ${nearest.lat}, ${nearest.lon}</p>
                <p>
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}" 
                    target="_blank" class="sms-btn">
                        📍 Get Directions
                    </a>
                </p>
            `;
        } else {
            stationResultDiv.textContent = "❌ No police stations found nearby. Try again later or zoom out range.";
        }
    } catch (err) {
        stationResultDiv.textContent = "⚠️ Error while contacting Nominatim API.";
        console.error(err);
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

let alarmAudio = null;
let isAlarmPlaying = false;

function playAlarm() {
  if (!isAlarmPlaying) {
    alarmAudio = new Audio('alarm.mp3');
    alarmAudio.loop = true; // optional: make it loop like a real alarm
    alarmAudio.play();
    isAlarmPlaying = true;
  } else {
    alarmAudio.pause();
    alarmAudio.currentTime = 0;
    isAlarmPlaying = false;
  }
}
