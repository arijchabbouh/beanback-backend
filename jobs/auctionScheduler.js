const cron = require('node-cron');
const Artwork = require('../models/Artwork');
const sendMail = require('../utils/email');

async function tick() {
  const now = new Date();
  const toStart = await Artwork.find({
    status: 'scheduled',
    startTime: { $lte: now },          
  }).populate('subscribers', 'email name');

  for (const art of toStart) {
    art.status = 'live';
    await art.save();


    for (const sub of art.subscribers) {
      await sendMail(
        sub.email,
        `Bidding is open: ${art.title}`,
        `Hi ${sub.name}, the auction for "${art.title}" has just begun. ` +
        `The starting bid is ${art.startingPrice} coins.`
      );
    }
  }

  const toEnd = await Artwork.find({
    status: 'live',
    endTime: { $lte: now },
  });

  for (const art of toEnd) {
    art.status = 'ended';
    await art.save();
  }
}

// Schedule tick() to run every minute.  '* * * * *' means "every minute".
function startAuctionScheduler() {
  cron.schedule('* * * * *', () => {
    tick().catch((err) => console.error('Auction scheduler error:', err.message));
  });
  console.log('Auction scheduler started (runs every minute)');
}

module.exports = { startAuctionScheduler, tick };