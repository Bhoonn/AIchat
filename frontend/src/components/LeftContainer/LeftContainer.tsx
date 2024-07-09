import { useState } from "react";
import "./LeftContainer.css"

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

    // Example: Upload using Fetch API
    fetch('http://example.com/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Upload failed.');
      })
      .then(data => {
        console.log('File uploaded successfully:', data);
        alert(`File "${file.name}" uploaded successfully!`);
      })
      .catch(error => {
        console.error('Upload error:', error);
        alert('Upload failed. Please try again.');
      });
  };

    return <div id="Left">
      <div className={`drop-zone ${draggingOver ? 'dragging-over' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        <div className="drop-zone-container">
          <img src="./images/upload.png"></img>
          <p>Drag & drop files or <span className="browseBtn">Browse</span></p>
          <p>Supported formats: .doc, .docx, .pdf</p>
        </div>
        <input type="file" className="hidden-fill-input" id="fileInput" accept=".doc,.docx,.pdf"></input>
      </div>
    </div>
}

export default LeftContainer;