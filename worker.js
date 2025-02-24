import Bull from 'bull';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const userQueue = new Bull('user-queue', process.env.REDIS_URL || 'redis://127.0.0.1:6379');

const API_ENDPOINT = process.env.API_ENDPOINT || 'https://jsonplaceholder.typicode.com/users'; // Replace with your actual API endpoint

userQueue.process(async (job) => {
    const { userData } = job.data;
    console.log(`Processing user: ${userData.name}, ${userData.email}`);

    try {
        // Simulate API request to add user
        const response = await axios.post(API_ENDPOINT, userData);

        if (response.status === 201 || response.status === 200) { // Assuming 201 or 200 is success
            console.log(`User ${userData.name} added successfully. API Response Status: ${response.status}`);
            return { status: 'success', apiResponse: response.data }; // Return success information
        } else {
            const errorMessage = `API request failed for user ${userData.name}. Status: ${response.status}, Data: ${JSON.stringify(response.data)}`;
            console.error(errorMessage);
            throw new Error(errorMessage); // Throw error to retry job
        }
    } catch (error) {
        console.error('Error processing job:', error);
        // You might want to handle different types of errors and possibly retry or fail jobs
        throw error; // Re-throwing error will trigger job retry based on Bull's retry mechanism
    }
});

console.log('User queue worker started');