module.exports = {
    name: 'tagall',
    execute: async (sock, msg, from) => {
        if (!from.endsWith('@g.us')) return;
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);
        let text = '📢 *ATTENTION EVERYONE* 📢\n\n';
        participants.forEach(p => { text += `@${p.split('@')[0]}\n`; });
        await sock.sendMessage(from, { text: text, mentions: participants }, { quoted: msg });
    }
};