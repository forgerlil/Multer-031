require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const server = express();
const pool = require('./dbConnection.js');

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

server.get('/get-pics', async (req, res, next) => {
  try {
    const {rows} = await pool.query('SELECT * FROM pictures');
    const allImages = rows.map(picture => `<div><img src="${picture.name}" /></div>`).join('');
    return res.status(200).send(allImages)
  } catch (error) {
    next(error)
  }
})

server.post('/upload-profile-pic', upload.single('profile_pic'), async (req, res, next) => {
  try {
    const {filename, path} = req.file;
    const {rows} = await pool.query(`INSERT INTO pictures (name, path) VALUES ($1, $2) RETURNING *`, [filename, path]);
    console.log(req.file);
    console.log(rows);
    if (!req.file) return res.status(400).send('Image could not be uploaded!');
    return res.status(200).send(`<h2>Here is the picture:</h2><img src="${req.file.filename}" alt="something" />`);
  } catch (error) {
    next(error)
  }
})

server.use((err, req, res, next) => {
  return res.status(500).send('The server messed up :( ');
})


server.listen(port, () => console.log(`Connected to port ${port}`));