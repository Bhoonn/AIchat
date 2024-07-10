import axios from "axios";

const SessionManager = {
    startSession: async () => {
        try {
            const response = await axios.post("http://localhost:5000/start_session");
            const { session_id } = response.data;
            return session_id;
        } catch (error) {
            console.error("Error starting session:", error);
            throw error;
        }
    },

    getSessionData: async () => {
        try {
            const response = await axios.get("http://localhost:5000/get_session");
            const { session_id } = response.data;
            return session_id;
        } catch (error) {
            console.error("Error getting session:", error);
            throw error;
        }
    },

    uploadFile: (file : File) => {
        axios.post("http://localhost:5000/upload", file)
            .then(data => {
                console.log('File uploaded successfully:', data);
                alert(`File "${file.name}" uploaded successfully!`);
            })
            .catch(error => {
                console.error('Upload error:', error);
                alert('Upload failed. Please try again.');
            });
    }
}

export default SessionManager;