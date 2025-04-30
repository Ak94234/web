const webcamElement = document.getElementById("webcam");
const canvasElement = document.getElementById("canvas");
const snapButton = document.getElementById("snap");
const uploadInput = document.getElementById("upload");
const restartButton = document.getElementById("restart");
const uploadButton = document.getElementById("upload-btn");
const loadingIndicator = document.getElementById("loading");

const webcam = new Webcam(webcamElement, "user", canvasElement, null);


function startWebcam() {
    webcam.start()
        .then(() => {
            console.log("Webcam started successfully");
            webcamElement.style.display = "block";
            canvasElement.style.display = "none";
        })
        .catch(err => {
            console.error("Error starting webcam:", err);
            alert("Please allow camera access and refresh the page.");
        });
}
startWebcam(); 


snapButton.addEventListener("click", () => {
    loadingIndicator.textContent = "Capturing image...";
    loadingIndicator.style.display = "block"; 

    setTimeout(() => {
        let picture = webcam.snap();

       
        let stream = webcamElement.srcObject;
        if (stream) {
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

        
        webcamElement.style.display = "none";
        canvasElement.style.display = "block";

        const ctx = canvasElement.getContext("2d");
        const img = new Image();
        img.onload = function () {
            canvasElement.width = img.width;
            canvasElement.height = img.height;
            ctx.drawImage(img, 0, 0);
            loadingIndicator.style.display = "none"; 
        };
        img.src = picture;

       
        snapButton.href = picture;
    }, 1000); 
});


restartButton.addEventListener("click", () => {
    loadingIndicator.textContent = "Restarting webcam...";
    loadingIndicator.style.display = "block";

    setTimeout(() => {
        startWebcam();
        loadingIndicator.style.display = "none"; 
    }, 1000);
});


uploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
        loadingIndicator.textContent = "Processing uploaded image...";
        loadingIndicator.style.display = "block"; // Show loading

        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
               
                webcamElement.style.display = "none";
                canvasElement.style.display = "block";

              
                const ctx = canvasElement.getContext("2d");
                canvasElement.width = img.width;
                canvasElement.height = img.height;
                ctx.drawImage(img, 0, 0);

                loadingIndicator.style.display = "none"; 
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid image file.");
    }
});


