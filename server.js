const express = require('express');

const app = express();
const PORT = process.env.PROT || 3000;
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
// Create an S3 client
const s3 = new AWS.S3();

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/', (req, res) => {
  const { bucket_name, key_name, body } = req.body;
  const params = { Bucket: bucket_name, Key: key_name, Body: body };
  s3.putObject(params, function(err, data) {
    if (err) {
      console.log(err);
      res.status(400).send(err);
    } else {
      console.log(
        'Successfully uploaded data to ' + bucketName + '/' + keyName
      );
      res.json({
        msg: 'Successfully uploaded data to ' + bucketName + '/' + keyName,
        data: data
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
