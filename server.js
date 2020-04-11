const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const PORT = 5000;
require('dotenv').config();
const s3Client = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.post('/upload-image', upload.array('files'), (req, res) => {
  const promise_array = [];
  req.files.forEach((file) => {
    const params = {
      Acl: 'public-read',
      Bucket: process.env.Bucket,
      Key: '' + file.originalname,
      Body: file.buffer,
    };
    const putObjectPromise = s3Client.upload(params).promise();
    promise_array.push(putObjectPromise);
  });
  Promise.all(promise_array)
    .then((values) => {
      console.log(values);
      const urls = values.map((value) => value.Location);
      console.log(urls);
      res.send(urls);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
});
app.get('/get-image', (req, res) => {
  // console.log(req.query);
  const query = req.query;
  s3Client.getObject(query, (err, data) => {
    if (err) return res.status(400).send('Failed to get object');
    res.send(data);
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
