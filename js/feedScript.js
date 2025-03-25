document.addEventListener('DOMContentLoaded', () => {
    const hoverButton = document.getElementById('hover-widget');
    const widgetContainer = document.getElementById('feed-widget');
    const pageContent = document.getElementById('page-content');
    let hideTimeout;

    // Function to show the widget
    function showWidget() {
        widgetContainer.style.display = 'block';
        pageContent.classList.add('blurred'); // Add blur effect
        // Clear previous timeout to prevent hiding while interacting
        clearTimeout(hideTimeout);
    }

    // Function to hide the widget
    function hideWidget() {
        widgetContainer.style.display = 'none';
        pageContent.classList.remove('blurred'); // Remove blur effect
        clearTimeout(hideTimeout); // Clear timeout to prevent any lingering issues
    }

    // Function to delay hiding the widget
    function delayedHide() {
        hideTimeout = setTimeout(hideWidget, 500); // Hide 
    }

    // Event listeners for hover
    hoverButton.addEventListener('mouseover', showWidget);
    hoverButton.addEventListener('mouseout', delayedHide);

    // Keep the widget visible if hovered
    widgetContainer.addEventListener('mouseover', showWidget);

    // Hide the widget if the mouse leaves
    widgetContainer.addEventListener('mouseout', delayedHide);

    // Reset the timer on scroll to prevent auto-hiding during interaction
    widgetContainer.addEventListener('scroll', () => {
        clearTimeout(hideTimeout);
    });
});


