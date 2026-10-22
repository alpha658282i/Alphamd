const axios = require('axios');
module.exports = {
    name: 'translate',
    aliases: ['trt'],
    execute: async (sock, msg, from, sender, args) => {
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '❌ Usage: .translate [text]' }, { quoted: msg });
        const res = await axios.get(`https://api.popcat.xyz/translate?to=en&text=${encodeURIComponent(text)}`);
        await sock.sendMessage(from, { text: `*Translated:* ${res.data.translated}` }, { quoted: msg });
    }
};