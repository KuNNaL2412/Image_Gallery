document.addEventListener('DOMContentLoaded', () => {
    // Initialize Google Sign-In
    gapi.load('auth2', () => {
        gapi.auth2.init({
            client_id: '1068540920247-6220mok1dnktgr6k3iu50ae5e9pj07ku.apps.googleusercontent.com',
        });
    });

    // Event listener for login form
    document.getElementById('login-form').addEventListener('submit', (event) => {
        event.preventDefault();
        loginWithGoogle();
    });

    // Event listener for image upload form
    document.getElementById('upload-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Handle success, e.g., show a success message
                console.log('Image uploaded successfully.');
            } else {
                // Handle errors
                console.error('Image upload failed.');
            }
        } catch (error) {
            console.error(error);
        }
    });

    // Fetch and display user's images
    fetch('/gallery')
        .then(response => response.json())
        .then(images => {
            const gallery = document.getElementById('image-gallery');
            images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.classList.add('img-thumbnail', 'm-2');
                gallery.appendChild(imgElement);
            });
        })
        .catch(error => console.error(error));
});

// Function to trigger Google Sign-In
function loginWithGoogle() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signIn().then(googleUser => {
        const id_token = googleUser.getAuthResponse().id_token;

        // Send the token to the server for validation and user creation
        fetch('/auth/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id_token }),
        })
            .then(response => response.json())
            .then(data => {
                // Handle successful authentication on the server
                console.log('Login successful:', data);
            })
            .catch(error => {
                // Handle authentication failure
                console.error('Login failed:', error);
            });
    });
}
