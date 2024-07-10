import { useState } from "react";
import "./LeftContainer.css"
import SessionManager from "../../SessionManager/SessionManager";

const LeftContainer = () => {
  const [draggingOver, setDraggingOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      uploadFile(droppedFile);
    }
    setDraggingOver(false)
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOver(true)
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingOver(false)
  };

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    SessionManager.uploadFile(file) 
  };

  return <div id="Left">
    <div className={`drop-zone ${draggingOver ? 'dragging-over' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <div className="drop-zone-container">
        <img src="./images/upload.png" alt=""></img>
        <p>Drag & drop files or <span className="browseBtn">Browse</span></p>
        <p>Supported formats: .txt .doc, .docx, .pdf</p>
      </div>
      <input type="file" className="hidden-fill-input" id="fileInput" accept=".txt,.doc,.docx,.pdf"></input>
    </div>
  </div>
}

export default LeftContainer;