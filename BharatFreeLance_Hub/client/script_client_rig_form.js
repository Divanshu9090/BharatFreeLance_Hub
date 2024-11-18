document.addEventListener('DOMContentLoaded', function() {
    const CHAR_LIMIT = 100; // Character limit for textarea

    // Function to handle image upload
    const profileImageInput = document.getElementById('profileImage');
    const uploadSection = document.getElementById('uploadSection');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const changeImageButton = document.getElementById('changeImageButton');

    profileImageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreviewContainer.innerHTML = `<img src="${e.target.result}" alt="Profile Image" class="profile-image-preview">`;
                uploadSection.classList.add('hidden');
                changeImageButton.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    changeImageButton.addEventListener('click', function() {
        profileImageInput.click();
    });

    // Function to validate Aadhaar number and GSTIN number
    function validateVerification() {
        const aadhaarNumber = document.getElementById("aadhaarNumber").value.trim();
        const gstinNumber = document.getElementById("gstinNumber").value.trim();
        const lblError = document.getElementById("verificationError");
        lblError.innerHTML = "";

        const aadhaarExpr = /^([0-9]{4}[0-9]{4}[0-9]{4}|[0-9]{4}\s[0-9]{4}\s[0-9]{4}|[0-9]{4}-[0-9]{4}-[0-9]{4})$/;
        const gstinExpr = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[Z]{1}[A-Z0-9]{1}$/; // GSTIN format

        if (aadhaarNumber === "" && gstinNumber === "") {
            lblError.innerHTML = "Please fill in either Aadhaar Number or GSTIN Number.";
            return false;
        }

        if (aadhaarNumber && !aadhaarExpr.test(aadhaarNumber)) {
            lblError.innerHTML = "Invalid Aadhaar Number format.";
            return false;
        }

        if (gstinNumber && !gstinExpr.test(gstinNumber)) {
            lblError.innerHTML = "Invalid GSTIN Number format.";
            return false;
        }

        return true;
    }

    // Form submission
    const form = document.getElementById('bioDataForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const basedOn = document.getElementById('basedOn').value.trim();
        const aboutUs = document.getElementById('aboutUs').value.trim();
        const email = document.getElementById('email').value.trim();
        const website = document.getElementById('website').value.trim();
        const verificationValid = validateVerification();

        if (name === '' || basedOn === '' || aboutUs === '' || email === '') {
            alert('Please fill in all required fields.');
            return;
        }

        if (!verificationValid) {
            return;
        }

        // Handle form submission here
        alert('Form submitted successfully!');
        form.reset();
        imagePreviewContainer.innerHTML = '';
        uploadSection.classList.remove('hidden');
        changeImageButton.classList.add('hidden');
    });
});