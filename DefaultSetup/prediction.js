const modelPath = "model/";
let model, maxPredictions;

async function init() {
    const modelURL = modelPath + "model.json";
    const metadataURL = modelPath + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function handleImageUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const img = new Image();
        img.src = URL.createObjectURL(files[0]);
        img.onload = async () => {
            await predict(img);
        }
    }
}

async function predict(imageElement) {
    const prediction = await model.predict(imageElement);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}