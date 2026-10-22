module.exports = {
    name: 'hidetag',
    aliases: ['h'],
    execute: async (sock, msg, from, sender, args) => {
        if (!from.endsWith('@g.us')) return;
        const text = args.join(' ');
        if (!text) return sock.sendMessage(from, { text: '❌ Type a message to hidetag.' });
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);
        await sock.sendMessage(from, { text: text, mentions: participants }, { quoted: msg });
    }
};