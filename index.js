const mineflayer = require('mineflayer');

const botOptions = {
  host: 'us.freegamehost.xyz', 
  port: 27268,                         
  username: 'AFK_Bot',                 
  // 775 is the exact network protocol number for version 26.1.2
  version: '1.21' 
};

// Injection to trick the client handshake into sending the 26.1.2 protocol id directly
const mcData = require('minecraft-data')('1.21');
if (mcData && mcData.version) {
  mcData.version.protocol = 775; 
}

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Bot successfully spawned in the world.');
    
    // Jump every 30 seconds to bypass server inactivity rules
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
