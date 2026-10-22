const axios = require('axios');
module.exports = {
    name: 'ssweb',
    aliases: ['ss'],
    execute: async (sock, msg, from, sender, args) => {
        const url = args[0];
        if (!url || !url.includes('http')) return sock.sendMessage(from, { text: '❌ Provide a valid URL.' }, { quoted: msg });
        
        const ssUrl = `https://api.popcat.xyz/screenshot?url=${url}`;
        await sock.sendMessage(from, { image: { url: ssUrl }, caption: `Screenshot of ${url}` }, { quoted: msg });
    }
};