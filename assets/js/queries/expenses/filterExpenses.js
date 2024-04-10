const filterButton = document.getElementById('filter');
const resetButton = document.getElementById('clear');

function formateAMerdaDaData(data) {
    let newArr = data.split("-"); 
    return `${newArr[2]}/${newArr[1]}/${newArr[0]}`
}

console.log(new Date().toISOString())

var initialDate;
var finalDate;

function handleInitialDateChange(event) {
    initialDate = new Date(event.target.value).toISOString();
}

function handleFinalDateChange(event) {
    var newDate = new Date(event.target.value);
    newDate.setHours(23, 59, 59);
    
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

    console.log(response)
}

filterButton.addEventListener('click', () => {
    filterExpenses(initialDate, finalDate);
});