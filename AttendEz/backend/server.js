const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const client = new MongoClient(process.env.MONGO_URI);
client.connect();

const db = client.db(process.env.DB_NAME);
const attendanceCollection = db.collection('attendance');

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Attendance Backend is Running...');
});

app.post('/submit-attendance', async (req, res) => {
    try {
        console.log("Received Request Body:", req.body);

        const { date, subject, section, students } = req.body;

        if (!date || !subject || !section || !students || !Array.isArray(students)) {
            return res.status(400).json({ error: "Invalid request format" });
        }

        const attendanceData = {
            date,
            subject,
            section,  // Store section in MongoDB
            students
        };

        const result = await db.collection('attendance').insertOne(attendanceData);

        res.json({ message: "Attendance recorded successfully!", insertedId: result.insertedId });

    } catch (error) {
        console.error("Error saving attendance:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



app.get('/get-attendance', async (req, res) => {
    try {
        const { rollNumber } = req.query; // Get roll number from frontend

        if (!rollNumber) {
            return res.status(400).json({ error: "Roll number is required" });
        }

        const attendanceData = await db.collection('attendance').find({
            "students.rollNumber": rollNumber
        }).toArray();

        res.json(attendanceData);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});