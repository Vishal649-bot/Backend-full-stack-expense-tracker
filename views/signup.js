
    document.getElementById('signup-form').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the default form submission

      // Get form data
      const formData = new FormData(event.target);

      // Create an object from form data
      const userData = {};
      formData.forEach((value, key) => {
        userData[key] = value;
      });

      // Send POST request using Axios
      axios.post('/users/signup', userData)
        .then(function(response) {
          console.log('User signed up successfully:', response.data);
          // Handle success response here
        })
        .catch(function(error) {
          const message = document.getElementById('error-message')
          console.log(message)
          message.textContent = 'already signIn please login'
          console.error('Error signing up user:', error);
          // Handle error response here
        });
    });
  