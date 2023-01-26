// crudcrud api key
const apiKey = "f01e5538108b464788f8adcdf562695d";
let axiosInstance = axios.create({
  baseURL: "https://crudcrud.com/api/" + apiKey,
});

// show all expense list items on dom content load / on page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    let res = await axiosInstance("/Expense");
    let responseArray = res.data;
    // loop through response array and print objects on screen
    responseArray.forEach((item) => {
      showExpenses(item);
    });
  } catch (err) {
    console.error(err);
  }
});

// add functionality
const addExpence = async (e) => {
  e.preventDefault();
  try {
    const {
      expence: { value: expence },
      description: { value: description },
      category: { value: category },
    } = e.target;

    const expenceObj = {
      expence,
      description,
      category,
    };
    const res = await axiosInstance.post("/Expense", expenceObj);
    showExpenses(res.data);

    // clear input fields
    (e.target.description.value = ""),
      (e.target.expence.value = ""),
      (e.target.category.value = "");
  } catch (err) {
    console.error(err);
  }
};

// show expense list items by passing actual expense object
function showExpenses(expense_obj) {
  let childHtml = `
<div class="" id=${expense_obj._id}>
<div  class="card" style="width: 75%; text-align: center;">
<div class="card-body">
    <h3>Amount: ₹${expense_obj.expence}</h3>
    <h5 class="card-title">Category: ${expense_obj.category}</h5>
    <p class="card-text">Description: ${expense_obj.description}</p>
    
    <button class="btn btn-danger" onclick = deleteExpense('${JSON.stringify(
      expense_obj
    )}')>Delete</button>
    <button class="btn btn-primary" onclick=editExpense('${JSON.stringify(
      expense_obj
    )}')>Edit</button>
    
  </div>
</div>
</div>
`;

  let pt = expense_obj.category.toString();
  let parentnode = document.getElementById(pt);
  parentnode.innerHTML += childHtml;
}

// edit functionality
function editExpense(expence) {
  const expense_obj = JSON.parse(expence);

  document.getElementById("expence").value = expense_obj.expence;
  document.getElementById("description").value = expense_obj.description;
  document.getElementById("category").value = expense_obj.category;

  deleteExpense(expence);
}

// delete functionality
async function deleteExpense(expense) {
  const expense_obj = JSON.parse(expense);
  const id = expense_obj._id;
  try {
    let res = await axiosInstance.delete("/Expense/" + id);
    removeFromScreen(expense);
  } catch (err) {
    console.error(err);
  }
}

// remove from ui

function removeFromScreen(expense) {
  const expense_obj = JSON.parse(expense);
  const parentnode = document.getElementById(expense_obj.category);
  const nodeToBeDeleted = document.getElementById(expense_obj._id);
  if (nodeToBeDeleted) parentnode.removeChild(nodeToBeDeleted);
}