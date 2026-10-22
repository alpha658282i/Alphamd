module.exports = {
    name: 'kick',
    execute: async (sock, msg, from, sender, args) => {
        if (!from.endsWith('@g.us')) return;
        const ctx = msg.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];
        if (!target) return sock.sendMessage(from, { text: '❌ Mention or reply to user.' }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [target], 'remove');
        sock.sendMessage(from, { text: '✅ User kicked.' }, { quoted: msg });
    }
};