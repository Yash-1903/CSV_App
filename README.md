"CSV File Upload and Parsing with Background Jobs in Next.js"

Project Description

This Next.js application allows users to upload CSV files containing user data. Upon upload, the server parses the CSV file, validates the data, and then uses a background job queue (Bull with Redis) to process each row. For each valid row, a background job is created to send an API request to an external service (simulated in this example using jsonplaceholder) to add a user based on the data from the CSV row.

This project demonstrates file handling, background job processing, API interactions, and basic UI development in a Next.js environment. It's designed to be run on Windows, macOS, Linux, or any OS that can support Node.js, npm, and Redis.

Objectives:

-> Interact with an external API to add users based on data parsed from CSV files.
-> Implement background processing for API requests to avoid blocking the main application thread.
-> Ensure basic validation of the input CSV data (presence of required fields, email format).
-> Provide a simple and interactive user interface for file uploads and status feedback.

Recommended Libraries Used:

-> Next.js: React framework for building web applications.
-> multer: For handling multipart/form-data for file uploads.
-> csv-parser: For efficient parsing of CSV files.
-> bull: For creating and managing a robust job queue using Redis.
-> axios: For making HTTP POST requests to the external API.
-> redis: For the Bull job queue backend.
-> dotenv: For managing environment variables.

Prerequisites:

Before running this application, ensure you have the following installed:

-> Node.js (version 18 or later recommended)
-> npm 
-> Redis Server: https://redis.io/docs/install/ - Follow the installation instructions for your operating system. Make sure Redis server is running on the default port 6379 or configure accordingly.

Installation and Setup:

-> Clone the repository: If you have a repository, clone it to your local machine:

-> Bash:

git clone [your-repository-url]
cd csv-upload-app


-> Install npm dependencies:

Bash

npm install

-> Set up Environment Variables:

-> Create a file named .env.local in the root directory of your project.

-> Add the following environment variables to .env.local. Important: Replace https://jsonplaceholder.typicode.com/users with your actual API endpoint for adding users if you are not just testing with a mock API.

-> Optional: Override Redis URL if your Redis server is not on localhost:6379
-> REDIS_URL=redis://your-redis-host:your-redis-port

-> Set your actual API endpoint here (replace the placeholder)
-> API_ENDPOINT=[https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)

-> Start Redis Server: Ensure your Redis server is running. If you installed Redis locally using default settings, it should be running on localhost:6379.

-> Running the Application
Start the Next.js Development Server:

-> Open a terminal in your project directory and run:

Bash:
npm run dev
This will start the Next.js development server, typically on http://localhost:3000.

-> Start the Background Worker:

-> Open a new terminal in your project directory and run the worker script:

Bash:
npm run worker:dev
or

Bash:
node worker.js

-> You should see the message User queue worker started in the terminal. Keep this terminal running.

-> Access the Frontend:

-> Open your web browser and go to http://localhost:3000. You should see the "CSV File Upload" UI.

Testing the Application:

-> Create a Sample CSV File: Create a CSV file (e.g., users.csv) with columns "name" and "email". Example content:

name,email
John Doe,john.doe@example.com
Jane Smith,jane.smith@example.com
Invalid User,invalid-email-format # Row with invalid email
Missing Name,,valid@email.com      # Row with missing name
Upload the CSV File:

-> In your browser at http://localhost:3000, use the file input to select your users.csv file.
Click the "Upload CSV" button.

Observe Feedback:

-> Frontend: You should see a status message indicating success or failure, and any validation errors if present.
Worker Terminal: Check the terminal where you started worker.js. You should see logs indicating:
"Users being processed."

-> Success or failure messages for API requests (if using a real API or jsonplaceholder mock).
-> Error messages if API requests fail or for CSV validation issues.
-> Verify API Calls (if using a real API): If you are using a real external API (and not jsonplaceholder), check your API logs or data to confirm that successful user creation requests were made. With jsonplaceholder, you can observe the successful HTTP status codes in the worker logs, but no actual data is persisted.
