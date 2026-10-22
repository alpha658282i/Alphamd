const axios = require('axios');
module.exports = {
    name: 'facebook',
    aliases: ['fb', 'fbdl'],
    execute: async (sock, msg, from, sender, args) => {
        const url = args[0];
        if (!url || !url.includes('http')) return sock.sendMessage(from, { text: '❌ Provide Facebook link.' }, { quoted: msg });
        try {
            const res = await axios.get(`https://api.nexoracle.com/downloader/facebook?url=${url}`);
            const videoUrl = res.data.result.hd || res.data.result.sd;
            await sock.sendMessage(from, { video: { url: videoUrl }, caption: '✅ Downloaded from Facebook' }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Failed to download FB video.' }, { quoted: msg });
        }
    }
};