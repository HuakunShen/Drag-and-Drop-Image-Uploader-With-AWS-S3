import React, { Fragment } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import $ from 'jquery';

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
    const dt = e.dataTransfer;
    const files = dt.files;
    this.uploadFile(Array.from(files));
  };

  handleInputByClick = (e) => {
    this.uploadFile(Array.from(e.target.files));
  };

  componentDidMount() {
    // drag and drop to upload
    const drop_region = document.getElementById('drop-region');
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName) => {
      drop_region.addEventListener(eventName, this.preventDefaults, false);
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });
    drop_region.addEventListener('drop', this.handleDrop, false);
    ['dragenter', 'dragover'].forEach((eventName) => {
      drop_region.addEventListener(
        eventName,
        () => {
          console.log('add highlight');
          $('.drop-region-container').addClass('highlight');
        },
        false
      );
    });

    [('dragleave', 'drop')].forEach((eventName) => {
      drop_region.addEventListener(
        eventName,
        () => {
          console.log('remove highlight');
          $('.drop-region-container').removeClass('highlight');
        },
        false
      );
    });
    $('.drop-region-container').on('dragleave', function () {
      $('.drop-region-container').removeClass('highlight');
    });
    // click to upload
    drop_region.addEventListener('click', () => {
      document.getElementById('file-input').click();
    });
  }

  render() {
    const { progress } = this.state;
    return (
      <div className="App">
        <div className="container">
          <h1>Drag and Drop Image Uploader with AWS S3</h1>
          <div className="drop-region-container mx-auto">
            <div id="drop-region" className="drop-region text-center">
              <img id="download-btn" src="/Download.png" width="80" alt="" />
              <h2>Drag and Drop or Click to Upload</h2>
              <input
                id="file-input"
                type="file"
                multiple
                onChange={this.handleInputByClick}
              />
            </div>
          </div>
          <p className="mx-auto">
            <strong>Uploading Progress</strong>
          </p>
          <div className="progress mx-auto">
            <div
              id="progress-bar"
              className="progress-bar progress-bar-striped bg-info"
              role="progressbar"
              aria-valuenow="40"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${progress}%` }}
            >
              {progress}%
            </div>
          </div>

          <div id="preview" className="mx-auto">
            {this.state.images.map((img, index) => (
              <Fragment key={index}>
                <img src={img} alt="" />
                <button
                  className="btn btn-danger btn-block mx-auto"
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
