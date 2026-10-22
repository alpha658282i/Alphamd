const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
module.exports = {
    name: 'sticker',
    aliases: ['s'],
    execute: async (sock, msg, from) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || (!quoted.imageMessage && !quoted.videoMessage)) {
            return sock.sendMessage(from, { text: '❌ Reply to an image/video with .sticker' }, { quoted: msg });
        }
        const type = quoted.imageMessage ? 'image' : 'video';
        const stream = await downloadContentFromMessage(quoted[type + 'Message'], type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        await sock.sendMessage(from, { sticker: buffer }, { quoted: msg });
    }
};