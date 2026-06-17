const mineflayer = require('mineflayer');

const botOptions = {
  host: 'us.freegamehost.xyz', 
  port: 27268,                         
  username: 'AFK_Bot',
  // This disables the native version-checking handshake routine directly 
  skipValidation: true,
  checkServerVersion: false,
  version: '26.1.2'
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Bot successfully spawned in the world.');
    
    // Slight movement tracking loop to keep chunk layers awake
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === '!ping') {
      bot.chat('Pong! Keeping the server online 24/7.');
    }
  });

  bot.on('kick', (reason) => {
    console.log(`Kicked: ${reason}. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log(`Error: ${err.message}. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000);
  });
  
  bot.on('end', () => {
    console.log('Disconnected. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });
}

createBot();
