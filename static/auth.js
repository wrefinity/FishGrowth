

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect form data
    let username = document.getElementById("login_username").value;
    let password = document.getElementById("password").value;

    print(username, password)
    // Create a FormData object to send data
    let formData = {
        "username": username,
        "password": password
    };

    // Use fetch to send data to the FastAPI login route
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {  
        // Handle the response from the server
        console.log(data);
        
        // Extract the access token and user data
        const accessToken = data?.token?.access_token;
        const userData = data?.user;

        // Store the token and user data in localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
    })
    .catch(error => {
        console.error("Error:", error);
    });
});


document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();
    // Collect form data
    var farmName = document.getElementById("name").value;
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var phoneNumber = document.getElementById("phone").value;
    var password = document.getElementById("pword").value;

    // Create an object with the data
    let formData = {
        fullname: farmName,
        username: username,
        email: email,
        phone: phoneNumber,
        password: password
    };
    console.log(formData)
    // Use fetch to send data to the FastAPI signup route
    fetch("/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        console.log(data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
});

