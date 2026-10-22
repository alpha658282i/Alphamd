const axios = require('axios');
module.exports = {
    name: 'tiktok',
    aliases: ['tt'],
    execute: async (sock, msg, from, sender, args) => {
        const url = args[0];
        if (!url || !url.includes('http')) return sock.sendMessage(from, { text: '❌ Provide TikTok link.' }, { quoted: msg });
        const res = await axios.get(`https://api.nexoracle.com/downloader/tiktok?url=${url}`);
        const videoUrl = res.data.result.video;
        await sock.sendMessage(from, { video: { url: videoUrl }, caption: '✅ Downloaded' }, { quoted: msg });
    }
};