const fs = require('fs');

const inputFile = 'src/database/removed/day_sabor_csv.csv';
const outputFile = 'src/database/ready/day_sabor_csv.csv';

function addQuoteToLines() {
    // Read the file line by line
    const fileContent = fs.readFileSync(inputFile, 'utf8');
    const lines = fileContent.split('\n');

    // Add a quote at the beginning of each line
    const modifiedLines = lines.map(line => `"${line}`);

    // Write the modified lines to the output file
    fs.writeFileSync(outputFile, modifiedLines.join('\n'), 'utf8');
    console.log(`Added " to the beginning of each line. Saved to ${outputFile}`);
}

addQuoteToLines();
