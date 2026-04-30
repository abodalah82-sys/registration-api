const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 Connection String (راح نعبيه لاحقًا من Azure)
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

sql.connect(dbConfig).then(pool => {
    console.log("Connected to DB 🚀");

    app.post('/api/register', async (req, res) => {
        try {
            const { fullName, address, phone } = req.body;

            await pool.request()
                .input('FullName', sql.NVarChar, fullName)
                .input('Address', sql.NVarChar, address)
                .input('Phone', sql.VarChar, phone)
                .query(`
                    INSERT INTO Users (FullName, Address, Phone)
                    VALUES (@FullName, @Address, @Phone)
                `);

            res.json({ message: "Saved ✅" });

        } catch (err) {
            console.log(err);
            res.status(500).send("Error");
        }
    });

}).catch(err => console.log(err));

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running 🚀");
});