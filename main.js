img = "";
objects = [];
status = "";
object_name = "";
found = false;
detectionActive = false;


function setup() {

    canvas = createCanvas(380, 380);

   canvas.position(450, 280);

    video = createCapture(VIDEO);

    video.size(380, 380);

    video.hide();

}


function start() {

    object_name = document.getElementById("object_name").value.toLowerCase().trim();

    if (object_name == "") {
        document.getElementById("object_status").innerHTML = "Please enter an object name";
        return;
    }

    objects = [];
    found = false;

    document.getElementById("object_status").innerHTML = "";

    objectDetector = ml5.objectDetector('cocossd', modelLoaded);

    document.getElementById("status").innerHTML = "Status : Detecting Objects";

}


function modelLoaded() {

    console.log("Model Loaded!");

    status = true;

    detectionActive = true;

    objectDetector.detect(video, gotResult);

}


function gotResult(error, results) {

    if (error) {

        console.log(error);

        return;

    }

    console.log(results);

    objects = results;

    if (detectionActive == true && found == false) {

        objectDetector.detect(video, gotResult);

    }

}


function draw() {

    image(video, 0, 0, 380, 380);

    if (status != "" && found == false) {

        for (i = 0; i < objects.length; i++) {

            fill("#FF0000");

            percent = floor(objects[i].confidence * 100);

            text(
                objects[i].label + " " + percent + "%",
                objects[i].x + 15,
                objects[i].y + 15
            );

            noFill();

            stroke("#FF0000");

            rect(
                objects[i].x,
                objects[i].y,
                objects[i].width,
                objects[i].height
            );


            if (objects[i].label.toLowerCase() == object_name) {

                found = true;

                detectionActive = false;

                document.getElementById("object_status").innerHTML =
                    object_name + " found";

                document.getElementById("status").innerHTML =
                    "Status : Object Found";

                video.stop();

                speech = window.speechSynthesis;

                utterThis = new SpeechSynthesisUtterance(
                    object_name + " found"
                );

                speech.speak(utterThis);

            }

            else {

                document.getElementById("object_status").innerHTML =
                    object_name + " not found";

            }

        }

        if (objects.length == 0) {

            document.getElementById("object_status").innerHTML =
                object_name + " not found";

        }

    }

}