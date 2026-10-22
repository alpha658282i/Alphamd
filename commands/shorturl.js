const axios = require('axios');
module.exports = {
    name: 'shorturl',
    aliases: ['shorten'],
    execute: async (sock, msg, from, sender, args) => {
        const url = args[0];
        if (!url || !url.includes('http')) return sock.sendMessage(from, { text: '🔗 Usage: .shorturl [link]' }, { quoted: msg });
        try {
            const res = await axios.get(`https://tinyurl.com/api-create.php?url=${url}`);
            await sock.sendMessage(from, { text: `🔗 *Short URL:* ${res.data}` }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Link short nahi ho saka.' }, { quoted: msg });
        }
    }
};