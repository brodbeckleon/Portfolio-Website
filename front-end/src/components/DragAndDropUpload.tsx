// DragAndDropUpload.tsx
import React, { useRef, useState } from 'react';

interface DragAndDropUploadProps {
    onFilesSelected: (files: File[]) => void;
    multiple?: boolean;
    accept?: string;
}

const DragAndDropUpload: React.FC<DragAndDropUploadProps> = ({
                                                                 onFilesSelected,
                                                                 multiple = true,
                                                                 accept = 'image/*',
                                                             }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    const [displayText, setDisplayText] = useState('Drag and drop a file or click to upload');

    const handleFiles = (files: FileList) => {
        const filesArray = Array.from(files);
        onFilesSelected(filesArray);
        const fileNames = filesArray.map(file => file.name).join(', ');
        setDisplayText(fileNames);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div
            className={`file-upload-wrapper ${dragActive ? 'active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            style={{
                border: '2px dashed #ccc',
                borderRadius: '5px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
            }}
            data-title={displayText}
        >
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleChange}
                multiple={multiple}
                accept={accept}
            />
            <p>{displayText}</p>
        </div>
    );
};

export default DragAndDropUpload;
