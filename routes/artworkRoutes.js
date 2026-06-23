const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createArtwork,
  getArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
  subscribeArtwork,
} = require('../controllers/artworkController');

// Public browsing.
router.get('/', getArtworks);
router.get('/:id', getArtworkById);

// Logged-in actions.
router.post('/', protect, createArtwork);
router.put('/:id', protect, updateArtwork);
router.delete('/:id', protect, deleteArtwork);
router.post('/:id/subscribe', protect, subscribeArtwork);   // NEW

module.exports = router;