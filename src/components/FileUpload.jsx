import { useRef, useState } from 'react';
import { parseCSV } from '../utils/csvParser';
import { validateOrgChart } from '../utils/validator';
import "./file.css";
const FileUpload = ({ setOrgData, setErrors, setIsLoading, setIsDataValid }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (file && file.type === 'text/csv') {
      setFileName(file.name);
      setIsLoading(true);
      setErrors([]);
      setIsDataValid(false);
      
      try {
        const parsedData = await parseCSV(file);
        setOrgData(parsedData);
        const validationResult = validateOrgChart(parsedData);
        
        if (validationResult.valid) {
          setIsDataValid(true);
          setErrors([]);
        } else {
          setIsDataValid(false);
          setErrors(validationResult.errors);
        }
      } catch (error) {
        setErrors([{ 
          row: 'File Error', 
          message: 'Failed to parse CSV file. Please check the format.' 
        }]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors([{ 
        row: 'File Error', 
        message: 'Please upload a valid CSV file.' 
      }]);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div 
      className={`file-upload ${dragActive ? 'active' : ''}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        ref={fileInputRef}
        type="file" 
        accept=".csv" 
        onChange={handleFileChange}
        className="file-input"
      />
      
      <div className="upload-content">
        <div className="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 11 12 6 17 11" />
            <line x1="12" y1="6" x2="12" y2="18" />
            <path d="M5 18h14" />
          </svg>

        </div>
        <p className="upload-text">
          {fileName ? `Selected: ${fileName}` : 'Drag & drop CSV file or'}
        </p>
        <button 
          className="upload-button"
          onClick={handleButtonClick}
        >
          Browse Files
        </button>
      </div>
    </div>
  );
};

export default FileUpload;