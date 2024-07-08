import { useState } from "react";
import "./LeftContainer.css"

const LeftContainer = () => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      uploadFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
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
      <div className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
        <p>Drag & Drop your document here</p>
      </div>
    </div>
}

export default LeftContainer;