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
    //   alert('login succesful')
      // Redirect user or perform actions after successful login
    } catch (error) {
      console.error('Error logging in:', error.response.data.error);
      // Display error message to the user
      document.getElementById('error-message').textContent = error.response.data.error;
    }
  });
  