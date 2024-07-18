import React, { useState } from "react";
import "./RightContainer.css";

interface User {
  name: string;
}

interface Message {
  id: number;
  user: User;
  text: string;
}

let currentId = 0;

const RightContainer = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>("");

    const addMessage = (user: User, message: string) => {
        const msg: Message = {
            id: currentId++,
            user: user,
            text: message,
        };

        setMessages([...messages, msg]);
        setInputText("");
    };

    const autoGrow = (element: HTMLTextAreaElement) => {
        element.style.height = "44px";
        element.style.height = `${element.scrollHeight}px`;

        const inputEnter = document.querySelector(
            "#input_container > input:last-child"
        ) as HTMLElement;
        if (inputEnter !== null) {
            inputEnter.style.opacity = element.value === "" ? "0.2" : "1";
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        autoGrow(e.target);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        if (inputText.trim() !== "") {
            addMessage({ name: "User" }, inputText);

            const e = document.getElementById("input_inner") as HTMLTextAreaElement;
            if (e !== null) {
                e.style.height = "44px";
                const inputEnter = document.querySelector(
                    "#input_container > input:last-child"
                ) as HTMLElement;
                if (inputEnter !== null) {
                    inputEnter.style.opacity = "0.2"
                }
            }
        }
    };

    return (
        <div id="Right">
            <div id="chatbox_container">
            <div id="chatbox">
                {messages.map((message) => (
                <div key={message.id}>{message.text}</div>
                ))}
            </div>
            </div>
            <div id="input_container">
            <input type="image" src="images/question_mark.png" alt="Question Mark" />
            <textarea
                id="input_inner"
                placeholder="Message AIChat"
                value={inputText}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            <input
                type="image"
                src="images/input_enter.png"
                alt="Submit"
                onClick={handleSubmit}
            />
            </div>
        </div>
    );
};

export default RightContainer;