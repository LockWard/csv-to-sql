const fs = require('fs');
const csv = require('csv-parser');

const expectedColumns = 32;

const inputFile = 'src/database/testing/day_sabor_csv.csv';
const outputFile = 'src/database/parse/day_sabor_csv.csv';

const writeStream = fs.createWriteStream(outputFile);
// writeStream.write('Date,Category,Item,Qty,Price Point Name,Modifiers Applied,Location,Dining Option,Count,Channel/n');
writeStream.write('Date,Time,Time Zone,Category,Item,Qty,Price Point Name,SKU,Modifiers Applied,Gross Sales,Discounts,Net Sales,Tax,Transaction ID,Payment ID,Device Name,Notes,Details,Event Type,Location,Dining Option,Customer ID,Customer Name,Customer Reference ID,Unit,Count,Itemization Type,Commission,Employee,Fulfillment Note,Channel,Token\n');

fs.createReadStream(inputFile)
    .pipe(csv())
    .on('data', (row) => {
        // Check if the row has the expected number of columns
        if (Object.keys(row).length === expectedColumns) {
            // Rebuild the row as a CSV line
            const cleanedRow = Object.values(row).join(',');
            writeStream.write(`${cleanedRow}\n`);
        } else {
            console.warn('Skipping broken row:', row);
        }
    })
    .on('end', () => {
        console.log(`Finished processing. Cleaned file saved to ${outputFile}`);
    })
    .on('error', (error) => {
        console.error('Error reading the CSV file:', error);
    });