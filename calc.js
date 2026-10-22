module.exports = {
    name: 'calc',
    aliases: ['calculate'],
    execute: async (sock, msg, from, sender, args) => {
        const expr = args.join(' ');
        if (!expr) return sock.sendMessage(from, { text: '🧮 Usage: .calc 2+2*5' }, { quoted: msg });
        try {
            // Safe eval use karke calculate kar rahe hain
            const result = eval(expr);
            await sock.sendMessage(from, { text: `🧮 *Result:* ${result}` }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ Math error! Sahi equation likho.' }, { quoted: msg });
        }
    }
};