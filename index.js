const mineflayer = require('mineflayer');

const botOptions = {
  host: 'us.freegamehost.xyz', 
  port: 27268,                         
  username: 'AFK_Bot',                 
  version: '1.21' // Keeps the base packet framework 
};

// Force bypass the built-in version checking routine entirely
const mcProtocol = require('minecraft-protocol');
const oldCreateClient = mcProtocol.createClient;
mcProtocol.createClient = function (options) {
  options.checkServerVersion = false; // Disables the error block entirely
  const client = oldCreateClient(options);
  client.on('connect', () => {
    client.protocolVersion = 775; // Forces 26.1.2 packet delivery
  });
  return client;
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Bot successfully spawned in the world.');
    
    // Jump slightly every 30 seconds to stay online
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
