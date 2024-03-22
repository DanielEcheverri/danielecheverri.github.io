// Initialize Firebase
var firebaseConfig = {
	apiKey: "AIzaSyDWeHUOXcHSp01pLYXY8HQm-l8e7ldqeRA",
	authDomain: "searchingforus.firebaseapp.com",
	databaseURL: "https://searchingforus-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "searchingforus",
	storageBucket: "searchingforus.appspot.com",
	messagingSenderId: "1074186074798",
	appId: "1:1074186074798:web:316b5662099ab3b0e48b3f",
};
firebase.initializeApp(firebaseConfig);

// Reference to your Firebase Realtime Database
var database = firebase.database();

// Variables to be written
var variable_a = "value_a";
var variable_b = "value_b";

// Write variables to the database
database
	.ref("variables")
	.set({
		variable_a: variable_a,
		variable_b: variable_b,
	})
	.then(function () {
		console.log("Variables written to the database successfully!");
	})
	.catch(function (error) {
		console.error("Error writing variables to the database:", error);
	});
