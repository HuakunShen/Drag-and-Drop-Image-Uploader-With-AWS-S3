import React, { Fragment } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

class App extends React.Component {
  state = {
    images: [],
    progress: 0,
  };
  preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  uploadFile = (files) => {
    const formData = new FormData();
    this.setState({
      progress: 0,
    });
    files.forEach((file) => {
      formData.append('files', file, file.name);
    });
    axios
      .post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          this.setState({
            progress: parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            ),
          });
        },
      })
      .then((res) => {
        this.previewFile(res.data);
        setTimeout(() => {
          this.setState({
            progress: 0,
          });
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  removePreviewImage = (e) => {
    const index = e.target.getAttribute('index');
    const images = this.state.images;
    images.splice(index, 1);
    this.setState(images);
  };

  previewFile = (data) => {
    const images = this.state.images;
    this.setState({ images: images.concat(data) });
  };

  handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    this.uploadFile(Array.from(files));
  };

  handleDragOver = (e) => {
    e.preventDefault();
  };

  handleInputByClick = (e) => {
    this.uploadFile(Array.from(e.target.files));
  };

  componentDidMount() {
    const drop_region_container = document.getElementById(
      'drop-region-container'
    );
    const input = document.getElementById('file-input');
    ['dragenter', 'dragover'].forEach((eventName) => {
      drop_region_container.addEventListener(eventName, () => {
        drop_region_container.classList.add('highlight');
      });
    });
    ['dragleave', 'drop'].forEach((eventName) => {
      drop_region_container.addEventListener(eventName, () => {
        drop_region_container.classList.remove('highlight');
      });
    });

    // click to upload
    drop_region_container.addEventListener('click', () => {
      input.click();
    });
  }

  render() {
    const { progress } = this.state;
    return (
      <div className='App'>
        <div className='container'>
          <h1>Drag and Drop Image Uploader with AWS S3</h1>
          <div
            id='drop-region-container'
            className='drop-region-container mx-auto'
            onDrop={this.handleDrop}
            onDragOver={this.handleDragOver}
          >
            <div id='drop-region' className='drop-region text-center'>
              <img id='download-btn' src='/Download.png' width='80' alt='' />
              <h2>Drag and Drop or Click to Upload</h2>
              <input
                id='file-input'
                type='file'
                multiple
                onChange={this.handleInputByClick}
              />
            </div>
          </div>
          <p className='mx-auto'>
            <strong>Uploading Progress</strong>
          </p>
          <div className='progress mx-auto'>
            <div
              id='progress-bar'
              className='progress-bar progress-bar-striped bg-info'
              role='progressbar'
              aria-valuenow='40'
              aria-valuemin='0'
              aria-valuemax='100'
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>

          <div id='preview' className='mx-auto'>
            {this.state.images.map((img, index) => (
              <Fragment key={index}>
                <img src={img} alt='' />
                <button
                  className='btn btn-danger btn-block mx-auto'
                  onClick={this.removePreviewImage}
                >
                  Delete
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
