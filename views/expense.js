window.addEventListener("load", async () => {
  try {
    const token = localStorage.getItem("token");
    const isPremium = localStorage.getItem("premium");
    if (isPremium === "true") {
      // Note the comparison with a string "true"
      const response = await axios.get("/expense/api", {
        headers: { Authorization: token },
      });
      const expenses = response.data.expenses;
      console.log(expenses);

      const table = document.getElementById("premium-table");
      let formattedDate;
      expenses.forEach(function (expense) {
        const originalDateString = expense.createdAt;
        const dateObject = new Date(originalDateString);
        formattedDate = dateObject.toISOString().split("T")[0];

        console.log(formattedDate); // Output: '2024-03-15'

        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${formattedDate}</td>
             <td>${expense.description}</td>
             <td>${expense.expense}</td>
             <td>40000</td>
             <td>${expense.expense}</td>`;

        table.appendChild(tr);
      });

      //month code
      const yearlytable = document.getElementById("Yearly-table");
      const dateString = formattedDate;
      const dateObject = new Date(dateString);
      const monthName = dateObject.toLocaleString("default", { month: "long" });
      let totalexpense = 0;

      expenses.forEach(function (expense) {
        totalexpense += parseInt(expense.expense);
      });

      const saving = 40000 - totalexpense;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${monthName}</td>
          <td>40000</td>
          <td>${totalexpense}</td>
          <td>${saving}</td>
           `;

      yearlytable.appendChild(tr);

      //donloadbtn

      const downloadbutton = document.getElementById("download-button");
      const button = document.createElement("button");
      button.textContent = "Download";
      downloadbutton.appendChild(button);
      // const token = localStorage.getItem("token")

      button.addEventListener("click", async function () {
        // Send a GET request using Axios
        axios
          .get("/download", { headers: { Authorization: token } })
          .then(function (response) {
            // Handle success
            console.log("Download request successful");
            console.log(response);
            if (response.status === 200) {
              var a = document.createElement("a");
              a.href = response.data.fileUrl;

              a.download = "myexpense.csv";
              a.click()
            }
            
            //post data on database file url and usersignupid
            
          })
          .catch(function (error) {
            // Handle error
            console.error("Error occurred while downloading:", error);
          });
          
        axios
          .get("/getfileurl", { headers: { Authorization: token } })
          .then((response) => {
            // Handle success
            console.log("File URLs received:", response.data);

            // Assuming response.data contains an array of fileUrls
            let ul = document.getElementById("downloadli");
            const fileUrls = response.data.downloaddata;
            console.log(fileUrls);
            ul.innerHTML = ' '
            fileUrls.forEach((fileUrlObject) => {
              // Create a new <a> element
              let a = document.createElement("a");
              // Set the href attribute to the file URL
              a.href = fileUrlObject.url;
              // Set the download attribute to specify the filename
              a.download = `file_${fileUrlObject.id}.txt`; // You can adjust the filename as needed
              // Set the innerHTML of the anchor element to the filename (optional)
              a.innerHTML = `File ${fileUrlObject.id}`;

              // Create a new <li> element
              let li = document.createElement("li");
              // Append the <a> element to the <li> element
              li.appendChild(a);
              // Append the <li> element to the <ul> element
              ul.appendChild(li);
            });
          })
          .catch((error) => {
            // Handle error
            console.error("Error occurred while fetching file URLs:", error);
          });
      });
    
    }
  } catch (error) {
    console.error(error);
  }
});

function checkAndUpdateUI() {
  const premiumStatus = localStorage.getItem("premium");
  if (premiumStatus === "true") {
    // If the user is premium, update UI
    updateUIAfterPaymentSuccess();
  }
}

// Call the function to check and update UI when the page loads
checkAndUpdateUI();

function updateUIAfterPaymentSuccess() {
  // Remove the premium button
  const premiumButton = document.getElementById("premium-button");
  if (premiumButton) {
    premiumButton.remove();
  }
  // Update the existing <p> tag to display a message indicating premium membership
  const message = document.getElementById("showleaderboard");
  if (message) {
    message.textContent = "You are a premium user";
  }

  // Create a button for showing the leaderboard (if needed)
  const leaderboardButton = document.createElement("button");
  leaderboardButton.textContent = "Show Leaderboard";
  leaderboardButton.addEventListener("click", function () {
    // Handle showing leaderboard here
    showPremimum();
    console.log("Showing leaderboard");
  });
  const entryElement = document.getElementById("showpremiumbtn");
  entryElement.innerHTML = "Show premium feature";
  message.appendChild(leaderboardButton);
}

async function showPremimum() {
  const token = localStorage.getItem("token");
  const response = await axios.get("/showleaderboard", {
    headers: { Authorization: token },
  });
  console.log(response.data.outputArr);
  const leaderboard = response.data.outputArr;

  // Sort the leaderboard by totalSpent
  leaderboard.sort((a, b) => b.totalSpent - a.totalSpent);

  const leaderboardContainer = document.getElementById("leaderboard-container");
  leaderboardContainer.innerHTML = ""; // Clear previous content

  leaderboard.forEach((entry) => {
    const entryElement = document.createElement("div");
    entryElement.classList.add("leaderboard-entry");

    const nameElement = document.createElement("span");
    nameElement.textContent = "Name " + entry.name + " :" + "  Expense  ";
    entryElement.appendChild(nameElement);

    const totalSpentElement = document.createElement("span");
    totalSpentElement.textContent = entry.totalSpent;
    entryElement.appendChild(totalSpentElement);

    leaderboardContainer.appendChild(entryElement);
  });
}

// Define a function to fetch and update the expense list
function fetchAndUpdateExpenseList(page = 1, pageSize = 5) {
  const token = localStorage.getItem("token");
  //  const bool =  localStorage.getItem('premium')
  //  console.log(bool);
  //  if(bool === 'true'){
  //   document.getElementById('premium-button').remove()
  //  }

  axios
  .get(`/expense/api?page=${page}&pageSize=${pageSize}`, { headers: { Authorization: token } })
  .then(function (response) {
      const data = response.data;
      const expenses = data.expenses;
      const totalPages = data.totalPages;
      const currentPage = data.currentPage;

      const ul = document.querySelector("ul");
      ul.innerHTML = "";

      expenses.forEach(function (expense) {
          const li = document.createElement("li");
          li.textContent = `Amount: ${expense.expense}, Description: ${expense.description}, Category: ${expense.category}`;
          
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
              axios
                  .delete(`/expense/api/${expense.id}`)
                  .then(function (response) {
                      console.log("Expense deleted successfully:", response.data);
                      fetchAndUpdateExpenseList(currentPage, pageSize); // Reload current page after deletion
                  })
                  .catch(function (error) {
                      console.error("Error deleting expense:", error);
                  });
          });

          li.appendChild(deleteButton);
          ul.appendChild(li);
      });

      // Pagination
      const paginationContainer = document.querySelector("#pagination");
      paginationContainer.innerHTML = "";
      for (let i = 1; i <= totalPages; i++) {
          const button = document.createElement("button");
          button.textContent = i;
          button.addEventListener("click", function () {
              fetchAndUpdateExpenseList(i, pageSize);
          });
          paginationContainer.appendChild(button);
      }
  })
  .catch(function (error) {
      console.error("Error fetching expense data:", error);
  });
}

