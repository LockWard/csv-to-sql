const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'sabor_db'
});

try {
    connection.connect();
    console.log('Connected to the database!');
} catch (error) {
    console.log('Error connecting to the database: ', error);
}

// Function to insert data into the SQL table
const insertData = (data) => {

    const sql = 'INSERT INTO report (report_date, category, item, qty, price_point_name, modifiers_applied, notes, location, dining_option, count, channel) VALUES ?';

    const values = data.map(row => [`${row['Date']}`, `${row['Category']}`, `${row['Item']}`, `${row['Qty']}`, `${row['Price Point Name']}`, `${row['Modifiers Applied']}`, `${row['Notes']}`, `${row['Location']}`, `${row['Dining Option']}`, `${row['Count']}`, `${row['Channel']}`]);

    connection.query(sql, [values], (err, result) => {
        if (err) throw err;
        console.log('Data inserted:', result.affectedRows);
    });
};

const filePath = 'src/database/week_sabor_csv.csv';

// Read the CSV file and parse the data
const results = [];
fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        insertData(results);
        // Close the database connection
        connection.end();
    });
