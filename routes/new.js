const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User, Post, Image, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/upload', isLoggedIn, upload.array('img-content'), async (req, res) => {
  console.log(req.files);
  console.log(req.body['text-content']);

  const post = await Post.create({
    content: req.body['text-content'],
    UserId: req.user.id,
  });
  console.log(post);

  const hashtags = req.body['text-content'].match(/#[^\s#]+/g);
  if (hashtags) {
    const result = await Promise.all(
      hashtags.map(tag => {
        return Hashtag.findOrCreate({
          where: { title: tag.slice(1).toLowerCase() },
        })
      }),
    );
    await post.addHashtags(result.map(r => r[0]));
    console.log(result);
  }

  if (req.files) {
    const result = await Promise.all(
      req.files.map((img, idx) => {
        return Image.create({
          path: img['path'],
          index: idx,
        })
      }),
    );
    await post.addImages(result);
    console.log(result);
  }
  return res.redirect('/home');
});

router.get('/', (req, res, next) => {
  res.render('new', {
    title: 'new post',
  });
});

module.exports = router;
