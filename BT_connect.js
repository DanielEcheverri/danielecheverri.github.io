//Script for pairing with Avatar BT
let characteristic;
let isConnected = false; // Track connection state
let device; // Declare device variable
var message;
async function connectToDevice() {
	try {
		if (!isConnected) {
			// Request Bluetooth device
			device = await navigator.bluetooth.requestDevice({
				filters: [{ services: ["6e400001-b5a3-f393-e0a9-e50e24dcca9e"] }],
			});
			// Connect to the selected device
			const server = await device.gatt.connect();
			// Get UART service
			const service = await server.getPrimaryService("6e400001-b5a3-f393-e0a9-e50e24dcca9e");
			// Get UART characteristic
			characteristic = await service.getCharacteristic("6e400003-b5a3-f393-e0a9-e50e24dcca9e");
			// Start notifications for the characteristic
			await characteristic.startNotifications();
			// Listen for characteristic value changes
			characteristic.addEventListener("characteristicvaluechanged", handleCharacteristicValueChanged);
			// Update UI
			document.getElementById("connectButton").textContent = "Disconnect Avatar";
			isConnected = true;
			displayText("On a ${weatherDescription}${timeOfDay}, the avatar became online around ${name} street.");
			setTimeout(function () {
				startDetectMovement = true;
			}, 4000);
		} else {
			// Disconnect from the device
			await characteristic.stopNotifications();
			await device.gatt.disconnect();
			isConnected = false;
			document.getElementById("connectButton").textContent = "Connect to Avatar";
			// Set all potValues to 0

			displayText("Around ${name} street, the avatar became offline.");
			setTimeout(function () {
				startDetectMovement = false;
				potValues = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			}, 4000);
		}
	} catch (error) {
		console.error("Error connecting/disconnecting: " + error);
	}
}
// Attach click event listener to button.
document.getElementById("connectButton").addEventListener("click", connectToDevice);
// Function to handle incoming data from UART
function handleCharacteristicValueChanged(event) {
	const value = event.target.value;
	// Convert the received data to a string
	const textDecoder = new TextDecoder();
	const decodedValue = textDecoder.decode(value);
	// Pass the received data to Processing sketch
	receiveData(decodedValue);
}
// Function to receive data from JavaScript
function receiveData(data) {
	if (window.receiveDataFromSerial) {
		window.receiveDataFromSerial(data);
	} else {
		console.error("Processing sketch not initialized.");
	}
}
