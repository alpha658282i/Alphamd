const yts = require('yt-search');
const axios = require('axios');
module.exports = {
    name: 'play',
    aliases: ['song'],
    execute: async (sock, msg, from, sender, args) => {
        const query = args.join(' ');
        if (!query) return sock.sendMessage(from, { text: '🎵 Usage: .play [song name]' }, { quoted: msg });
        const search = await yts(query);
        const url = search.videos[0].url;
        const res = await axios.get(`https://apis.davidcyriltech.my.id/download/ytmp3?url=${url}`);
        await sock.sendMessage(from, { audio: { url: res.data.result.download_url }, mimetype: 'audio/mpeg' }, { quoted: msg });
    }
};