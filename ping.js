module.exports = {
    name: 'ping',
    execute: async (sock, msg, from) => {
        const start = Date.now();
        const sent = await sock.sendMessage(from, { text: 'Pinging...' }, { quoted: msg });
        const end = Date.now();
        await sock.sendMessage(from, { text: `🏓 Pong! Speed: ${end - start}ms`, edit: sent.key });
    }
};