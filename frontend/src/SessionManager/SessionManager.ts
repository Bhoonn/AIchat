import axios from "axios";

let sessionId: string | null = null;

const SessionManager = {
    startSession: async () => {
        try {
            const response = await axios.post("http://localhost:5000/start_session");
            sessionId = response.data.session_id;
            return sessionId;
        } catch (error) {
            console.error("Error starting session:", error);
            throw error;
        }
    },

    getSessionData: async () => {
        try {
            const response = await axios.get("http://localhost:5000/get_session");
            sessionId = response.data.session_id;
            return sessionId;
        } catch (error) {
            console.error("Error getting session:", error);
            throw error;
        }
    },

    uploadFile: async (file : File) => {
        if (!sessionId) {
            alert("Session expired!")
            return
        }
console.log(sessionId)
        try {
            const response = await axios.post("http://localhost:5000/upload", file, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${sessionId}`
                }
            });
    
            console.log('File uploaded successfully:', response.data);
            alert(`File "${file.name}" uploaded successfully!`);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
        }
    }
}

// Initialize the session //
const initializeSession = async () => {
    try {
        const storedSessionId = await SessionManager.getSessionData();
        if (!storedSessionId) {
            const newSessionId = await SessionManager.startSession();
            console.log(newSessionId)
        }
    } catch (error) {
        console.error("Error initializing session:", error);
    }
};

initializeSession();

export default SessionManager;