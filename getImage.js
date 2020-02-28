// const AWS = require('aws-sdk');
// const s3 = new AWS.S3({
//   accessKeyId: 'AKIAIUNQVO7BMOBCNTOQ',
//   secretAccessKey: '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',
//   region: 'us-east-2'
// });
// s3.getObject({ Bucket, Key }, (err, data) => {
//   if (err) {
//     console.error(err);
//     return callback(err);
//   }
//   return gm(data.Body)
//     .resize(200, 200, '^')
//     .quality(90)
//     .toBuffer(ext, (err, buffer) => {
//       if (err) {
//         console.error(err);
//         return callback(err);
//       }
//       return s3.putObject(
//         {
//           Bucket,
//           Key: `thumb/${filename}`,
//           Body: buffer
//         },
//         err => {
//           if (err) {
//             console.error(err);
//             return callback(err);
//           }
//           return callback(null, `thumb/${filename}`);
//         }
//       );
//     });
// });
const axios = require('axios');
axios.get('http://localhost:520/get-image', {
  params: {
    foo: 'bar'
  }
});
