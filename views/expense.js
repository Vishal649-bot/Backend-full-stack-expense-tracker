// Define a function to fetch and update the expense list
function fetchAndUpdateExpenseList() {
  axios.get('/expense/api')
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
    axios.post('/expense/addexpense', expenseData)
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