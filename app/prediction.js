const modelPath = "model/";
let model, maxPredictions;

let prediction = {};

async function loadModel() {
    const modelURL = modelPath + "model.json";
    const metadataURL = modelPath + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
    // Q("#modelLoaded").set("Το μοντέλο φορτώθηκε!");
    Q("#modelLoaded").set(null);
    Q("#appArea").classList.remove("d-none");

}
loadModel();

async function handleImageUpload(event) {
    Q("#waitingLabel").set("Γίνεται η πρόβλεψη...");
    const files = event.target.files;
    if (files.length > 0) {
        const img = new Image();
        img.src = URL.createObjectURL(files[0]);
        img.onload = async () => {
            await predict(img);
        }
    }
}
Q("#imageInput").on("change", handleImageUpload);

async function predict(imageElement) {
    prediction = await model.predict(imageElement);
    Q("#waitingLabel").show(false);
    console.log({prediction});
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    explainPrediction();
}

function explainPrediction() {
    prediction = prediction.sort((a, b) => b.probability - a.probability);
    let topPrediction = prediction[0];
    Q("~cloudName").set(topPrediction.className);
    Q("~cloudDescription").set(clouds[topPrediction.className].description);
    Q("~rainProbability").set(clouds[topPrediction.className].probability);
    Q("#explanation").show(true);
}
