const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
module.exports = {
    name: 'tovn',
    execute: async (sock, msg, from) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || (!quoted.videoMessage && !quoted.audioMessage)) {
            return sock.sendMessage(from, { text: '❌ Reply to a video/audio with .tovn' }, { quoted: msg });
        }
        const type = quoted.videoMessage ? 'video' : 'audio';
        const stream = await downloadContentFromMessage(quoted[type + 'Message'], type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        
        await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4', ptt: true }, { quoted: msg });
    }
};