const yts = require('yt-search');
const axios = require('axios');
module.exports = {
    name: 'video',
    aliases: ['ytmp4'],
    execute: async (sock, msg, from, sender, args) => {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(from, { text: '🎬 Usage: .video [video name]' }, { quoted: msg });
        const search = await yts(query);
        const url = search.videos[0].url;
        const res = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp4?url=${url}`);
        await sock.sendMessage(from, { video: { url: res.data.result.download_url }, caption: `✅ ${search.videos[0].title}` }, { quoted: msg });
    }
};