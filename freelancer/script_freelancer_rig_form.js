document.addEventListener('DOMContentLoaded', function() {
    const CHAR_LIMIT = 100; // Character limit for textarea

    // Function to validate Aadhaar number
    function ValidateAadhaar() {
        const aadhaar = document.getElementById("txtAadhaar").value;
        const lblError = document.getElementById("lblError");
        lblError.innerHTML = "";

        const expr = /^([0-9]{4}[0-9]{4}[0-9]{4}|[0-9]{4}\s[0-9]{4}\s[0-9]{4}|[0-9]{4}-[0-9]{4}-[0-9]{4})$/;
        if (!expr.test(aadhaar)) {
            lblError.innerHTML = "Invalid Aadhaar Number";
            return false;
        }
        return true;
    }

    // Function to validate phone number
    function validatePhoneNumber() {
        const phone = document.getElementById('phone').value;
        const lblError = document.getElementById('phoneError');
        lblError.innerHTML = "";

        const pattern = /^[0-9]{10}$/; // 10 digits
        if (!pattern.test(phone) && phone.length === 10) {
            lblError.innerHTML = 'Invalid phone number. Please enter a 10-digit number.';
            return false;
        }
        return true;
    }

    // Function to validate designation and rates
    function validateAdditionalFields() {
        const designation = document.getElementById('designation').value.trim();
        const hourlyRate = document.getElementById('hourlyRate').value.trim();
        const projectRate = document.getElementById('projectRate').value.trim();

        if (!designation || !hourlyRate || !projectRate) {
            alert('Please fill out all designation and rate fields.');
            return false;
        }
        return true;
    }

    // Function to check character limit for textarea
    function checkCharLimit() {
        const textarea = document.getElementById('inputBox');
        const warning = document.getElementById('warning');
        const charCount = textarea.value.length;

        if (charCount > CHAR_LIMIT) {
            warning.textContent = 'Please limit your input to 100 characters.';
            textarea.value = textarea.value.substring(0, CHAR_LIMIT);
        } else {
            warning.textContent = '';
        }
    }

    // Function to handle image preview
    function handleImagePreview() {
        const fileInput = document.getElementById('profileImage');
        const previewContainer = document.getElementById('imagePreviewContainer');
        const uploadSection = document.getElementById('uploadSection');
        const changeImageButton = document.getElementById('changeImageButton');

        fileInput.addEventListener('change', function() {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Image">`;
                    uploadSection.classList.add('hidden'); // Hide the upload section
                    changeImageButton.classList.remove('hidden'); // Show the Change Image button
                };
                reader.readAsDataURL(file);
            }
        });

        changeImageButton.addEventListener('click', function() {
            fileInput.click(); // Trigger the file input click to change the image
        });
    }

    // Function to add new project fields
    function addProjectFields() {
        const projectsContainer = document.getElementById('projectsContainer');

        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        const index = projectsContainer.children.length; // Get the index of new project

        projectDiv.innerHTML = `
            <label for="projectTitle${index}">Project Title:</label>
            <input id="projectTitle${index}" type="text" placeholder="Project Title">
            <label for="projectDescription${index}">Project Description:</label>
            <textarea id="projectDescription${index}" placeholder="Describe your project..."></textarea>
        `;

        projectsContainer.appendChild(projectDiv);
    }

    // Function to add new experience fields
    function addExperienceFields() {
        const experienceContainer = document.getElementById('experienceContainer');

        const experienceDiv = document.createElement('div');
        experienceDiv.classList.add('experience');
        const index = experienceContainer.children.length; // Get the index of new experience

        experienceDiv.innerHTML = `
            <label for="company${index}">Company:</label>
            <input id="company${index}" type="text" placeholder="Company Name">
            <label for="role${index}">Role:</label>
            <input id="role${index}" type="text" placeholder="Your Role">
            <label for="duration${index}">Duration:</label>
            <input id="duration${index}" type="text" placeholder="Duration (e.g., 2 years)">
        `;

        experienceContainer.appendChild(experienceDiv);
    }

    // Form submission event handler
    document.getElementById('freelancer_bioDataForm').addEventListener('submit', function(event) {
        // Validate Aadhaar, Phone Number, and additional fields
        if (!ValidateAadhaar() || !validatePhoneNumber() || !validateAdditionalFields()) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
    });

    // Attach event listeners
    document.getElementById('txtAadhaar').addEventListener('input', ValidateAadhaar);
    document.getElementById('phone').addEventListener('blur', validatePhoneNumber);
    document.getElementById('inputBox').addEventListener('input', checkCharLimit);
    document.getElementById('addProjectButton').addEventListener('click', addProjectFields);
    document.getElementById('addExperienceButton').addEventListener('click', addExperienceFields);

    // Initialize image preview functionality
    handleImagePreview();
});
