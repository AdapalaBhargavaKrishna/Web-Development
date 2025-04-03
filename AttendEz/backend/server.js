const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ObjectId } = require('mongodb');

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

app.post('/submit-announcement', async (req, res) => {
    try {
        console.log("Received Request Body:", req.body);

        const { date, subject, section, message } = req.body;

        if (!date || !subject || !section || !message) {
            return res.status(400).json({ error: "All fields are required: date, subject, section, message" });
        }

        const announcementData = {
            date,
            subject,
            section,
            message
        };

        const announcement = await db.collection('announcements').insertOne(announcementData);

        res.json({ message: "Announcement added successfully!", insertedId: announcement.insertedId }); // ✅ Fixed success message

    } catch (error) {
        console.error("Error posting announcement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get('/get-announcements', async (req, res) => {
    try {
        const announcements = await db.collection('announcements').find().toArray();
        res.json(announcements);
    } catch (error) {
        console.error("Error fetching announcements:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.delete('/delete-announcement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!ObjectId.isValid(id)) {  // ✅ Validate ObjectId
            return res.status(400).json({ error: "Invalid announcement ID" });
        }

        const result = await db.collection('announcements').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Announcement not found" });
        }

        res.json({ message: "Announcement deleted successfully!" });
    } catch (error) {
        console.error("Error deleting announcement:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});