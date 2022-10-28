const express = require('express');
const multer = require('multer');
const path = require('path');
const server = express();

const port = process.env.PORT || 5000;

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extension}`);
  }
});

const upload = multer({storage});

server.use(express.static('views'));
server.use(express.static('uploads'));

server.post('/upload-profile-pic', upload.single('profile_pic'), (req, res) => {
  console.log(req.file);
  if (!req.file) return res.status(400).send('Image could not be uploaded!');
  return res.status(200).send(`<h2>Here is the picture:</h2><img src="${req.file.filename}" alt="something" />`);
});

server.listen(port, () => console.log(`Connected to port ${port}`));