const axios = require('axios');
module.exports = {
    name: 'ig',
    aliases: ['insta', 'instagram'],
    execute: async (sock, msg, from, sender, args) => {
        const url = args[0];
        if (!url || !url.includes('http')) return sock.sendMessage(from, { text: '❌ Provide Instagram link.' }, { quoted: msg });
        const res = await axios.get(`https://api.nexoracle.com/downloader/igdl?url=${url}`);
        const data = res.data.result;
        if (data && data.length > 0) {
            for (let media of data) {
                await sock.sendMessage(from, { [media.type]: { url: media.url } }, { quoted: msg });
            }
        } else {
            sock.sendMessage(from, { text: '❌ Failed to download.' }, { quoted: msg });
        }
    }
};