// Processing 4 sketch to visualize movements of the Avatar
let numPotentiometers = 8;
let potValues;
let lineColors;
let backgroundColors;
let labels = ["LEFT SHOULDER", "LEFT FOREARM", "HEAD", "RIGHT SHOULDER", "RIGHT FOREARM", "WAIST", "LEFT LEG", "RIGHT LEG"];
let isMovingUp = false;
let isMovingDown = false;
var previousPotValues = new Array(numPotentiometers);
const cooldownDuration = 500; // 1 second
let detectMovement = true;
let startDetectMovement = false;
let tagID;

function setup() {
	var avatarBTCanvas = createCanvas(windowWidth, windowHeight * 0.6);
	avatarBTCanvas.parent("avatarBTdiv");
	potValues = [0, 0, 0, 0, 0, 0, 0, 0]; // Initialize potValues array with default values
	lineColors = new Array(numPotentiometers);
	backgroundColors = new Array(numPotentiometers);
	setupColors();
	setupBackgroundColors();
}
function draw() {
	background(255);
	let lineHeight = height / numPotentiometers;
	let labelSize = min(width, height) * 0.03; // Responsive font size for labels
	for (let i = 0; i < numPotentiometers; i++) {
		let lineY = i * lineHeight + lineHeight / 2;
		// Draw the background rectangle
		noStroke();
		fill(backgroundColors[i]);
		rect(0, i * lineHeight, width, lineHeight);
		// Draw the line with different color for each
		strokeWeight(50);
		stroke(lineColors[i]);
		line(0, lineY, map(potValues[i], 0, 4095, 0, width * 0.55), lineY);
		// Display the corresponding value to the left of the line
		noStroke();
		fill(255);
		textFont("Roboto");
		textAlign(RIGHT, CENTER);
		textSize(labelSize);
		text(int(potValues[i]), map(potValues[i], 0, 4095, 0, width * 0.55) - 10, lineY);
	}
	// Draw vertical labels on the right side
	textAlign(RIGHT, CENTER);
	let labelFontSize = min(width, height) * 0.03; // Responsive font size for labels
	textFont("Roboto");
	textSize(labelFontSize);
	fill(255); // Set text color to white
	for (let i = 0; i < numPotentiometers; i++) {
		text(labels[i], width * 0.9, i * lineHeight + lineHeight / 2);
	}
	// Detect movement and display corresponding text
	if (startDetectMovement) {
		checkMovement();
	}
}
// Function to receive data from JavaScript
function receiveData(data) {
	let values = data.split(",");
	tagID = values.pop(); // Remove and store the last element as tagID
	readTag();
	if (values.length === numPotentiometers) {
		// Check if the length of values is 8
		for (let i = 0; i < values.length; i++) {
			potValues[i] = parseFloat(values[i]);
		}
	}
}

