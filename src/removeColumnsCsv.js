const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'src/database/testing/day_sabor_csv.csv';
const outputFile = 'src/database/removed/day_sabor_csv.csv';

const columnsToRemove = ['Time', 'Time Zone', 'SKU', 'Gross Sales', 'Discounts', 'Net Sales', 'Tax', 'Transaction ID', 'Payment ID', 'Device Name', 'Notes', 'Details', 'Event Type', 'Customer ID', 'Customer Name', 'Customer Reference ID', 'Unit', 'Itemization Type', 'Commission', 'Employee', 'Fulfillment Note', 'Token']; // Array of columns to remove

const writeStream = fs.createWriteStream(outputFile);

fs.createReadStream(inputFile)
    .pipe(csv())
    .on('headers', (headers) => {
        // Filter out the columns to remove
        const filteredHeaders = headers.filter((header) => !columnsToRemove.includes(header));
        // Write the filtered headers to the output file
        writeStream.write(filteredHeaders.join(',') + '\n');
    })
    .on('data', (row) => {
        // Remove the unwanted columns
        const filteredRow = Object.keys(row)
            .filter((key) => !columnsToRemove.includes(key))
            .map((key) => row[key]);
        // Write the filtered row to the output file
        writeStream.write(filteredRow.join(',') + '\n');
    })
    .on('end', () => {
        console.log(`Columns "${columnsToRemove.join(',')}" removed. Cleaned file saved to ${outputFile}`);
    })
    .on('error', (error) => {
        console.error('Error:', error);
    });