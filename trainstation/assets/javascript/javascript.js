//global variables

var trainName="";
var trainDestination="";
var trainTime="";
var trainFrequency="";
var nextArrival="";
var minutesAway="";


//jQuery variables

var PoketrainName = $("#train-name");
var PoketrainDest = $("#train-destination");
var PoketrainTime = $("#train-time").mask("00:00");
var PoketrainFreq = $("#train-freq").mask("00");

// link firebase (copied from site)

var config = {
    apiKey: "AIzaSyA-8kv6z5VVE5606oGZwsLMJzRWsCtrOyQ",
    authDomain: "fir-assignment-45065.firebaseapp.com",
    databaseURL: "https://fir-assignment-45065.firebaseio.com",
    projectId: "fir-assignment-45065",
    storageBucket: "fir-assignment-45065.appspot.com",
    messagingSenderId: "579101140540"
  };
  firebase.initializeApp(config);

var database = firebase.database();

// save firebase data to local
database.ref("/trains").on("child_added", function(snapshot) {
 var trainDiff = 0;
 var trainRemainder = 0;
 var minutesTillArrival = "";
 var nextTrainTime = "";
 var frequency = snapshot.val().frequency;


// compute the difference in time from 'now' and the first train using UNIX timestamp, store in var and convert to minutes
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

// get the remainder of time by using 'moderator' with the frequency & time difference, store in var
    trainRemainder = trainDiff % frequency;

// subtract the remainder from the frequency, store in var
    minutesTillArrival = frequency - trainRemainder;

// add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

// append to our table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  " + "<a><span class='glyphicon glyphicon-remove icon-hidden' aria-hidden='true'></span></a>" + "</td></tr>"
    );

    $("span").hide();

    // Hover view of delete button
    $("tr").hover(
        function() {
            $(this).find("span").show();
        },
        function() {
            $(this).find("span").hide();
        });

 });


// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
    // prevent from from reseting
    event.preventDefault();

// get & store input values
    trainName = PoketrainName.val().trim();
    trainDestination = PoketrainDest.val().trim();
    trainTime = moment(PoketrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = PoketrainFreq.val().trim();

// add to firebase databse
    database.ref("/trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  alert that train was added
    alert("Train successuflly added!");

    //  empty form once submitted
    PoketrainName.val("");
    PoketrainDest.val("");
    PoketrainTime.val("");
    PoketrainFreq.val("");
};

// Calls storeInputs function if submit button clicked
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (PoketrainName.val().length === 0 || PoketrainDest.val().length === 0 || PoketrainTime.val().length === 0 || PoketrainFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});

// Calls storeInputs function if enter key is clicked
$('form').on("keypress", function(event) {
    if (event.which === 13) {
        // form validation - if empty - alert
        if (PoketrainName.val().length === 0 || PoketrainDest.val().length === 0 || PoketrainTime.val().length === 0 || PoketrainFreq === 0) {
            alert("Please Fill All Required Fields");
        } else {
            // if form is filled out, run function
            storeInputs(event);
        }
    }
});