function checkMovement() {
	// Define thresholds for movement detection
	let movementThreshold = 10;
	// Variables to track movement of the head, left leg, right leg, left shoulder, right shoulder, left forearm, right forearm, and waist
	let headMovingUp = null;
	let leftLegMovingUp = null;
	let rightLegMovingUp = null;
	let leftShoulderMovingUp = null;
	let rightShoulderMovingUp = null;
	let leftForearmMovingUp = null;
	let rightForearmMovingUp = null;
	let waistMoving = null;
	let bodyMoving = null;
	if (!detectMovement) {
		return;
	}
	// Check movement for each potentiometer
	for (let i = 0; i < numPotentiometers; i++) {
		// Check movement based on potentiometer position and its corresponding label
		if (labels[i] == "HEAD") {
			// Movement detection for head (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				headMovingUp = true; // Head is moving up
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				headMovingUp = false; // Head is moving down
			}
		} else if (labels[i] == "LEFT LEG") {
			// Movement detection for left leg (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				leftLegMovingUp = false; // Left leg is moving down
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				leftLegMovingUp = true; // Left leg is moving up
			}
		} else if (labels[i] == "RIGHT LEG") {
			// Movement detection for right leg (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				rightLegMovingUp = false; // Right leg is moving down
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				rightLegMovingUp = true; // Right leg is moving up
			}
		} else if (labels[i] == "LEFT SHOULDER") {
			// Movement detection for left shoulder (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				leftShoulderMovingUp = false; // Left shoulder is moving up
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				leftShoulderMovingUp = true; // Left shoulder is moving down
			}
		} else if (labels[i] == "RIGHT SHOULDER") {
			// Movement detection for right shoulder (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				rightShoulderMovingUp = false; // Right shoulder is moving up
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				rightShoulderMovingUp = true; // Right shoulder is moving down
			}
		} else if (labels[i] == "LEFT FOREARM") {
			// Movement detection for left forearm (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				leftForearmMovingUp = true; // Left forearm is moving up
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				leftForearmMovingUp = false; // Left forearm is moving down
			}
		} else if (labels[i] == "RIGHT FOREARM") {
			// Movement detection for right forearm (up and down movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				rightForearmMovingUp = true; // Right forearm is moving up
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				rightForearmMovingUp = false; // Right forearm is moving down
			}
		} else if (labels[i] == "WAIST") {
			// Movement detection for waist (left and right movement)
			if (potValues[i] < previousPotValues[i] - movementThreshold) {
				waistMoving = false; // Waist is moving left
			} else if (potValues[i] > previousPotValues[i] + movementThreshold) {
				waistMoving = true; // Waist is moving right
			}
		}
	}
	// Displaying movement text based on detected head movement
	if (headMovingUp != null) {
		if (headMovingUp) {
			displayText("head is moving up");
		} else {
			displayText("head is moving down");
		}
	}
	// Displaying movement text based on detected left leg movement
	if (
		leftLegMovingUp != null &&
		waistMoving == null &&
		rightLegMovingUp == null &&
		leftShoulderMovingUp == null &&
		leftForearmMovingUp == null &&
		rightShoulderMovingUp == null &&
		rightForearmMovingUp == null
	) {
		if (leftLegMovingUp) {
			displayText("left leg is moving up");
		} else {
			displayText("left leg is moving down");
		}
	}
	// Displaying movement text based on detected right leg movement
	if (
		rightLegMovingUp != null &&
		waistMoving == null &&
		leftLegMovingUp == null &&
		leftShoulderMovingUp == null &&
		leftForearmMovingUp == null &&
		rightShoulderMovingUp == null &&
		rightForearmMovingUp == null
	) {
		if (rightLegMovingUp) {
			displayText("right leg is moving up");
		} else {
			displayText("right leg is moving down");
		}
	}
	// Displaying movement text based on detected left arm movement
	if (leftShoulderMovingUp != null && leftForearmMovingUp != null && leftLegMovingUp == null && rightLegMovingUp == null) {
		if (leftShoulderMovingUp && leftForearmMovingUp) {
			displayText("left arm is moving up");
		}
		if (!leftShoulderMovingUp && !leftForearmMovingUp) {
			displayText("left arm is moving down");
		}
	}
	// Displaying movement text based on detected right arm movement
	if (rightShoulderMovingUp != null && rightForearmMovingUp != null && leftLegMovingUp == null && rightLegMovingUp == null) {
		if (rightShoulderMovingUp && !rightForearmMovingUp) {
			displayText("right arm is moving up");
		}
		if (!rightShoulderMovingUp && rightForearmMovingUp) {
			displayText("right arm is moving down");
		}
	}
	// Displaying movement text based on detected waist movement
	if (waistMoving != null && rightLegMovingUp != null && leftLegMovingUp != null) {
		if (waistMoving) {
			displayText("waist is moving right");
			detectMovement = false;
			setTimeout(() => {
				detectMovement = true;
			}, cooldownDuration);
		} else {
			displayText("waist is moving left");
			detectMovement = false;
			setTimeout(() => {
				detectMovement = true;
			}, cooldownDuration);
		}
	}
	// Displaying body movement based on shoulders and legs
	if (leftShoulderMovingUp != null && rightShoulderMovingUp != null && leftLegMovingUp != null && rightLegMovingUp != null) {
		if (leftShoulderMovingUp && rightShoulderMovingUp && leftLegMovingUp && rightLegMovingUp) {
			bodyMoving = true; // Body is moving up
		} else if (!leftShoulderMovingUp && !rightShoulderMovingUp && !leftLegMovingUp && !rightLegMovingUp) {
			bodyMoving = false; // Body is moving down
		} else {
			bodyMoving = null; // Body movement cannot be determined
		}
	} else {
		bodyMoving = null; // Body movement cannot be determined
	}
	// Displaying movement text based on detected body movement
	if (bodyMoving != null) {
		if (bodyMoving) {
			detectMovement = false;
			setTimeout(() => {
				detectMovement = true;
			}, cooldownDuration);
			displayText("body is moving down");
		} else {
			detectMovement = false;
			setTimeout(() => {
				detectMovement = true;
			}, cooldownDuration);
			displayText("body is moving up");
		}
	}
	// Update previous potentiometer values for the next iteration
	previousPotValues = potValues.slice(0, numPotentiometers);
}
var streetName;
// Function to fetch city name using Overpass API
function fetchStreetName() {
	return new Promise((resolve, reject) => {
		const checkCoordinates = () => {
			if (typeof latitude !== "undefined" && typeof longitude !== "undefined" && latitude !== 0 && longitude !== 0) {
				resolve();
			} else {
				setTimeout(checkCoordinates, 100); // Check again after 100 milliseconds
			}
		};
		checkCoordinates();
		// Log the street promise to the console
		console.log("Fetching street data...");
	})
		.then(() => {
			// Construct Overpass API query
			var overpassQuery = "https://overpass-api.de/api/interpreter?data=[out:json];node(around:50," + latitude + "," + longitude + ");out;";
			// Fetch data from Overpass API
			return fetch(overpassQuery);
		})
		.then((response) => response.json())
		.then((data) => {
			// Loop through elements to find 'addr:street' property
			for (let i = 0; i < data.elements.length; i++) {
				const element = data.elements[i];
				if (element.tags && element.tags["addr:street"]) {
					console.log("Street name:", element.tags["addr:street"]);
					return element.tags["addr:street"]; // Found, return street name
				}
			}
			// If 'addr:street' is not found in any element, throw an error
			throw new Error("Street name not found");
		})
		.catch((error) => {
			//console.error("Error fetching street name:", error);
			return "an unknown";
		});
}
var timeoutID; // Variable to hold the timeout ID.
var previousMessage = ""; // Variable to store the previous message
var previousLatitude;
var previousLongitude;
var timeOfDay = getTimeOfDay();

