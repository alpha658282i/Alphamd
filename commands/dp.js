module.exports = {
    name: 'dp',
    execute: async (sock, msg, from) => {
        const ctx = msg.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0] || (from.endsWith('@g.us') ? msg.key.participant : from);
        try {
            const url = await sock.profilePictureUrl(target, 'image');
            await sock.sendMessage(from, { image: { url }, caption: '✅ Profile Picture' }, { quoted: msg });
        } catch {
            await sock.sendMessage(from, { text: '❌ No profile picture or privacy blocked.' }, { quoted: msg });
        }
    }
};