import React, { useEffect, useState } from "react";
import SessionManager from "./SessionManager";

const SessionManagerComponent: React.FC = () => {
    const [sessionId, setSessionId] = useState<string | null>(null);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                const storedSessionId = await SessionManager.getSessionData();
                if (storedSessionId) {
                    setSessionId(storedSessionId);
                } else {
                    // Since we're using useEffect for when the page refreshes //
                    // A smarter way would be to use localstorage to store and refresh the session id //
                    // For this small project it is unnecessary :) //
                    const newSessionId = await SessionManager.startSession();
                    setSessionId(newSessionId);
                }
            } catch (error) {
                console.error("Error initializing session:", error);
            }
        };

        initializeSession();
    }, []);

    return (<div></div>);
};

export default SessionManagerComponent;