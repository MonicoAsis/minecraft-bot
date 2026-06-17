const mineflayer = require('mineflayer');

const botOptions = {
  host: 'us.freegamehost.xyz', // Put your FreeGameHost IP/address here
  port: 27268,                         // Put your server port here (usually 25565 or custom)
  username: 'AFK_Bot',                 // The username for your bot
  version: false                       // Auto-detects the Minecraft server version
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Bot successfully spawned in the world.');
    
    // Move slightly every 30 seconds to prevent inactivity kicks
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 30000);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    if (message === '!ping') {
      bot.chat('Pong! I am keeping the server alive.');
    }
  });

  // Automatically reconnect if kicked or if the server restarts
  bot.on('kick', (reason) => {
    console.log(`Kicked from server: ${reason}. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000);
  });

  bot.on('error', (err) => {
    console.log(`Error encountered: ${err.message}. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000);
  });
  
  bot.on('end', () => {
    console.log('Connection ended. Reconnecting in 10 seconds...');
    setTimeout(createBot, 10000);
  });
}

createBot();