// Function to display a composed message
function displayText(message) {
	// Target the existing <div> element with the id "gestureDiv"
	var gestureDiv = document.getElementById("gestureDiv");
	var fullMessage = message;

	// Clear existing timeout
	clearTimeout(timeoutID);

	// Check if the message contains ${name}
	var includeName = message.includes("${name}");

	// Check if latitude or longitude has changed
	if ((latitude !== previousLatitude || longitude !== previousLongitude) && includeName) {
		// Update previous latitude and longitude
		previousLatitude = latitude;
		previousLongitude = longitude;
		console.log("new position");

		// Call fetchStreetName and wait for it to resolve
		fetchStreetName().then((name) => {
			// Compose the full message with fetched name
			fullMessage = composeMessage(message, weatherDescription, timeOfDay, name);
			updateDisplay(fullMessage);
			streetName = name;
		});
	} else {
		// Compose the full message using the existing streetName value
		fullMessage = composeMessage(message, weatherDescription, timeOfDay, streetName);
		updateDisplay(fullMessage);
	}

	// Update display
	function updateDisplay(fullMessage) {
		// Set the text content
		gestureDiv.textContent = fullMessage;
		speakMessage(fullMessage);

		// Check if message is not empty to show the overlay
		gestureDiv.style.display = message.trim() !== "" ? "block" : "none";

		// Set a timeout to clear the text after 3 seconds if there's no change
		timeoutID = setTimeout(function () {
			gestureDiv.textContent = ""; // Clear the text
			gestureDiv.style.display = "none"; // Hide the overlay after clearing the text
		}, 3000);
	}
}

// Function to compose the message
function composeMessage(template, weatherDescription, timeOfDay, name) {
	let fullMessage = template
		.replace(/\$\{weatherDescription\}/g, weatherDescription)
		.replace(/\$\{timeOfDay\}/g, timeOfDay)
		.replace(/\$\{name\}/g, name);
	return fullMessage;
}

