import axios from "axios";

axios.defaults.withCredentials = true

const SessionManager = {
    startSession: async () => {
        try {
            axios.post("http://localhost:5000/start_session");
            return true;
        } catch (error) {
            console.error("Error starting session:", error);
            throw error;
        }
    },

    checkSession: async () => {
        try {
            const response = await axios.get("http://localhost:5000/check_session");
            if (response.data.message === "Invalid token") {
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error getting session:", error);
            throw error;
        }
    },

    uploadFile: async (file : File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);        
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log("File uploaded successfully:", response.data);
            alert(`File "${file.name}" uploaded successfully!`);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed. Please try again.");
        }
    }
}

// Initialize the session //
const initializeSession = async () => {
    try {
        const good = await SessionManager.checkSession();
        if (!good) {
            SessionManager.startSession();
        }
    } catch (error) {
        console.error("Error initializing session:", error);
    }
};

initializeSession();

export default SessionManager;