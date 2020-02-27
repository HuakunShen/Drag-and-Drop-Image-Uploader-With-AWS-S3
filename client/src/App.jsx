import React, { Fragment } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { uid } from 'react-uid';

class App extends React.Component {
  state = {
    images: []
  };
  preventDefaults = e => {
    console.log('prevent defaults');
    e.preventDefault();
    e.stopPropagation();
  };

  previewFile = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // document.getElementById('preview-img').src = reader.result;
      let img = document.createElement('img');
      img.src = reader.result;
      // document.getElementById('preview').appendChild(img);
      const images = this.state.images;
      images.push({ src: img.src });
      this.setState({ images });
    };
  };

  removePreviewImage = e => {
    const index = e.target.getAttribute('index');
    console.log('Remove image on index ' + index);
    const images = this.state.images;
    images.splice(index, 1);
    console.log(images);
    this.setState(images);
  };

  uploadFile = file => {
    console.log('uploading file');
  };

  handleFiles = files => {
    files = [...files];
    files.forEach(this.uploadFile);
    files.forEach(this.previewFile);
  };

  handleDrop = e => {
    console.log('dropped');
    const dt = e.dataTransfer;
    const files = dt.files;
    this.handleFiles(files);
  };

  handleDropWithInput = e => {
    console.log('handleDropWithInput');
    console.log(e.target.files);
    Array.from(e.target.files).forEach(this.previewFile);
  };

  componentDidMount() {
    // drag and drop to upload
    const drop_region = document.getElementById('drop-region');
    console.log(drop_region);
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      drop_region.addEventListener(eventName, this.preventDefaults, false);
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });
    drop_region.addEventListener('drop', this.handleDrop, false);

    // click to upload
    drop_region.addEventListener('click', () => {
      document.getElementById('file-input').click();
    });
  }
  render() {
    return (
      <div className='App'>
        <div className='container'>
          <h1>Drag and Drop Image Uploader with AWS S3</h1>
          <div className='drop-region-container mx-auto'>
            <div id='drop-region' className='drop-region text-center'>
              <img id='download-btn' src='/Download.png' width='80' alt='' />
              <h2>Drag and Drop or Click to Upload</h2>
              <input
                id='file-input'
                type='file'
                multiple
                onChange={this.handleDropWithInput}
              />
            </div>
          </div>
          <div className='progress mx-auto'>
            <div
              className='progress-bar progress-bar-success progress-bar-striped'
              role='progressbar'
              aria-valuenow='40'
              aria-valuemin='0'
              aria-valuemax='100'
            >
              0%
            </div>
          </div>
          <div id='preview' className='mx-auto'>
            {this.state.images.map((img, index) => (
              <Fragment key={uid(img)}>
                <img src={img.src} alt='' />
                <button
                  className='btn btn-danger btn-block mx-auto'
                  index={index}
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
