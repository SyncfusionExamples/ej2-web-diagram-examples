/**
 * Main Entry Point
 * Renders the React application
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerLicense } from '@syncfusion/ej2-base';
import App from './App';
import './index.css';

// Register Syncfusion license key
// For production, replace with your actual license key
// Get a free 30-day trial license at: https://www.syncfusion.com/account/manage-trials/downloads
// For this sample, we'll use the trial mode (will show a license banner)
registerLicense('YOUR_LICENSE_KEY_HERE');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
