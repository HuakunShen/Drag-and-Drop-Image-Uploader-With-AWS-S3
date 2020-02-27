import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  render() {
    return (
      <div className='App'>
        <div className='container'>
          <h1>Drag and Drop Image Uploader with AWS S3</h1>
          <div className='drop-region-container mx-auto'>
            <div id='drop-region' className='drop-region text-center'>
              <img id='download-btn' src='/Download.png' width='80' alt='' />
              <h2>Drag and Drop or Click to Upload</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
