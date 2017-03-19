  // initialize Firebase
  var config = {
    apiKey: "AIzaSyAlcs8GnbsZWfCQ3qZOheN1cfi_NUFBzSQ",
    authDomain: "train-scheduler-43862.firebaseapp.com",
    databaseURL: "https://train-scheduler-43862.firebaseio.com",
    storageBucket: "train-scheduler-43862.appspot.com",
    messagingSenderId: "452849162460"
  };
  firebase.initializeApp(config);

// delcare intial variables
var database = firebase.database();
var name ='';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';
var keyHolder = '';
var getKey = '';

// start function on page load
$(document).ready(function() {
     // click function for submit button on web app
     $("#add-train").on("click", function() {
     	
     	// grabbing and manipulating the users' input
     	name = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();
          firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          tRemainder = diffTime % frequency;
          minutesTillTrain = frequency - tRemainder;
          nextTrain = moment().add(minutesTillTrain, "minutes");
          nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// pushing user input data to firebase
     	keyHolder = database.ref().push({
     		name: name,
     		destination: destination,
     		firstTrainTime: firstTrainTime,
     		frequency: frequency,
               nextTrainFormatted: nextTrainFormatted,
               minutesTillTrain: minutesTillTrain
     	});

          //
          $('#name-input').val('');
     	$('#destination-input').val('');
     	$('#first-train-time-input').val('');
     	$('#frequency-input').val('');

     	return false;
     });
     // adding the data to the web app
     database.ref().on("child_added", function(childSnapshot) {

		$('.train-schedule').append("<tr>" +
               "<td>" + childSnapshot.val().name +
               "</td>" +
               "<td>" + childSnapshot.val().destination +
               "</td>" +
               "<td>" + childSnapshot.val().frequency +
               "</td>" +
               "<td>" + childSnapshot.val().nextTrainFormatted +
               "</td>" +
               "<td>" + childSnapshot.val().minutesTillTrain +
               "</td>" +
               "</tr>");
// handles the errors
}, function(errorObject){
	console.log("Errors handled: " + errorObject.code)
});

});