// Call the function initially to fetch and update the expense list
const pagenum = localStorage.getItem('pagenumber')
fetchAndUpdateExpenseList(1,pagenum);
// Event listener for changing page size
document.getElementById("pageSizeSelect").addEventListener("change", function () {
  const selectedPageSize = parseInt(this.value);
  localStorage.setItem('pagenumber', selectedPageSize)
  fetchAndUpdateExpenseList(1, selectedPageSize); // Fetch first page with selected page size
});

document
  .getElementById("expense-form")
  .addEventListener("submit", function (event) {
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
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Assuming it's a Bearer token
      },
    };
    axios
      .post("/expense/addexpense", expenseData, config)
      .then(function (response) {
        console.log("Expense added successfully:", response.data);
        // Handle success response here if needed
        fetchAndUpdateExpenseList();
      })
      .catch(function (error) {
        console.error("Error addinssssssssssg expense:", error);
        // Handle error response here if needed
      });
  });

document
  .getElementById("premium-button")
  .addEventListener("click", purchaseMembership);

async function purchaseMembership(e) {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please log in to make a premium purchase.");
    window.location = "/login.html";
    return;
  }
  console.log("before");
  try {
    const response = await axios.post("/payment/purchasemembership", null, {
      headers: { Authorization: token },
    });
    console.log("after");
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
                Authorization: token,
              },
            }
          );
          // alert('you are premimum user')
          console.log(successResponse);
          if (successResponse.data.success) {
            alert("Payment successful & you are premimum user");
            console.log(successResponse);
            localStorage.setItem("premium", true);
            updateUIAfterPaymentSuccess();
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
    });

    rzp1.open();
    e.preventDefault();
  } catch (e) {
    console.log("frontend", e);
  }
}
