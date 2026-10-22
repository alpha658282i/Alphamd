const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
module.exports = {
    name: 'vv',
    execute: async (sock, msg, from) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const vo = quoted?.viewOnceMessageV2 || quoted?.viewOnceMessage;
        if (!vo) return sock.sendMessage(from, { text: '❌ Reply to a view-once media.' }, { quoted: msg });
        const inner = vo.message;
        const type = Object.keys(inner)[0];
        const stream = await downloadContentFromMessage(inner[type], type.replace('Message', ''));
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        await sock.sendMessage(from, { [type.replace('Message', '')]: buffer }, { quoted: msg });
    }
};