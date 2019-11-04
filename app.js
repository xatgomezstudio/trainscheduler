//FIREBASE

$(document).ready(function () {
  ////////////////////////////////////////////////////////////////
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDkPBJGDhVr2feQilQT8GDp3SK3IEFHijg",
    authDomain: "train-scheduler-d9a88.firebaseapp.com",
    databaseURL: "https://train-scheduler-d9a88.firebaseio.com",
    projectId: "train-scheduler-d9a88",
    storageBucket: "train-scheduler-d9a88.appspot.com",
    messagingSenderId: "182827452930",
    appId: "1:182827452930:web:8b8136ac623a907a40351b",
    measurementId: "G-BCYR2YZFN0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Get a reference to the database service
  var database = firebase.database();


  //INPUT
  ////////////////////////////////////////////////////////////////
  // global variables
  // var name = "";
  // var destination = "";
  // var nextArrival = "";
  // var frequency = "";
  // var minutesAway = "";

  $("#submit").on("click", function (event) {
    event.preventDefault();

    //variables
    var trainName = $("#name").val().trim();
    var destination = $("#destination").val().trim();
    var nextArrival = $("#next-arrival").val().trim();
    var frequency = $("#frequency").val().trim();
    var minutesAway = $("#minutes-away").val().trim();
    initiateTime = moment().format("HH:mm");

    // Uploads train data to the database
    database.ref().push({
      name: trainName,
      time: initiateTime,
      destination: destination,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // Alert
    alert("Train successfully added");
  });

  //MATH
  ////////////////////////////////////////////////////////////////
  // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
  database.ref().on("child_added", function (snapshot) {

    var sv = snapshot.val();

    var frequency = sv.frequency;
    var firstTrain = sv.firstTrain;

    var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    console.log("current time: " + moment(currentTime).format("hh:mm"));
    var timeDiff = moment().diff(moment(firstTrainConverted), "minutes");
    var remainder = timeDiff % frequency;

    var minutesAway = frequency - remainder;
    var nextArrival = moment().add(minutesAway, "minutes");

    // Log everything that's coming out of snapshot
    console.log("Train Name: " + sv.name);
    console.log("Destination: " + sv.destination);
    console.log("Frequency: " + sv.frequency);
    console.log("First Train: " + firstTrain);
    console.log("Next Arrival: " + nextArrival.format("hh:mm a"));
    console.log("Minutes Away: " + minutesAway);

    //DISPLAY
    ////////////////////////////////////////////////////////////////
    $("#train-table").append("<tr>" 
    + "<td>" + sv.train + "</td>"
    + "<td>" + sv.destination + "</td>"
    + "<td>" + frequency + "</td>"
    + "<td>" + nextArrival.format("HH:mm a") + "</td>"
    + "<td>" + minutesAway + "</td>"
    + "</tr>");

  });
});