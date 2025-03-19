
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".navbar li");
    const categories = document.querySelectorAll(".category");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove 'active' class from all navigation items and categories
            navItems.forEach(nav => nav.classList.remove("active"));
            categories.forEach(cat => cat.classList.remove("active"));

            // Add 'active' class to the clicked item and corresponding category
            item.classList.add("active");
            document.getElementById(item.getAttribute("data-category")).classList.add("active");
        });
    });
});
