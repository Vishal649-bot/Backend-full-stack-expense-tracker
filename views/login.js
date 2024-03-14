document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get form data
    const formData = new FormData(event.target);
  
    // Construct the userData object
    const userData = {};
    for (const [key, value] of formData.entries()) {
      userData[key] = value;
    }
  
    try {
      // Send POST request using Axios
      const response = await axios.post('/users/login', userData);
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token)
    //   alert('login succesful')
    window.location.href = 'http://localhost:3001/expense'; // Redirect to the /expense page
      // Redirect user or perform actions after successful login
    } catch (error) {
      console.error('Error logging in:', error.response.data.error);
      // Display error message to the user
      document.getElementById('error-message').textContent = error.response.data.error;
    }
  });
  


  const forgotPasswordButton = document.getElementById('forgot-password');
  const forgotPasswordForm = document.getElementById('forgot-password-form')

  forgotPasswordButton.addEventListener('click', () => {
    if(forgotPasswordForm.style.display = 'none'){
    forgotPasswordForm.style.display = 'block';
    }else {
      forgotPasswordForm.style.display = 'none'
    }
  });

  forgotPasswordForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('forgot-email').value;

    // Use Axios to call the backend API route
    axios.post('/forgot-password', { email })
      .then(response => {
        // Handle successful response (e.g., show success message)
        console.log(response.data); // For debugging purposes
      })
      .catch(error => {
        // Handle errors (e.g., show error message)
        console.error(error);
      });
  });