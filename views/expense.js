// Define a function to fetch and update the expense list
function fetchAndUpdateExpenseList() {
  const token = localStorage.getItem('token')
//  const bool =  localStorage.getItem('premium')
//  console.log(bool);
//  if(bool === 'true'){
//   document.getElementById('premium-button').remove()
//  }

  axios.get('/expense/api',{headers:{"Authorization":token}})
    .then(function(response) {
      const expenses = response.data;
      const ul = document.querySelector('ul');

      // Clear the existing list items
      ul.innerHTML = '';

      // Loop through the expenses and create list items
      expenses.forEach(function(expense) {
        const li = document.createElement('li');
        li.textContent = `Amount: ${expense.expense}, Description: ${expense.description}, Category: ${expense.category}`;

        // Create a delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', function() {
          // Send DELETE request using Axios
          axios.delete(`/expense/api/${expense.id}`)
            .then(function(response) {
              console.log('Expense deleted successfully:', response.data);
              // After deleting the expense, fetch and update the expense list
              fetchAndUpdateExpenseList();
            })
            .catch(function(error) {
              console.error('Error deleting expense:', error);
              // Handle error response here if needed
            });
        });

        // Append the delete button to the list item
        li.appendChild(deleteButton);

        // Append the list item to the unordered list
        ul.appendChild(li);
      });
    })
    .catch(function(error) {
      console.error('Error fetching expense data:', error);
    });
}


// Call the function initially to fetch and update the expense list
fetchAndUpdateExpenseList();

document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(event.target);

    // Create an object from form data
    const expenseData = {};
    formData.forEach((value, key) => {
      expenseData[key] = value;
    });

    console.log(expenseData);
    // Send POST request using Axios
    const token = localStorage.getItem('token')
    const config = {
      headers: {
        'Authorization': `Bearer ${token}` // Assuming it's a Bearer token
      }
    }
    axios.post('/expense/addexpense', expenseData, config)
      .then(function(response) {
        console.log('Expense added successfully:', response.data);
        // Handle success response here if needed
        fetchAndUpdateExpenseList();
      })
      .catch(function(error) {
        console.error('Error addinssssssssssg expense:', error);
        // Handle error response here if needed
      });
  });







  document.getElementById('premium-button').addEventListener('click',purchaseMembership)
   

  
  async function purchaseMembership(e) {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to make a premium purchase.");
      window.location = "/login.html";
      return;
    }
  console.log('before');
    try {
      const response = await axios.post(
        "/payment/purchasemembership",null ,{headers:{"Authorization":token},
        }
      );
      console.log('after');
    console.log(response);
    
    const options = {
      key: response.data.key,
      order_id: response.data.order_id,
      handler: async function (response) {
        console.log(response);

        try {
          const successResponse = await axios.post(
            "http://localhost:3001/payment/success",
            {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                "Authorization": token,
              },
            }
          );
            // alert('you are premimum user')
          console.log(successResponse);
          if (successResponse.data.success) {
            alert("Payment successful & you are premimum user");
            console.log(successResponse);
            localStorage.setItem('premium' ,true)
            document.getElementById('premium-button').remove()
          } else {
            alert("Payment failed");
          }
        } catch (error) {
          console.error(error);
          alert("Payment failed");
        }
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", async function (response) {
      console.log(response.error);
      alert("Payment failed");

      try {
        const failResponse = await axios.post(
          "http://localhost:3001/payment/failed",
          {
            payment_id: response.error.metadata.payment_id,
          },
          {
            headers: {
              "Authorization": token,
            },
          }
        );

        console.log(failResponse);
      } catch (error) {
        console.error(error);
      }
    });

    rzp1.open();
    e.preventDefault();
    } catch (e) {
      console.log('frontend',e);
    }
  }













  