// Handle form submission
document.getElementById('tableForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Retrieve values
  const multiplierStart = parseInt(document.getElementById('multiplierStart').value, 10);
  const multiplierEnd = parseInt(document.getElementById('multiplierEnd').value, 10);
  const multiplicandStart = parseInt(document.getElementById('multiplicandStart').value, 10);
  const multiplicandEnd = parseInt(document.getElementById('multiplicandEnd').value, 10);
  
  // Validate inputs and generate table if valid
  if (validateInputs(multiplierStart, multiplierEnd, multiplicandStart, multiplicandEnd)) {
    generateTable(multiplierStart, multiplierEnd, multiplicandStart, multiplicandEnd);
  }
});

document.getElementById('operand1').addEventListener('input', highlightOperands);
document.getElementById('operand2').addEventListener('input', highlightOperands);
document.getElementById('highlightBtn').addEventListener('click', highlightOperands);

// Validate inputs
function validateInputs(mStart, mEnd, pStart, pEnd) {
  const errorContainer = document.getElementById('error-message');
  if (!errorContainer) {
    console.error('Error container not found.');
    return false;
  }
  
  // Check if inputs are numbers
  if (isNaN(mStart) || isNaN(mEnd) || isNaN(pStart) || isNaN(pEnd)) {
    errorContainer.textContent = 'Please enter valid numbers.';
    return false;
  }

  // Check if start values are less than or equal to end values
  if (mStart > mEnd || pStart > pEnd) {
    errorContainer.textContent = 'Start values must be less than or equal to end values.';
    return false;
  }

  // Check for range limits
  if (mStart < -50 || mEnd > 50 || pStart < -50 || pEnd > 50) {
    errorContainer.textContent = 'Values must be between -50 and 50.';
    return false;
  }

  // Clear any previous errors
  errorContainer.textContent = '';
  return true;
}

// Generate multiplication table
function generateTable(mStart, mEnd, pStart, pEnd) {
	const tableContainer = document.getElementById('tableOutput');
	if (!tableContainer) {
		console.error('Table container not found.');
		return;
	}

	tableContainer.innerHTML = ''; // Clear any existing table

	// Check for excessively large tables which may cause performance issues
	if ((mEnd - mStart) * (pEnd - pStart) > 10000) {
		const errorContainer = document.getElementById('error-message');
		errorContainer.textContent = 'The requested table is too large and may cause performance issues.';
		return;
	}

	const table = document.createElement('table');
	const thead = table.createTHead();
	const tbody = table.createTBody();

	// Create header row with empty top-left cell
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

	tableContainer.appendChild(table);
	table.setAttribute('id', 'multTable'); // Assign an ID to your table
	tableContainer.appendChild(table);
	highlightOperands();
}

function highlightOperands() {
    // Clear existing highlights
    document.querySelectorAll('.highlight').forEach(cell => {
        cell.classList.remove('highlight');
    });
    document.querySelectorAll('.highlightproduct').forEach(cell => {
        cell.classList.remove('highlightproduct');
    });

    let operand1 = parseInt(document.getElementById('operand1').value, 10);
    let operand2 = parseInt(document.getElementById('operand2').value, 10);
    let resultElement = document.getElementById('result');
    let table = document.getElementById('multTable');
    let errorContainer = document.getElementById('errorContainer'); // Make sure you have a container with this ID

    errorContainer.textContent = '';

    if (!isNaN(operand1) && !isNaN(operand2) && table) {
        let isOperand1InRange = [...table.rows].some(row => parseInt(row.cells[0].textContent) === operand1);
        let isOperand2InRange = [...table.rows[0].cells].some(cell => parseInt(cell.textContent) === operand2);

        if (isOperand1InRange && isOperand2InRange) {
             resultElement.textContent = `${operand1} * ${operand2} = ${operand1 * operand2}`;

            let rowIndex = [...table.rows].findIndex(row => parseInt(row.cells[0].textContent) === operand1);
            let colIndex = [...table.rows[0].cells].findIndex(cell => parseInt(cell.textContent) === operand2);

            // Highlight row (Operand 1)
            if (rowIndex !== -1) {
                [...table.rows[rowIndex].cells].forEach(cell => cell.classList.add('highlight'));
            }

            // Highlight column (Operand 2)
            for (let i = 0; i < table.rows.length; i++) { // Start at 1 to skip header row
                if (colIndex !== -1 && table.rows[i].cells[colIndex]) {
                    table.rows[i].cells[colIndex].classList.add('highlight');
                }
            }

            // Highlight intersecting cell
            if (rowIndex !== -1 && colIndex !== -1) {
                let intersectingCell = table.rows[rowIndex].cells[colIndex];
                if (intersectingCell) {
                    intersectingCell.classList.add('highlightproduct');
                }
            }
        } else {
            // If operands are not in the range, display an error
            errorContainer.textContent = 'Please enter numbers within the table range.';
            resultElement.value = ''; // Clear the result
        }
    } 
	else{
        resultElement.value = ''; // Clear the result
    }
}