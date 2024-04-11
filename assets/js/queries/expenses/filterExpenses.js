const filterButton = document.getElementById('filter');
const resetButton = document.getElementById('clear');

function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

var initialDate;
var finalDate;

function handleInitialDateChange(event) {
    initialDate = new Date(event.target.value).toISOString();
}

function handleFinalDateChange(event) {
    var newDate = new Date(event.target.value);
    newDate.setHours(newDate.getHours() + 23, 59, 59);  
    
    finalDate = newDate.toISOString();
}

async function filterExpenses(initialDate, finalDate){
    const expenses = await fetch(
        `${BASEPATH}/expense/filter`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                initialDate: initialDate,
                finalDate: finalDate,
                sellerId: sellerId
            })
        }
    );

    let response = await expenses.json();

    expenseList.innerHTML = "";

    response.forEach(expense => {
        var newExpense;
        var date = expense.date.split('T')[0];

        newExpense = `
            <tr>
                <td>${expense.description}</td>
                <td>R$ ${expense.value}</td>
                <td>${formateAMerdaDaData(date)}</td>
                <td>
                    <button class="expense-button" data-expense-id="${expense._id}">
                        <img src="/assets/img/x.svg">
                    </button>
                </td>
            </tr>
        `;

        expenseList.innerHTML += newExpense;
    })

    resetButton.style.display = 'flex';
    addEevents();
}

filterButton.addEventListener('click', () => {
    filterExpenses(initialDate, finalDate);
});

resetButton.addEventListener('click', () => {
    initialDate = new Date().toISOString();
    finalDate = new Date().toISOString();
    listExpenses();
    resetButton.style.display = 'none';
})