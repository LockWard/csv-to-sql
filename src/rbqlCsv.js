const fs = require('fs');
const rbql = require('rbql');

const inputFile = 'src/database/testing/day_sabor_csv.csv'; // Input CSV file
const outputFile = 'src/database/rbql/day_sabor_csv.csv'; // Output CSV file

// const columnsToRemove = ['Time', 'Time Zone', 'SKU', 'Gross Sales', 'Discounts', 'Net Sales', 'Tax', 'Transaction ID', 'Payment ID', 'Device Name', 'Notes', 'Details', 'Event Type', 'Customer ID', 'Customer Name', 'Customer Reference ID', 'Unit', 'Itemization Type', 'Commission', 'Employee', 'Fulfillment Note', 'Token']; // Columns to remove

async function processCSV() {
    try {
        // Read the CSV file
        const csvContent = fs.readFileSync(inputFile, 'utf8');

        // Split the content into lines
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',');

        // Determine columns to keep
        // Convert to RBQL column notation (e.g., a1, a2)
        const selectedColumns = headers
        .map((header, index) => ({ header, index }))
        .filter(({ header }) => !columnsToRemove.includes(header))
        .map(({ index }) => `a${index + 1}`); 

        // Build the RBQL query
        const query = `SELECT ${selectedColumns.join(', ')}`;
        // const query = 'SELECT a1, a4, a5, a6, a7, a9, a20, a21, a26, a31'

        let warnings = [];
        
        let success_handler = function() {
            console.log('warnings: ' + JSON.stringify(warnings));
            console.log('output table: ' + JSON.stringify(outputFile));
        }
        
        let error_handler = function(exception) {
            console.log('Error: ' + String(exception));
        }
        
        // Run the RBQL query
        await rbql.query_csv(query, inputFile, ',', 'quoted', outputFile, ',', 'quoted', 'utf-8', warnings, false).then(success_handler).catch(error_handler);
        
    } catch (error) {
        console.error('Error processing CSV:', error);
    }
}

processCSV();
