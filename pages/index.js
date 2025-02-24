import { useState } from 'react';

export default function HomePage() {
    const [file, setFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false); // State to track uploading state

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setUploadStatus(''); // Clear previous status on new file selection
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setUploadStatus('Please select a CSV file.');
            return;
        }

        setIsUploading(true); // Start uploading state
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadStatus(`Upload successful! Processed ${data.rowCount} rows.`);
            } else {
                setUploadStatus(`Upload failed. ${data.message || 'An error occurred.'}`);
                console.error('Upload error:', data);
            }
        } catch (error) {
            setUploadStatus('Upload failed. Could not connect to server.');
            console.error('Fetch error:', error);
        } finally {
            setIsUploading(false); // End uploading state, regardless of success or failure
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>CSV File Upload</h1>
            <div style={styles.uploadCard}>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label htmlFor="csvFile" style={styles.fileLabel}>
                        {file ? file.name : 'Choose a CSV file'}
                    </label>
                    <input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={styles.fileInput}
                    />
                    <button
                        type="submit"
                        disabled={!file || isUploading}
                        style={isUploading ? styles.uploadButtonDisabled : styles.uploadButton}
                    >
                        {isUploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </form>
                {uploadStatus && <p style={styles.statusMessage}>{uploadStatus}</p>}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f4f7fa', // Light background
        minHeight: '100vh',
    },
    heading: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    uploadCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.05)', // Soft shadow
        width: '80%',
        maxWidth: '600px',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'stretch',
    },
    fileLabel: {
        padding: '12px 16px',
        border: '2px dashed #bbb',
        borderRadius: '8px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: '#eee',
        color: '#555',
        transition: 'background-color 0.2s ease',
        ':hover': {
            backgroundColor: '#ddd',
        },
    },
    fileInput: {
        display: 'none', // Hide default file input
    },
    uploadButton: {
        backgroundColor: '#007bff', // Primary blue
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        ':hover': {
            backgroundColor: '#0056b3', // Darker blue on hover
        },
    },
    uploadButtonDisabled: {
        backgroundColor: '#6c757d', // Grey for disabled state
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'not-allowed',
        fontSize: '1em',
        fontWeight: 'bold',
    },
    statusMessage: {
        marginTop: '20px',
        padding: '10px 15px',
        borderRadius: '8px',
        backgroundColor: '#e0f7fa', // Very light cyan background for messages
        borderColor: '#b2ebf2',
        borderWidth: '1px',
        borderStyle: 'solid',
        color: '#333',
    },
};