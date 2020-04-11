# Drag-and-Drop-Image-Uploader-With-AWS-S3

## Intro

**Using**

- Nodejs + Express for backend
- react for front end
- AWS S3 for File Storage

## Demo and Functions

**Highlight when files are dragged over**

![highlight](README.assets/highlight.gif)

**Upload a single file with Drag-and-Drop**

![single_file](README.assets/single_file.gif)

**Upload multiple files with Drag-and-Drop**

![multiple](README.assets/multiple.gif)

**Delete Images, not synced to S3 Bucket Yet**

![delete](README.assets/delete.gif)

**Upload a files with regular `<input />`**

![input_multiple](README.assets/input_multiple.gif)

## config

Create a `.env` in the outmost directory, follow the following pattern (also in `.env_template`):

```
accessKeyId=
secretAccessKey=
region=
Bucket=
```

`accessKeyId` and `secretAccessKey` can be created in AWS console, from my secret credentials, Access keys.

<img src="README.assets/image-20200410045606235.png" alt="image-20200410045606235" style="zoom:10%;" />

`region` can be found in S3's bucket list,

![image-20200410045855664](README.assets/image-20200410045855664.png)

in this example, `region` is `us-east-2`, and `Bucket` is `test-upload-huakun`.
