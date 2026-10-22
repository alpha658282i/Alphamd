const axios = require('axios');

module.exports = {
    name: 'menu',
    aliases: ['help'],
    execute: async (sock, msg, from) => {
        const menu = `𝗮𝗹𝗽𝗵𝗮𝗺𝗱𝗯𝗼𝘁 𝗠𝗘𝗚𝗔
╭━━━〔 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 〕━━━┈⊷
┃ ⋄ 𝗢𝘄𝗻𝗲𝗿 : 𝗔𝗟𝗣𝗛𝗔 𝗦𝗘𝗡𝗧𝗜𝗡𝗘𝗟
┃ ⋄ 𝗦𝘁𝗮𝘁𝘂𝘀 : 𝗢𝗻𝗹𝗶𝗻𝗲 🟢
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 🤖 𝗔𝗜 〕━━━┈⊷
┃ ⋄ .ai [question]
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 📥 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥 〕━━━┈⊷
┃ ⋄ .play [song name]
┃ ⋄ .video [video name]
┃ ⋄ .ig [insta link]
┃ ⋄ .tiktok [link]
┃ ⋄ .facebook [link]
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 🛠️ 𝗧𝗢𝗢𝗟𝗦 〕━━━┈⊷
┃ ⋄ .sticker (reply img/vid)
┃ ⋄ .toimg (reply sticker)
┃ ⋄ .tomp3 (reply video)
┃ ⋄ .tovn (reply avn)
┃ ⋄ .tts [text]
┃ ⋄ .translate [text]
┃ ⋄ .calc [math]
┃ ⋄ .weather [city]
┃ ⋄ .shorturl [link]
┃ ⋄ .ssweb [link]
┃ ⋄ .quote
┃ ⋄ .meme
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 👥 𝗚𝗥𝗢𝗨𝗣 〕━━━┈⊷
┃ ⋄ .tagall
┃ ⋄ .hidetag [text]
┃ ⋄ .kick (reply user)
┃ ⋄ .promote (reply user)
┃ ⋄ .demote (reply user)
┃ ⋄ .vv (reply view-once)
┃ ⋄ .dp (reply/mention)
╰━━━━━━━━━━━━━━━━━━┈⊷

╭━━━〔 ℹ️ 𝗠𝗔𝗜𝗡 〕━━━┈⊷
┃ ⋄ .menu / .help
┃ ⋄ .ping
╰━━━━━━━━━━━━━━━━━━┈⊷

> 𝗧𝗵𝗮𝗻𝗸𝘀 𝗳𝗼𝗿 𝘂𝘀𝗶𝗻𝗴 𝗮𝗹𝗽𝗵𝗮𝗺𝗱𝗯𝗼𝘁!`;

        // Tumhara direct image link yahan paste kar diya hai
        const imageUrl = 'https://i.ibb.co/8WVyZtG/file-00000000c3d082119f61dec097f73943.png';

        try {
            await sock.sendMessage(from, { 
                image: { url: imageUrl }, 
                caption: menu 
            }, { quoted: msg });
        } catch (error) {
            // Agar image load nahi hoti, toh sirf text menu bhej dega
            await sock.sendMessage(from, { text: menu }, { quoted: msg });
        }
    }
};