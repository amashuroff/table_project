
const url = 'small_data_persons.json';
const inputBox = document.getElementById('input-box');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');

makeTable(url);

async function makeTable(url) {
    let response = await fetch(url);
    let personData = await response.json();
    
    // внедрить json данные в table
    loadTableData(personData);
    
    // добавить sorting algorithm к table
    addSortingListeners();

    // добавить filtering algorithm к input box
    addFilterListener(personData);
};

function loadTableData(personData) {
    
    let dataHTML = '';
    
    // iterate over personData, extract objects values, append vals to TD --> TR
    for (let person of personData) {
        let name = person.Name.split(' ')[0];
        let surname = person.Name.split(' ')[1];
        let age = person.Age;
        dataHTML += `<tr><td>${age}</td><td>${name}</td><td>${surname}</td><td>${person.ID}</td></tr>`;
    }
    tableBody.innerHTML = dataHTML;
};

function sortTableByColumn(tableBody, column, ascending = true) {
    /**
     * 
     * @param {HTMLTableElement} tableBody, the tableBody element to sort 
     * @param {number} column, the index of the column to sort
     * @param {boolean} ascending, if sorting in ascending order 
     */

    // bool to number
    const dirModifier = ascending ? 1 : -1;
    // make an array of TR elements
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    // sort each element in the array by column (comparing 2 TR elements by their TD's text content)
    const sortedRows = rows.sort((a, b) => {
        // selecting text content of the row's TD, based on the column
        const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent;
        const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent;
       
       // if ascending is set to true, sort from low to high,
       // if !ascending(descending), sort from high to low.
        return aColText > bColText ? (dirModifier) : (dirModifier * -1);
        
    });

    // remove all existing TR's 
    while(tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild)
    };
    
    // re-add all new sorted rows
    tableBody.append(...sortedRows);

    // clear all applied classes, which may have been previously added to TH (uses global var tableHead)
    tableHead.querySelectorAll('th').forEach(th => th.classList.remove('ascending-th', 'descending-th'));

    // add ascending class when TH sorted in ascending order or otherwise
    tableHead.querySelector(`th:nth-child(${column + 1})`).classList.toggle('ascending-th', ascending);
    tableHead.querySelector(`th:nth-child(${column + 1})`).classList.toggle('descending-th', !ascending);
};

function addSortingListeners() {
    // add event listeners to each TH
    document.querySelectorAll('.sortable-table th').forEach(header => {

        header.addEventListener('click', () => {
            // clicked TH's index will serve as a column number
            const headerIndex = Array.prototype.indexOf.call(header.parentElement.children, header);
            // check if (column) is currently in ascending order
            const currentlyAscending = header.classList.contains('ascending-th');
            // if (column) is in ascending order, sort it in descending order and otherwise (if currentlyAscending === true, pass false)
            sortTableByColumn(tableBody, headerIndex, !currentlyAscending);
        })
    })
};

function filterTable(personData) { 
    // set an empty array to store filtered data (objects)
    let filteredData = [];
    // uses global inputBox var
    let inputData = inputBox.value.toLowerCase();
    
    for (let person of personData) {
        // iterate over objects in the array
        let name = person.Name.split(' ')[0].toLowerCase();
        let surname = person.Name.split(' ')[1].toLowerCase();
        let age = person.Age;

        // check if some of the parameters include input data
        if (name.includes(inputData) || surname.includes(inputData) || age.includes(inputData)) {

            filteredData.push(person);
        };
    }
    return filteredData
};

function addFilterListener(personData) {

    inputBox.addEventListener('keyup', function() {
        
        let data = filterTable(personData);
        // insert a new table using filtered array of objects
        loadTableData(data);

    } )
};