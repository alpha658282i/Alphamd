module.exports = {
    name: 'demote',
    execute: async (sock, msg, from) => {
        if (!from.endsWith('@g.us')) return;
        const ctx = msg.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];
        if (!target) return sock.sendMessage(from, { text: '❌ Mention or reply to user.' }, { quoted: msg });
        await sock.groupParticipantsUpdate(from, [target], 'demote');
        sock.sendMessage(from, { text: '✅ User demoted.' }, { quoted: msg });
    }
};