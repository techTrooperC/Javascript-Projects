document.addEventListener("DOMContentLoaded", function ()
{
    const signUpButton = document.getElementById("sign-up");
    const signInButton = document.getElementById("sign-in");
    const overlay = document.getElementById("overlay");
    const mainPage = document.getElementById("mainPage");

    

// sign up conditional if
signUpButton.addEventListener("click", function()
{
    const username = prompt("Choose a username:");
    const password = prompt("Choose a password:");

    if (username && password)
    {
        localStorage.setItem("storedUsername" , username);
        localStorage.setItem("storedPassword" , password);
        alert("You have successfully signed up");
    }

    else
    {
       alert("Error, this cannot be left blank"); 
    }

});

// sign in conditional if 
signInButton.addEventListener("click", function()
{
const usernameEnter = prompt("Enter your username");
const passwordEnter = prompt("Enter your password");

const setUsername = localStorage.getItem("storedUsername");
const setPassword = localStorage.getItem("storedPassword");

if (usernameEnter === setUsername && passwordEnter === setPassword)
{
    overlay.style.display = "none";
    mainPage.style.display = "block";
    generateExpenseChart();
}
else
{
    alert("Error: Incorrect username or password entered");
}
});

const budgetForm = document.getElementById("budgetForm");
const budgetCategoryInput = document.getElementById("budgetCategory");
const budgetAmountInput = document.getElementById("budgetAmount");

let budgets = {};

budgetForm.addEventListener("submit", function (event)
{
    event.preventDefault();

    const category = budgetCategoryInput.value.trim();
    const amount = parseFloat(budgetAmountInput.value);

    if (!category || isNaN (amount) || amount <= 0)
    {
        alert("Error, please enter a valid category and amount value");
        return;
    }
    budgets [category] = amount;

    localStorage.setItem("budgets", JSON.stringify(budgets));
    alert (`Budget of $${amount.toFixed(2)} set for category "${category}".`);
    budgetForm.reset();

    const savedBudgets = localStorage.getItem("budgets");
    if (savedBudgets)
    {
        budgets = JSON.parse(savedBudgets);
    }

    displayBudgets();
});

function generateExpenseChart()
{
const chart = document.getElementById("expenseChart").getContext("2d");
const expenses = transactions.filter(t => t.type === "expenses");

const categoryTotals = {};
expenses.forEach(expense => {
    if (!categoryTotals[expense.category])
    {
        categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
});

const labels = Object.keys(categoryTotals);
const data = Object.values(categoryTotals);
const backgroundColors = labels.map((_, index) => {
    const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"];
    return colors [index % colors.length];
});
new Chart(chart, {
    type : "pie",
    data : 
    {
        labels : labels,
        datasets : 
        [{ 
            label : "Expense by Category",
            data : data,
             backgroundColor : backgroundColors,
        }]
    },
    options :
    {
        responsive : true,
        plugins : 
        {
            legend :
            {
                position : "bottom"
            },

            title : 
            {
                display : true,
                text : "Expense Pie",
                font :
                {
                    size : 18
                }
            }
        }
    }
});
}

function displayBudgets () 
{
    const budgetList = document.getElementById ("budgetList");
    budgetList.innerHTML = ""; // this clears the previous entry

    for (const category in budgets)
    {
        const li = document.createElement("li");
        li.textContent = `${category}: $${budgets[category].toFixed(2)}`;
        budgetList.appendChild(li);
    }
}

const transactionForm = document.getElementById("transactionform");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const typeInput = document.getElementById("type");
const transactionTable = document.getElementById("transactionTable");

let totalIncome = 0;
let totalExpense = 0;

const totalIncomeDisplay = document.getElementById("totalIncome");
const totalExpenseDisplay = document.getElementById("totalExpense");
const totalNetIncomeDisplay = document.getElementById("netIncome");

let transactions = [];

const storedTransactions = localStorage.getItem("transactions");
if (storedTransactions)
{
    transactions = JSON.parse(storedTransactions);
    transactions.forEach((transaction, index) => 
    { 
    addTransactionToTable(transaction, index);
    if (transaction.type === "income")
    {totalIncome += transaction.amount;}
    else if (transaction.type === "expenses")
    {totalExpense += transaction.amount;}
    
});

transactionTable.addEventListener("click", function (event)
{
    if (event.target.classList.contains("deleteBtn"))
    {
        const index = parseInt(event.target.getAttribute("data-index"));
        const removed = transactions.splice(index, 1)[0];

        if (removed.type === "income")
        {
            totalIncome -= removed.amount;
        }
        else if(removed.type === "expenses")
        {
            totalExpense -= removed.amount;
        }

        localStorage.setItem("transactions", JSON.stringify(transactions));

        refreshTransactionTable();

        updateTotals();
        generateExpenseChart();
    }
});

function refreshTransactionTable()
{
    transactionTable.innerHTML = "";
    transactions.forEach((transaction, index) => 
    {
        addTransactionToTable(transaction, index);
    });

}


const storedBudgets = localStorage.getItem("budgets");
if (storedBudgets)
{
    budgets = JSON.parse(storedBudgets);
    displayBudgets();
}

updateTotals();
}
function addTransactionToTable(transaction, index)
{
    const newRow = transactionTable.insertRow();
    newRow.innerHTML = `
    <td> $${transaction.amount.toFixed(2)}</td>
    <td>${transaction.category}</td>
    <td>${transaction.date}</td>
    <td><button class = "deleteBtn" data-index = "${index}">Delete</button></td>
    `;
}

function updateTotals()
{
    totalIncomeDisplay.textContent = `$${totalIncome.toFixed(2)}`;
    totalExpenseDisplay.textContent = `$${totalExpense.toFixed(2)}`;
    totalNetIncomeDisplay.textContent = `$${(totalIncome - totalExpense).toFixed(2)}`;
}

// variables to store input values
transactionForm.addEventListener("submit", function(event)
{
    event.preventDefault();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const type = typeInput.value;
    const date = new Date().toLocaleDateString();

    if (isNaN (amount) || amount <= 0 || !category)
    {
        alert ("Error, you must choose a valid amount or category");
        return;
    }

    const transaction = {amount, category, type, date};
    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    if (type === "income")
    {
        totalIncome += amount;
    }
    else if (type === "expenses")
    {
        totalExpense += amount;
    }

    addTransactionToTable(transaction, index);
    transactionForm.reset();
    updateTotals();
    generateExpenseChart();
});



})