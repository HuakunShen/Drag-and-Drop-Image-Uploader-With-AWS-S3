import React, { Fragment } from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { uid } from 'react-uid';
import axios from 'axios';
import $ from 'jquery';

class App extends React.Component {
  state = {
    images: [],
    total_file_to_upload: 0,
    file_uploaded: 0
  };
  preventDefaults = e => {
    console.log('prevent defaults');
    e.preventDefault();
    e.stopPropagation();
  };

  updateFileProgressBar = () => {
    console.log('updateFileProgressBar');
    console.log(this.state.file_uploaded);
    console.log(this.state.total_file_to_upload);

    console.log(
      Math.round(this.state.file_uploaded / this.state.total_file_to_upload) *
        100
    );
    this.setUploadPercentage(
      Math.round(this.state.file_uploaded / this.state.total_file_to_upload) *
        100,
      'file-progress-bar'
    );
  };

  setUploadPercentage = (progress, bar_name) => {
    $(`#${bar_name}`).css('width', progress + '%');
    $(`#${bar_name}`).text(progress + '%');
  };
  uploadFile = file => {
    // console.log(file);

    let reader = new FileReader();
    reader.readAsDataURL(file);
    this.setUploadPercentage(0, 'progress-bar');
    reader.onloadend = () => {
      // document.getElementById('preview-img').src = reader.result;
      let img = document.createElement('img');
      img.src = reader.result;
      // upload
      const formData = new FormData();

      formData.append('file', file);
      axios
        .post('/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: progressEvent => {
            console.log(
              'progress: ' +
                parseInt(
                  Math.round((progressEvent.loaded * 100) / progressEvent.total)
                )
            );
            this.setUploadPercentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total)
              ),
              'progress-bar'
            );
            this.updateFileProgressBar();

            // Clear percentage
            setTimeout(
              () => this.setUploadPercentage(0, 'progress-bar'),
              10000
            );
          }
        })
        .then(res => {
          console.log(res.data);
          // const images = this.state.images;
          // images.push({
          //   src: img.src
          // });
          // this.setState({ images });
          this.previewFile(res.data.data);
          this.setState({
            file_uploaded: this.state.file_uploaded + 1
          });
        })
        .catch(err => {
          console.log('error: ' + err);
        });
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
  encode = data => {
    var str = data.reduce(function(a, b) {
      return a + String.fromCharCode(b);
    }, '');
    return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
  };
  previewFile = data => {
    console.log('preview file');
    const { Bucket, Key, Location } = data;
    const images = this.state.images;
    images.push({
      src: Location
    });
    this.setState({ images });

    // get image data from s3
    // axios
    //   .get('/get-image', {
    //     params: {
    //       Bucket,
    //       Key
    //     }
    //   })
    //   .then(res => {
    //     console.log(res.data.Body.data);
    //     const images = this.state.images;
    //     images.push({
    //       src: 'data:image/png;base64,' + this.encode(res.data.Body.data)
    //     });
    //     this.setState({ images });
    //   })
    //   .catch(err => {
    //     console.log('Error: failed to get preview file. ' + err);
    //   });
  };

  handleFiles = files => {
    files = [...files];
    files.forEach(this.uploadFile);
    this.setState({ total_file_to_upload: 5, file_uploaded: 0 }, () => {
      this.updateFileProgressBar();
    });
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
    Array.from(e.target.files).forEach(this.uploadFile);
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
              id='progress-bar'
              className='progress-bar progress-bar-success progress-bar-striped'
              role='progressbar'
              aria-valuenow='40'
              aria-valuemin='0'
              aria-valuemax='100'
            >
              0%
            </div>
          </div>
          <div className='progress mx-auto'>
            <div
              id='file-progress-bar'
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
