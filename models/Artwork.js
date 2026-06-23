const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  imageURL:     { type: String, required: true },
  tags:         { type: [String], enum: ['painting', 'wall art', 'digital', 'sketch'], default: [] },
  startingPrice:{ type: Number, required: true, min: 0 },
  ownerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  startTime: { type: Date },   
  endTime:   { type: Date },  
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended'],
    default: 'scheduled',
  },

  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artwork', artworkSchema);