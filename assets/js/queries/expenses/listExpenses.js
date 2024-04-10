const expenseList = document.getElementById('expenseList');

function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

async function listExpenses() {
    const expenses = await fetch(
        `${BASEPATH}/expense/list`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
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
}

window.addEventListener('load', listExpenses);