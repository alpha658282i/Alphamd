const axios = require('axios');
module.exports = {
    name: 'ai',
    aliases: ['gpt', 'gemini'],
    execute: async (sock, msg, from, sender, args) => {
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '🤖 Please provide a question.' }, { quoted: msg });
        const res = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=en`);
        await sock.sendMessage(from, { text: `*AI:* ${res.data.success}` }, { quoted: msg });
    }
};