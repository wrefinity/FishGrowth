document.getElementById("predictionForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect input values
    let temperature = document.getElementById("temperature").value;
    let turbidity = document.getElementById("turbidity").value;
    let oxygen = document.getElementById("oxygen").value;
    let ph_value = document.getElementById("ph_value").value;
    let ammonia = document.getElementById("ammonia").value;
    let nitrate = document.getElementById("nitrate").value;
    let population = document.getElementById("population").value;
    let length = document.getElementById("length").value;

    // Prepare data for FastAPI request
    let requestData = {
        "temperature": parseFloat(temperature),
        "turbidity": parseInt(turbidity),
        "oxygen": parseFloat(oxygen),
        "ph_value": parseFloat(ph_value),
        "ammonia": parseFloat(ammonia),
        "nitrate": parseInt(nitrate),
        "population": parseInt(population),
        "length": parseFloat(length)
    };

    // Send data to FastAPI endpoint
    fetch('/predict', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the prediction result
        console.log('Prediction Result:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    }
);
