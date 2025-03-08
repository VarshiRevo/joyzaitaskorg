import { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import ErrorDisplay from './components/ErrorDisplay';
import OrgChart from './components/OrgChart';
import './App.css';

function App() {
  const [orgData, setOrgData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataValid, setIsDataValid] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const orgChartRef = useRef(null);
  
  return (
    <div className="app-container">
      <div className="header">
        <h1>Organization Validator</h1>
        <p>Upload and validate your organizational hierarchy with ease</p>

        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`tab-button ${activeTab === 'guidelines' ? 'active' : ''}`}
            onClick={() => setActiveTab('guidelines')}
          >
            Guidelines
          </button>
          <button
            className={`tab-button ${activeTab === 'examples' ? 'active' : ''}`}
            onClick={() => setActiveTab('examples')}
          >
            Examples
          </button>
        </div>
      </div>

      <div className="content">
        {activeTab === 'upload' && (
          <>
            <div className="upload-section">
              <div className="section-info">
                <h2>Upload Your CSV File</h2>
                <p>The file should contain employee data with proper reporting relationships</p>
                <div className="requirements">
                  <div className="requirement-item">
                    <div className="requirement-icon">1</div>
                    <span>Each row must represent one employee</span>
                  </div>
                  <div className="requirement-item">
                    <div className="requirement-icon">2</div>
                    <span>Required columns: Email, FullName, Role, ReportsTo</span>
                  </div>
                  <div className="requirement-item">
                    <div className="requirement-icon">3</div>
                    <span>Only one employee should have Root role (Super Admin/root)</span>
                  </div>
                </div>
              </div>

              <FileUpload
                setOrgData={setOrgData}
                setErrors={setErrors}
                setIsLoading={setIsLoading}
                setIsDataValid={setIsDataValid}
              />
            </div>

            {isLoading && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Processing your organization data...</p>
              </div>
            )}

            {errors.length > 0 && (
              <div className="results-section error">
                <h2>Validation Results</h2>
                <p>We found some issues with your organization structure:</p>
                <ErrorDisplay errors={errors} />
              </div>
            )}

            {isDataValid && (
              <div className="results-section success">
                <h2>Validation Results</h2>
                <div className="success-message">
                  <div className="success-icon">✓</div>
                  <div className="success-details">
                    <p className="success-title">Organization structure is valid!</p>
                    <p className="success-info">All reporting relationships are correctly defined</p>
                  </div>
                </div>
                <div className="stats-container">
                  <div className="stat-box">
                    <span className="stat-value">{orgData.length}</span>
                    <span className="stat-label">Employees</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{Math.max(0, ...orgData.map(item => item.level || 0))}</span>
                    <span className="stat-label">Levels</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{orgData.filter(item => item.role === 'Root').length}</span>
                    <span className="stat-label">Root Nodes</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-value">{orgData.filter(item => item.role === 'Admin').length}</span>
                    <span className="stat-label">Admins</span>
                  </div>
                </div>
              </div>
            )}
            {orgData.length > 0 && (
              <div className="chart-responsive-container" ref={orgChartRef}>
                <OrgChart data={orgData} />
              </div>
            )}
          </>
        )}

        {activeTab === 'guidelines' && (
          <div className="guidelines-section">
            <h2>CSV Format & Role-Based Guidelines</h2>
            <div className="role-hierarchy-diagram">
              <div className="role-level root-level">
                <div className="role-box root">Root(Super Admin)</div>
              </div>
              <div className="hierarchy-arrow"></div>
              <div className="role-level admin-level">
                <div className="role-box admin">Admin</div>
              </div>
              <div className="hierarchy-arrow"></div>
              <div className="role-level manager-level">
                <div className="role-box manager">Manager</div>
                <div className="role-box manager">Manager</div>
              </div>
              <div className="hierarchy-arrow"></div>
              <div className="role-level caller-level">
                <div className="role-box caller">Caller</div>
                <div className="role-box caller">Caller</div>
                <div className="role-box caller">Caller</div>
              </div>
            </div>
            <div className="guidelines-content">
              <div className="guideline-card">
                <h3>Required CSV Format</h3>
                <ul>
                  <li><strong>Email</strong>: User's email address (unique identifier)</li>
                  <li><strong>FullName</strong>: User's full name</li>
                  <li><strong>Role</strong>: User's role (Root, Admin, Manager, or Caller)</li>
                  <li><strong>ReportsTo</strong>: Email of the user's manager (empty for Root)</li>
                </ul>
                <div className="csv-example">
                  <code>Email,FullName,Role,ReportsTo</code>
                  <code>ceo@example.com,John Smith,Root,</code>
                  <code>admin@example.com,Jane Doe,Admin,ceo@example.com</code>
                </div>
              </div>

              <div className="guideline-card">
                <h3>Role Definitions</h3>
                <ul>
                  <li><strong>Root</strong>: Top of the organization (Super Admin)</li>
                  <li><strong>Admin</strong>: Administrative users with oversight of multiple managers</li>
                  <li><strong>Manager</strong>: Team leaders who manage callers</li>
                  <li><strong>Caller</strong>: Front-line employees</li>
                </ul>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="examples-section">
            <h2>Example CSV Templates</h2>
            <p className="examples-description">
              Download our sample template to get started with your organization structure.
              These templates follow all the required reporting rules and demonstrate proper hierarchy.
            </p>

            <div className="template-preview">
              <div className="preview-header">
                <h3>Preview of Template Structure</h3>
              </div>
              <div className="preview-content">
                <div className="preview-stats">
                  <div className="preview-stat-item">
                    <span className="preview-stat-value">1</span>
                    <span className="preview-stat-label">Root</span>
                  </div>
                  <div className="preview-stat-item">
                    <span className="preview-stat-value">3</span>
                    <span className="preview-stat-label">Admins</span>
                  </div>
                  <div className="preview-stat-item">
                    <span className="preview-stat-value">5</span>
                    <span className="preview-stat-label">Managers</span>
                  </div>
                  <div className="preview-stat-item">
                    <span className="preview-stat-value">6</span>
                    <span className="preview-stat-label">Callers</span>
                  </div>
                </div>
                <div className="preview-hierarchy">
                  <div className="preview-hierarchy-level">
                    <div className="preview-node root">Root (1)</div>
                  </div>
                  <div className="preview-hierarchy-level">
                    <div className="preview-node admin">Admins (3)</div>
                  </div>
                  <div className="preview-hierarchy-level">
                    <div className="preview-node manager">Managers (5)</div>
                  </div>
                  <div className="preview-hierarchy-level">
                    <div className="preview-node caller">Callers (6)</div>
                  </div>
                </div>
              </div>
            </div>

            <a href="../public/Book.csv" download className="download-template-button">
              <span className="download-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </span>
              Download Template
            </a>

            <div className="example-notes">
              <h3>Notes on Using Templates</h3>
              <ul>
                <li>Replace the placeholder data with your actual organization information.</li>
                <li>Ensure each user's Email is unique and correctly formatted.</li>
                <li>Maintain the correct reporting structure based on roles.</li>
                <li>Validate that the ReportsTo field contains an existing user's Email.</li>
                <li>Save your file in CSV format before uploading.</li>
                <li><strong>This template supports any number of records, but column names must remain the same.</strong></li>
              </ul>
            </div>
          </div>
        )}

      </div>

      <footer className="footer">
        <p><b>Organization Validation</b></p>
        <div className="footer-links">
          Developed by <span><a href="https://www.varshigaps.tech">Varshiga P S</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;