const axios = require('axios');
module.exports = {
    name: 'quote',
    aliases: ['quotes'],
    execute: async (sock, msg, from) => {
        const res = await axios.get('https://api.quotable.io/random');
        await sock.sendMessage(from, { text: `*"${res.data.content}"*\n\n— _${res.data.author}_` }, { quoted: msg });
    }
};