const axios = require('axios');
module.exports = {
    name: 'weather',
    aliases: ['mausam'],
    execute: async (sock, msg, from, sender, args) => {
        const city = args.join(' ');
        if (!city) return sock.sendMessage(from, { text: '🌤️ Usage: .weather [city name]' }, { quoted: msg });
        try {
            const res = await axios.get(`https://api.popcat.xyz/weather?q=${encodeURIComponent(city)}`);
            const data = res.data[0].current;
            const text = `🌍 *City:* ${city}\n🌡️ *Temp:* ${data.temperature}°C\n☁️ *Condition:* ${data.skytext}\n💧 *Humidity:* ${data.humidity}\n💨 *Wind:* ${data.winddisplay}`;
            await sock.sendMessage(from, { text: text }, { quoted: msg });
        } catch (e) {
            await sock.sendMessage(from, { text: '❌ City nahi mili ya API error hai.' }, { quoted: msg });
        }
    }
};