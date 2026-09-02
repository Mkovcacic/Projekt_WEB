const express = require('express');
const mongodb = require('mongodb');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

function createUploadRoutes({ files, jwt_protection }) {
  const router = express.Router();

  // Upload slika
  router.post('/upload', jwt_protection, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'Image was not provided'
        });
      }

      const user_id = new mongodb.ObjectId(req.user._id);
      const image = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
        authorID: user_id,
        uploadedAt: new Date()
      };

      const result = await files.insertOne(image);

      res.status(201).json({
        _id: result.insertedId,
        originalName: image.originalName,
        mimeType: image.mimeType,
        size: image.size,
        authorID: image.authorID,
        uploadedAt: image.uploadedAt
      });
    } catch (e) {
      res.status(500).json({
        error: e.message
      });
    }
  });

  // GET userove slike
  router.get('/user/:userID', async (req, res) => {
    try {
      const userID = req.params.userID;
  
      if (!mongodb.ObjectId.isValid(userID)) {
        return res.status(400).json({
          error: 'Invalid user ID'
        });
      }
  
      const userImages = await files
        .find(
          { authorID: new mongodb.ObjectId(userID)},
          {projection: { data: 0 }}
        )
        .sort({ uploadedAt: -1 })
        .toArray();
      
      res.json(userImages);
    } catch (e) {
      res.status(500).json({
        error: e.message
      });
    }
  });

  // GET jednu sliku
  router.get('/:id', async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!mongodb.ObjectId.isValid(id)) {
        return res.status(400).json({
          error: 'Invalid file ID'
        });
      }
  
      const file = await files.findOne({
        _id: new mongodb.ObjectId(id)
      });
  
      if (!file) {
        return res.status(404).json({
          error: 'Image not found'
        });
      }
  
      res.setHeader('Content-Type', file.mimeType);
      res.send(file.data.buffer);
    } catch (e) {
      res.status(500).json({
        error: e.message
      });
    }
  });

  return router;
}

module.exports = createUploadRoutes;