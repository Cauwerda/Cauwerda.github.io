/*
File: script.js
GUI Assignment: HW4
Charlie Auwerda
charles_auwerda@student.uml.edu
Copyright (c) 2023 by Charlie Auwerda. All rights reserved. May be freely copied or
excerpted for educational purposes with credit to the author.
updated by CA on December 04, 2023
*/

$(document).ready(function() {
    var showErrorMessages = false;  // Flag to control error message display
    // jQuery Validation for the form
    var validator = $('#tableForm').validate({
        rules: {
            multiplierStart: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            multiplierEnd: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            multiplicandStart: {
                required: true,
                number: true,
                min: -50,
                max: 50
            },
            multiplicandEnd: {
                required: true,
                number: true,
                min: -50,
                max: 50
            }
        },
        messages: {
            multiplierStart: {
                required: "Please enter a starting multiplier",
                number: "Please enter a valid number",
                min: "Value must be between -50 and 50",
                max: "Value must be between -50 and 50"
            },
        },
                submitHandler: function(form) {
            // Logic to handle the form submission
            // This function is called only when the form is valid
            const multiplierStart = parseInt($('#multiplierStart').val(), 10);
            const multiplierEnd = parseInt($('#multiplierEnd').val(), 10);
            const multiplicandStart = parseInt($('#multiplicandStart').val(), 10);
            const multiplicandEnd = parseInt($('#multiplicandEnd').val(), 10);
            
            // Call function to generate table
            generateTable(multiplierStart, multiplierEnd, multiplicandStart, multiplicandEnd);
        },
        errorClass: 'error',
        errorElement: 'label',
        errorPlacement: function(error, element) {
            error.insertBefore(element);
        },
        highlight: function(element, errorClass) {
            $(element).addClass(errorClass);
        }
    });
// Function to generate multiplication table
function generateTable(mStart, mEnd, pStart, pEnd) {
  const tableContainer = document.getElementById('tableOutput');
  // Error handling if the table container is not found
  if (!tableContainer) {
    console.error('Table container not found.');
    return;
  }

  tableContainer.innerHTML = ''; // Clear any existing table

  // Check for excessively large tables to prevent performance issues
  if ((mEnd - mStart) * (pEnd - pStart) > 10000) {
    const errorContainer = document.getElementById('error-message');
    errorContainer.textContent = 'The requested table is too large and may cause performance issues.';
    return;
  }

  // Table creation logic
  const table = document.createElement('table');
  const thead = table.createTHead();
  const tbody = table.createTBody();

  // Header row creation with empty top-left cell
  const headerRow = thead.insertRow();
  headerRow.appendChild(document.createElement('th'));

  // Fill in the multiplier header row
  for (let i = mStart; i <= mEnd; i++) {
    let th = document.createElement('th');
    th.textContent = i;
    headerRow.appendChild(th);
  }

  // Fill in the multiplicand header column and table body
  for (let i = pStart; i <= pEnd; i++) {
    let row = tbody.insertRow();
    let headerCell = document.createElement('th');
    headerCell.textContent = i;
    row.appendChild(headerCell);

    for (let j = mStart; j <= mEnd; j++) {
      let cell = row.insertCell();
      cell.textContent = i * j;
    }
  }

}

// Function to highlight operands and their product in the table
function highlightOperands() {
    // Logic to clear existing highlights
    document.querySelectorAll('.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
    document.querySelectorAll('.highlightproduct').forEach(cell => {
        cell.classList.remove('highlightproduct');
    });

    // Retrieve operand values and result element
    let operand1 = parseInt(document.getElementById('operand1').value, 10);
    let operand2 = parseInt(document.getElementById('operand2').value, 10);
    let resultElement = document.getElementById('result');
    let table = document.getElementById('multTable');
    let errorContainer = document.getElementById('errorContainer'); // Make sure you have a container with this ID

    // Clear error message
    errorContainer.textContent = '';

    // Highlight logic
    if (!isNaN(operand1) && !isNaN(operand2) && table) {
        let isOperand1InRange = [...table.rows].some(row => parseInt(row.cells[0].textContent) === operand1);
        let isOperand2InRange = [...table.rows[0].cells].some(cell => parseInt(cell.textContent) === operand2);

        if (isOperand1InRange && isOperand2InRange) {
             resultElement.textContent = `${operand1} * ${operand2} = ${operand1 * operand2}`;

            // Finding the row and column to highlight
            let rowIndex = [...table.rows].findIndex(row => parseInt(row.cells[0].textContent) === operand1);
            let colIndex = [...table.rows[0].cells].findIndex(cell => parseInt(cell.textContent) === operand2);

            // Highlighting logic for row and column
            if (rowIndex !== -1) {
                [...table.rows[rowIndex].cells].forEach(cell => cell.classList.add('highlight'));
            }

            for (let i = 0; i < table.rows.length; i++) { 
                if (colIndex !== -1 && table.rows[i].cells[colIndex]) {
                    table.rows[i].cells[colIndex].classList.add('highlight');
                }
            }

            // Highlight the intersecting cell
            if (rowIndex !== -1 && colIndex !== -1) {
                let intersectingCell = table.rows[rowIndex].cells[colIndex];
                if (intersectingCell) {
                    intersectingCell.classList.add('highlightproduct');
                }
            }
        } else {
            // Display error if operands are not in the table range
            errorContainer.textContent = 'Please enter numbers within the table range.';
            resultElement.value = ''; // Clear the result
        }
    } else {
        resultElement.value = ''; // Clear the result in case of invalid input
    }
}
});