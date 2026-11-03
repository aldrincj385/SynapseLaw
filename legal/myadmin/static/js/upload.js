// File upload functionality for SynapseLaw
document.addEventListener('DOMContentLoaded', function() {
    // Main upload button
    const uploadTrigger = document.getElementById('uploadTrigger');
    const fileInput = document.getElementById('fileInput');
    const uploadForm = document.getElementById('uploadForm');

    if (uploadTrigger && fileInput) {
        // When upload button is clicked, trigger file input
        uploadTrigger.addEventListener('click', function() {
            fileInput.click();
        });

        // When file is selected, submit the form
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                // Show loading state
                const originalText = uploadTrigger.innerHTML;
                uploadTrigger.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
                uploadTrigger.disabled = true;

                // Submit the form
                uploadForm.submit();

                // Reset button after 3 seconds (in case submission fails)
                setTimeout(() => {
                    uploadTrigger.innerHTML = originalText;
                    uploadTrigger.disabled = false;
                }, 3000);
            }
        });
    }

    // Sample upload button
    const sampleUploadBtn = document.querySelector('.sample-upload-btn');
    if (sampleUploadBtn) {
        sampleUploadBtn.addEventListener('click', function() {
            // Show loading
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Sample...';
            this.disabled = true;

            // Redirect to analysis page with sample parameter
            setTimeout(() => {
                window.location.href = '/analyze?sample=true';
            }, 1000);
        });
    }

    // File validation
    function validateFile(file) {
        const allowedExtensions = ['.pdf', '.docx', '.txt', '.rtf'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        // Check extension
        const fileName = file.name.toLowerCase();
        const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!isValidExtension) {
            alert('Please upload only PDF, DOCX, TXT, or RTF files.');
            return false;
        }

        // Check size
        if (file.size > maxSize) {
            alert('File size must be less than 10MB.');
            return false;
        }

        return true;
    }
});