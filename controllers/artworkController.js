const Artwork = require('../models/Artwork');

exports.createArtwork = async (req, res) => {
  try {
    const { title, imageURL, tags, startingPrice, startTime, endTime } = req.body;
    const artwork = await Artwork.create({
      title, imageURL, tags, startingPrice, startTime, endTime,
      ownerId: req.userId,
    });
    res.status(201).json(artwork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.status(200).json(artworks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    res.status(200).json(artwork);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    if (artwork.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not your artwork' });
    }
    const { ownerId, status, subscribers, ...updates } = req.body;  // ignore these
    artwork.set(updates);
    await artwork.save();
    res.status(200).json(artwork);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE — owner only.
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });
    if (artwork.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not your artwork' });
    }
    await artwork.deleteOne();
    res.status(200).json({ message: 'Artwork deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SUBSCRIBE — any logged-in user, but only before bidding starts.
exports.subscribeArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: 'Artwork not found' });

    if (artwork.status !== 'scheduled') {
      return res.status(400).json({ message: 'Auction has already started' });
    }

    // Add the user once (don't duplicate if they tap twice).
    const already = artwork.subscribers.some((id) => id.toString() === req.userId);
    if (!already) {
      artwork.subscribers.push(req.userId);
      await artwork.save();
    }

    res.status(200).json({ message: 'Subscribed — you will be emailed when bidding opens' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};