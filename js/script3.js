// Sample data for services and their subservices
const servicesData = [
  { name: "Door Cabinet Repair", subServices: ["Hinge Fixing", "Drawer Repair", "Door Frame Adjustment", "Wood Polishing"] },
  { name: "Wall Repair", subServices: ["Drywall Patching", "Crack Filling", "Hole Repair", "Textured Wall Fixing"] },
  { name: "Sealing & Caulking", subServices: ["Bathroom Caulking", "Window Sealing", "Kitchen Backsplash Sealing", "Door Draft Prevention"] },
  { name: "Appliance Installation & Repairs", subServices: ["Refrigerator Repair", "Washing Machine Fix", "Oven Installation", "Dishwasher Setup"] }, { name: "Flooring & Tiling Help", subServices: ["Tile Repair", "Laminate Installation", "Hardwood Refinishing", "Vinyl Flooring Setup"] },
  { name: "Electrical Help", subServices: ["Outlet Repair", "Light Fixture Installation", "Circuit Breaker Replacement", "Wiring Troubleshooting"] },
  { name: "Plumbing Help", subServices: ["Leaky Faucet Fix", "Pipe Replacement", "Drain Cleaning", "Water Heater Repair"] },
  { name: "Light Carpentry", subServices: ["Shelf Installation", "Trim & Molding", "Custom Woodwork", "Deck Repair"] }
];

document.addEventListener("DOMContentLoaded", function () {
  const servicesContainer = document.getElementById("servicesContainer");

  // Create a checkbox for each service
  servicesData.forEach(service => {
    const serviceDiv = document.createElement("div");
    serviceDiv.className = "service-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = "service_" + service.name;
    checkbox.value = service.name;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = service.name;

    // Append checkbox and label to service div
    serviceDiv.appendChild(checkbox);
    serviceDiv.appendChild(label);

    // Event listener to toggle subservices directly under the service
    checkbox.addEventListener("change", function () {
      // Check if the subservices container already exists
      let subDiv = serviceDiv.querySelector(".subservices");

      if (checkbox.checked) {
        // If not present, create it and populate with subservices checkboxes
        if (!subDiv) {
          subDiv = document.createElement("div");
          subDiv.className = "subservices";
          service.subServices.forEach(sub => {
            const subItemDiv = document.createElement("div");
            const subCheckbox = document.createElement("input");
            subCheckbox.type = "checkbox";
            // Create a valid ID by removing spaces
            subCheckbox.id = service.name + "_" + sub.replace(/\s+/g, '');
            subCheckbox.value = sub;

            const subLabel = document.createElement("label");
            subLabel.htmlFor = subCheckbox.id;
            subLabel.textContent = sub;

            subItemDiv.appendChild(subCheckbox);
            subItemDiv.appendChild(subLabel);
            subDiv.appendChild(subItemDiv);
          });
          serviceDiv.appendChild(subDiv);
        }
      } else {
        // If unchecked, remove the subservices container if it exists
        if (subDiv) {
          serviceDiv.removeChild(subDiv);
        }
      }
    });

    servicesContainer.appendChild(serviceDiv);
  });
});


// Toggle the display of technician-specific fields
function toggleTechnicianFields() {
  const role = document.getElementById("role").value;
  const techFields = document.getElementById("technicianFields");
  if (role === "technician") {
    techFields.classList.remove("hidden");
  } else {
    techFields.classList.add("hidden");
    clearTechnicianFields();
  }
}

// Clear technician fields when role is switched away
function clearTechnicianFields() {
  document.getElementById("expertise").value = "";
  document.getElementById("priceMin").value = "";
  document.getElementById("priceMax").value = "";

  // Uncheck all services checkboxes
  const checkboxes = document.querySelectorAll("#servicesContainer input[type='checkbox']");
  checkboxes.forEach(checkbox => checkbox.checked = false);

  // Clear sub services container
  document.getElementById("subServicesContainer").innerHTML = "";
}

// Update sub services based on the selected services
function updateSubServices() {
  const subServicesContainer = document.getElementById("subServicesContainer");
  subServicesContainer.innerHTML = "";

  // Get all selected services
  const selectedServiceCheckboxes = document.querySelectorAll("#servicesContainer input[type='checkbox']:checked");
  selectedServiceCheckboxes.forEach(checkbox => {
    const serviceName = checkbox.value;
    const service = servicesData.find(s => s.name === serviceName);
    if (service) {
      // Create a section for each selected service
      const serviceDiv = document.createElement("div");
      serviceDiv.className = "service-item";

      const serviceTitle = document.createElement("h4");
      serviceTitle.textContent = serviceName;
      serviceDiv.appendChild(serviceTitle);

      // Create checkboxes for each sub service
      service.subServices.forEach(sub => {
        const subDiv = document.createElement("div");
        const subCheckbox = document.createElement("input");
        subCheckbox.type = "checkbox";
        // Remove spaces in the id for a valid identifier
        subCheckbox.id = serviceName + "_" + sub.replace(/\s+/g, "");
        subCheckbox.value = sub;

        const subLabel = document.createElement("label");
        subLabel.htmlFor = subCheckbox.id;
        subLabel.textContent = sub;

        subDiv.appendChild(subCheckbox);
        subDiv.appendChild(subLabel);
        serviceDiv.appendChild(subDiv);
      });

      subServicesContainer.appendChild(serviceDiv);
    }
  });
}
