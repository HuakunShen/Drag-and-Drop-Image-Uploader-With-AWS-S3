import React, { Fragment } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { uid } from 'react-uid';
import axios from 'axios';
import $ from 'jquery';

class App extends React.Component {
  state = {
    images: [],
    total_file: 0,
    file_uploaded: 0,
  };
  preventDefaults = (e) => {
    console.log('prevent defaults');
    e.preventDefault();
    e.stopPropagation();
  };

  setUploadPercentage = (progress) => {
    $('#progress-bar').css('width', progress + '%');
    $('#progress-bar').text(progress + '%');
  };
  uploadFile = async (file) => {
    console.log(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    await this.setUploadPercentage(0);
    reader.onloadend = () => {
      let img = document.createElement('img');
      img.src = reader.result;
      // upload
      const formData = new FormData();

      formData.append('file', file);

      axios
        .post('/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            console.log(
              'progress: ' +
                parseInt(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )
            );
            this.setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              )
            );
          },
        })
        .then((res) => {
          console.log(res.data);
          this.setState({ file_uploaded: this.state.file_uploaded + 1 });
          this.previewFile(res.data.data);
        })
        .catch((err) => {
          console.log('error: ' + err);
        });
    };
  };

  removePreviewImage = (e) => {
    const index = e.target.getAttribute('index');
    console.log('Remove image on index ' + index);
    const images = this.state.images;
    images.splice(index, 1);
    console.log(images);
    this.setState(images);
  };

  previewFile = (data) => {
    console.log('preview file');
    const { Location } = data;
    const images = this.state.images;
    images.push({
      src: Location,
    });
    this.setState({ images });
  };

  handleFiles = (files) => {
    files = [...files];
    files.forEach(this.uploadFile);
  };

  handleDrop = (e) => {
    console.log('dropped');
    const dt = e.dataTransfer;
    const files = dt.files;
    this.setState({ total_file: files.length, file_uploaded: 0 });

    this.handleFiles(files);
  };

  handleDropWithInput = (e) => {
    console.log('handleDropWithInput');
    console.log(e.target.files);
    this.setState({ total_file: e.target.files.length, file_uploaded: 0 });
    Array.from(e.target.files).forEach(this.uploadFile);
  };

  componentDidMount() {
    // drag and drop to upload
    const drop_region = document.getElementById('drop-region');
    console.log(drop_region);
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
    const total_progress = Math.round(
      (this.state.file_uploaded / this.state.total_file) * 100
    );
    console.log('total_progress ' + total_progress);
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
          <p className='mx-auto'>
            <strong>Single Image Progress</strong>
          </p>
          <div className='progress mx-auto'>
            <div
              id='progress-bar'
              className='progress-bar progress-bar-striped bg-info'
              role='progressbar'
              aria-valuenow='40'
              aria-valuemin='0'
              aria-valuemax='100'
            >
              0%
            </div>
          </div>
          <p className='mx-auto'>
            <strong>Overall Progress</strong>
          </p>
          <p>
            Total: {this.state.total_file}, Uploaded: {this.state.file_uploaded}
          </p>
          <div className='progress mx-auto'>
            <div
              id='progress-bar'
              className='progress-bar progress-bar-striped bg-success'
              role='progressbar'
              aria-valuenow='40'
              aria-valuemin='0'
              aria-valuemax='100'
              style={{ width: `${total_progress}%` }}
            >
              {Math.round(this.state.file_uploaded / this.state.total_file) *
                100}
              %
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
