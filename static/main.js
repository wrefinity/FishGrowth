// my javascript functions
(function() {
    console.log('checker setup');
})();
// close message
const closeFlashMessage= ()=> {
    const flashMessage = document.getElementById('flash-message');
    flashMessage.style.display = 'none';
}
// Function to show the flash message
const showFlashMessage = (message) => {
    const flashMessage = document.getElementById('flash-message');
    const flashMessageText = document.getElementById('flash-message-text');

    flashMessageText.textContent = message;
    flashMessage.style.backgroundColor = '#198753';
    flashMessage.style.display = 'block';

    // Auto-hide after 5 seconds (adjust as needed)
    setTimeout(() => {
        closeFlashMessage();
    }, 2000);
}