// Variable to store the last spoken message
let lastSpokenMessage = "";
let speaking = false;

function speakMessage(fullMessage) {
	// Check if the message is the same as the last spoken message
	if (fullMessage === lastSpokenMessage) {
		console.log("Message already spoken.");
		return; // Exit the function without speaking again
	}

	// Check if currently speaking
	if (speaking) {
		console.log("Already speaking, new message ignored.");
		return;
	}
	speaking = true;
	// Create a new instance of SpeechSynthesisUtterance
	const utterance = new SpeechSynthesisUtterance(fullMessage);
	// Filter available voices to find Karen's voice in Australian English
	const karenVoice = speechSynthesis.getVoices().find((voice) => voice.name === "Karen" && voice.lang === "en-AU");
	// Set the voice to Karen's voice if found, otherwise use the default voice
	utterance.voice = karenVoice || speechSynthesis.getVoices()[0];
	// Speak the message
	speechSynthesis.speak(utterance);
	utterance.onend = function () {
		speaking = false;
	};

	// Update the last spoken message
	lastSpokenMessage = fullMessage;
}

let weatherDescription = null;
// Define fetchWeather function
function fetchWeather() {
	// Define a promise to fetch weather description
	const weatherPromise = new Promise((resolve, reject) => {
		const checkCoordinates = () => {
			if (typeof latitude !== "undefined" && typeof longitude !== "undefined" && latitude !== 0 && longitude !== 0) {
				resolve();
			} else {
				setTimeout(checkCoordinates, 100); // Check again after 100 milliseconds
			}
		};
		checkCoordinates();
	})
		.then(() => {
			const apiKey = "21b99074efb73ba35f476f78f1b018ec";
			const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
			// Fetch data from OpenWeather API
			return fetch(apiUrl);
		})
		.then((response) => {
			if (!response.ok) {
				throw new Error("Failed to fetch weather data");
			}
			return response.json();
		})
		.then((data) => {
			// Extract the weather description and store it globally
			weatherDescription = data.weather[0].description;
			return weatherDescription;
		})
		.catch((error) => {
			console.error("Error fetching weather data:", error);
			throw error; // Rethrow the error to be caught by the caller if needed
		});

	// Log the weather promise to the console
	console.log("Fetching weather data...");

	// Use the weather promise elsewhere in your code if needed
	weatherPromise.then((weatherDescription) => {
		console.log("Weather description:", weatherDescription);
	});

	// Return the weather promise
	return weatherPromise;
}
fetchWeather();

// Function to determine if it's day or night
function getTimeOfDay() {
	var currentTime = new Date().getHours();
	return currentTime > 6 && currentTime < 18 ? "-kind of day" : "-kind of night"; // Assuming day is from 6 AM to 6 PM
}

function readTag() {
	if (tagID === "12") {
		displayText("After some time walking up and down ${name} street, the day turned blue.");
	}
}

function setupColors() {
	lineColors[0] = color(204, 204, 0); // Dark Yellow
	lineColors[1] = color(204, 204, 0); // Dark Yellow
	lineColors[2] = color(255, 0, 0); // Red
	lineColors[3] = color(204, 204, 0); // Dark Yellow
	lineColors[4] = color(204, 204, 0); // Dark Yellow
	lineColors[5] = color(0, 255, 0); // Bright Green
	lineColors[6] = color(0, 128, 0); // Grass Green
	lineColors[7] = color(0, 128, 0); // Grass Green
}
function setupBackgroundColors() {
	backgroundColors[0] = color(0, 0, 0); // 0% black
	backgroundColors[1] = color(0, 0, 0); // 0% black
	backgroundColors[2] = color(0, 0, 0, 200); // 90% black
	backgroundColors[3] = color(0, 0, 0, 230); // 75% black
	backgroundColors[4] = color(0, 0, 0, 230); // 60% black
	backgroundColors[5] = color(0, 0, 0, 128); // 60% black
	backgroundColors[6] = color(0, 0, 0, 100); // 60% black
	backgroundColors[7] = color(0, 0, 0, 100); // 60% black
}
