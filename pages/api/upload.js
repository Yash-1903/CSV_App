import multer from 'multer';
import csvParser from 'csv-parser';
import Bull from 'bull';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env.local

// Configure multer for file upload
const storage = multer.memoryStorage(); // Store file in memory for processing
const upload = multer({ storage: storage });

// Initialize Bull queue
const userQueue = new Bull('user-queue', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export const config = {
    api: {
        bodyParser: false, // Disable default body parser to handle multipart/form-data
    },
};

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    upload.single('csvFile')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const results = [];
        const bufferStream = Readable.from(req.file.buffer); // Convert buffer to stream

        bufferStream
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    // Validate CSV data (example: check for 'name' and 'email')
                    for (const row of results) {
                        if (!row.name || !row.email) {
                            return res.status(400).json({ message: 'CSV Validation Error: Missing "name" or "email" in a row.' });
                        }
                        if (!row.email.includes('@')) { // Basic email validation
                            return res.status(400).json({ message: 'CSV Validation Error: Invalid email format in a row.' });
                        }
                    }

                    // Add jobs to the queue for each row in CSV
                    for (const row of results) {
                        await userQueue.add({ userData: row });
                    }

                    res.status(200).json({ message: 'CSV file processed and jobs added to queue', rowCount: results.length });
                } catch (error) {
                    console.error('CSV Processing Error:', error);
                    res.status(500).json({ message: 'CSV processing failed', error: error.message });
                }
            })
            .on('error', (error) => {
                console.error('CSV Parsing Error:', error);
                return res.status(500).json({ message: 'CSV parsing error', error: error.message });
            });
    });
}