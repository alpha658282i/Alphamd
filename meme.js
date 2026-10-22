const axios = require('axios');
module.exports = {
    name: 'meme',
    execute: async (sock, msg, from) => {
        try {
            const res = await axios.get('https://meme-api.com/gimme');
            await sock.sendMessage(from, { image: { url: res.data.url }, caption: `*${res.data.title}*\n\nr/${res.data.subreddit}` }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Meme fetch karne mein error aya.' }, { quoted: msg });
        }
    }
};