var latitude;
var longitude;
function getCurrentLocation() {
	if (navigator.geolocation) {
		const options = {
			enableHighAccuracy: true,
		};
		let previousPosition = null;
		let totalDistance = 0;
		navigator.geolocation.watchPosition(
			function (position) {
				latitude = position.coords.latitude; // Store latitude globally
				longitude = position.coords.longitude; // Store longitude globally
				const speedThreshold = 0.5; // Threshold for considering the user as significantly moving (in meters per second)
				let speed = position.coords.speed || 0; // Speed in meters per second
				// Reset total distance if speed is less than threshold
				if (speed < speedThreshold) {
					totalDistance = 0;
				} else if (previousPosition) {
					const distance = calculateDistance(
						previousPosition.coords.latitude,
						previousPosition.coords.longitude,
						position.coords.latitude,
						position.coords.longitude
					);
					totalDistance += distance;
				}
				previousPosition = position;
				let heading = position.coords.heading || 0; // Heading in degrees
				// Determine direction text based on heading
				let directionText;
				if (speed >= speedThreshold) {
					if (heading >= 337.5 || heading < 22.5) {
						directionText = "Heading North";
					} else if (heading >= 22.5 && heading < 67.5) {
						directionText = "Heading Northeast";
					} else if (heading >= 67.5 && heading < 112.5) {
						directionText = "Heading East";
					} else if (heading >= 112.5 && heading < 157.5) {
						directionText = "Heading Southeast";
					} else if (heading >= 157.5 && heading < 202.5) {
						directionText = "Heading South";
					} else if (heading >= 202.5 && heading < 247.5) {
						directionText = "Heading Southwest";
					} else if (heading >= 247.5 && heading < 292.5) {
						directionText = "Heading West";
					} else if (heading >= 292.5 && heading < 337.5) {
						directionText = "Heading Northwest";
					}
				} else {
					directionText = "Not moving";
				}
				// Update the HTML element with the direction and distance walked
				document.getElementById("currentLocation").textContent =
					"Direction: " + directionText + ", Speed: " + speed.toFixed(2) + " m/s, Total Distance Walked: " + totalDistance.toFixed(2) + " meters";
			},
			function (error) {
				console.error("Error getting current location: ", error);
			},
			options
		);
	} else {
		console.error("Geolocation is not supported by this browser.");
	}
}
// Function to calculate the distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
	const earthRadius = 6371e3; // Earth radius in meters
	const phi1 = (lat1 * Math.PI) / 180; // Latitude in radians
	const phi2 = (lat2 * Math.PI) / 180; // Latitude in radians
	const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
	const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
	const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = earthRadius * c; // Distance in meters
	return distance;
}
getCurrentLocation();
async function findClosestShop() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async function (position) {
			const { latitude, longitude } = position.coords;
			const radius = 5; // Change this value to adjust the radius
			const apiURL = `https://overpass-api.de/api/interpreter?data=[out:json];node[shop](around:${radius},${latitude},${longitude});out;`;
			try {
				const response = await fetch(apiURL);
				const data = await response.json();
				if (data.elements.length > 0) {
					const closestShop = data.elements[0].tags.name;
					const shopLocation = [data.elements[0].lat, data.elements[0].lon];
					const distance = calculateDistance(latitude, longitude, shopLocation[0], shopLocation[1]);
					document.getElementById("closestShop").innerHTML = `Closest Shop: ${closestShop} Distance: ${distance.toFixed(2)} meters`;
				} else {
					document.getElementById("closestShop").innerHTML = `No shops found within ${radius} meters.`;
				}
			} catch (error) {
				console.error("Error finding closest shop:", error);
				document.getElementById("closestShop").innerHTML = "Error finding closest shop.";
			}
		});
	} else {
		document.getElementById("closestShop").innerHTML = "Geolocation is not supported by this browser.";
	}
}
function calculateDistance(lat1, lon1, lat2, lon2) {
	var R = 6371e3; // metres
	var φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
	var φ2 = (lat2 * Math.PI) / 180;
	var Δφ = ((lat2 - lat1) * Math.PI) / 180;
	var Δλ = ((lon2 - lon1) * Math.PI) / 180;
	var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // in metres
	return d;
}
