const express = require('express');
const app = express();
const AWS = require('aws-sdk');
const s3Client = new AWS.S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region
});
require('dotenv').config();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadHelper = (req, res) => {
  console.log('uploadHelper req: ' + req);
  console.log('uploadHelper req.file: ' + req.file);
  console.log(req.file);

  const params = {
    Acl: 'public-read',
    Bucket: 'our-story-huakun/test-image',
    Key: req.file.originalname,
    Body: req.file.buffer
  };
  s3Client.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'error -> ' + err });
    }
    res.json({ data });
  });
};

app.post('/upload-image', upload.single('file'), uploadHelper);
app.get('/get-image', (req, res) => {
  console.log(req.query);
  const query = req.query;
  s3Client.getObject(query, (err, data) => {
    if (err) return res.status(400).send('Failed to get object');
    res.send(data);
  });
});

app.listen(520, () => {
  console.log('Server listening on port 520');
});
