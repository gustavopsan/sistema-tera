const expenseDescription = document.getElementById('expenseDescription');
const expenseValue = document.getElementById('expenseValue');
const expenseDate = document.getElementById('expenseDate');

async function createExpense() {
    const requestBody = JSON.stringify({
        description: expenseDescription.value,
        value: parseFloat(expenseValue.value),
        date: new Date(expenseDate.value).toISOString(),
        sellerId: sellerId
    })

    const requestData = await fetch(
        `${BASEPATH}/expense/create`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        }
    );

    let response = await requestData.json();

    if (response._id) {
        expenseDescription.value = '';
        expenseValue.value = '';
        expenseDate.value = '';
    }
}