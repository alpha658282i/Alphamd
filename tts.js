const gTTS = require('google-tts-api');
module.exports = {
    name: 'tts',
    execute: async (sock, msg, from, sender, args) => {
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '🗣️ Usage: .tts [text]' }, { quoted: msg });
        try {
            const url = gTTS.getAudioUrl(text, { lang: 'en', slow: false, host: 'https://translate.google.com' });
            await sock.sendMessage(from, { audio: { url: url }, mimetype: 'audio/mp4', ptt: true }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Audio generate nahi ho saka (text chhota rakho).' }, { quoted: msg });
        }
    }
};