const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
module.exports = {
    name: 'tomp3',
    aliases: ['toaudio'],
    execute: async (sock, msg, from) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || !quoted.videoMessage) return sock.sendMessage(from, { text: '❌ Reply to a video with .tomp3' }, { quoted: msg });
        
        const stream = await downloadContentFromMessage(quoted.videoMessage, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        
        await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4', ptt: false }, { quoted: msg });
    }
};