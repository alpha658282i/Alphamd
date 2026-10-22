const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
module.exports = {
    name: 'toimg',
    aliases: ['toimage'],
    execute: async (sock, msg, from) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted || !quoted.stickerMessage) return sock.sendMessage(from, { text: '❌ Reply to a sticker with .toimg' }, { quoted: msg });
        const stream = await downloadContentFromMessage(quoted.stickerMessage, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        await sock.sendMessage(from, { image: buffer, caption: '✅ Sticker converted to image' }, { quoted: msg });
    }
};