const fs = require('fs');
const csv = require('csv-parser');
const { Pool } = require('pg');

// PostgreSQL connection configuration
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sabor_db',
    password: 'admin',
    port: 5432,
});

// Function to insert data into the database
async function insertData(row) {

    const query = `INSERT INTO oct_dec (report_date, category, item, qty, price_point_name, modifiers_applied, location, dining_option, count, channel) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

    try {
        await pool.query(query, [`${row['Date']}`, `${row['Category']}`, `${row['Item']}`, `${row['Qty']}`, `${row['Price Point Name']}`, `${row['Modifiers Applied']}`, `${row['Location']}`, `${row['Dining Option']}`, `${row['Count']}`, `${row['Channel']}`]);
    } catch (err) {
        console.error('Error inserting data:', err);
    }
}

// Read and process the CSV file
const filePath = 'src/database/1-3 months/oct-dec-items-2024-10-01-2025-01-01.csv';

(async () => {
    const insertPromises = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            // Collect insert promises for each row
            const promise = insertData(row);
            insertPromises.push(promise);
        })
        .on('end', async () => {
            console.log('CSV file fully processed. Waiting for database operations to complete...');
            try {
                // Wait for all insert operations to complete
                await Promise.all(insertPromises);
                console.log('All data inserted. Closing database connection.');
                await pool.end();
            } catch (error) {
                console.error('Error during database operations:', error);
            }
        })
        .on('error', (error) => {
            console.error('Error processing CSV:', error);
        });
})();
