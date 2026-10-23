require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs-extra');
const path = require('path');
const P = require('pino');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, Browsers, delay } = require('@whiskeysockets/baileys');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const AUTH_DIR = path.join(__dirname, 'sessions');
const LOG_FILE = path.join(__dirname, 'data', 'chat_logs.json');

fs.ensureDirSync(AUTH_DIR);
fs.ensureDirSync(path.join(__dirname, 'data'));
if (!fs.existsSync(LOG_FILE)) fs.writeJsonSync(LOG_FILE, []);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sessions = {};
const commands = new Map();

// ─── COMMANDS LOADER (FIXED PATHS) ───
const loadCommands = () => {
    const commandsDir = path.join(__dirname, 'commands');
    if (!fs.existsSync(commandsDir)) return console.log("Commands folder not found!");
    
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandsDir, file));
            if (command.name && command.execute) {
                commands.set(command.name, command);
                if (command.aliases) {
                    command.aliases.forEach(alias => commands.set(alias, command));
                }
            }
        } catch (e) { console.log(`Error loading ${file}:`, e.message); }
    }
    console.log(`Loaded ${commands.size} commands.`);
};
loadCommands();

// ─── API ROUTES ───
app.post('/api/pair', async (req, res) => {
    const { number } = req.body;
    if (!number) return res.status(400).json({ error: 'Number required' });
    const userId = `user_${number}`;
    if (sessions[userId]?.isConnected) return res.json({ status: 'connected' });
    
    const authPath = path.join(AUTH_DIR, userId);
    if (fs.existsSync(authPath)) fs.removeSync(authPath);
    
    sessions[userId] = new BotSession(userId, authPath, number);
    try {
        const code = await sessions[userId].initialize(number);
        res.json({ code, userId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/status/:userId', (req, res) => {
    const s = sessions[req.params.userId];
    res.json({ isConnected: s ? s.isConnected : false });
});

app.post('/api/admin/data', (req, res) => {
    const { password } = req.body;
    if (password !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Wrong Password!' });
    
    const logs = fs.readJsonSync(LOG_FILE);
    const activeUsers = Object.keys(sessions).map(k => ({ userId: k, number: sessions[k].phone, connected: sessions[k].isConnected }));
    res.json({ logs, activeUsers });
});

// ─── BOT SESSION CLASS ───
class BotSession {
    constructor(userId, authPath, phone) {
        this.userId = userId; this.authPath = authPath; this.phone = phone;
        this.sock = null; this.isConnected = false;
    }

    saveLog(sender, receiver, message, type) {
        try {
            const logs = fs.readJsonSync(LOG_FILE);
            logs.unshift({ time: new Date().toLocaleString(), sender, receiver, message, type, fromBot: this.phone });
            if (logs.length > 500) logs.length = 500; 
            fs.writeJsonSync(LOG_FILE, logs);
        } catch (e) {}
    }

    async initialize(pairingNumber) {
        const { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(this.authPath);
        
        this.sock = makeWASocket({
            version, 
            auth: state, 
            logger: P({ level: 'fatal' }), 
            browser: Browsers.ubuntu('Chrome'), 
            printQRInTerminal: false
        });
        
        this.sock.ev.on('creds.update', saveCreds);
        
        let code = null;
        if (!state.creds.registered) {
            await delay(2000);
            code = await this.sock.requestPairingCode(pairingNumber);
            code = code?.match(/.{1,4}/g)?.join("-") || code;
        }
        
        this.sock.ev.on('connection.update', (update) => {
            if (update.connection === 'open') { 
                this.isConnected = true; 
                console.log(`[${this.phone}] Connected ✅`);
                io.to(this.userId).emit('connected'); 
            }
            if (update.connection === 'close') {
                this.isConnected = false;
                if (update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                    setTimeout(() => this.initialize(), 5000);
                }
            }
        });
        
        this.sock.ev.on('messages.upsert', async (chat) => {
            const msg = chat.messages[0];
            if (!msg.message || (msg.key.id.startsWith('BAE5') && msg.key.fromMe)) return;
            
            const from = msg.key.remoteJid;
            const isGroup = from.endsWith('@g.us');
            const sender = isGroup ? msg.key.participant : from;
            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || msg.message.imageMessage?.caption || '';
            
            // Chat Log Save karna
            const senderName = msg.key.fromMe ? 'Bot' : sender.split('@')[0];
            const receiverName = msg.key.fromMe ? from.split('@')[0] : 'Bot';
            if(body) this.saveLog(senderName, receiverName, body, msg.key.fromMe ? 'sent' : 'received');

            if (msg.key.fromMe || !body.startsWith('.')) return;

            // Command Processing
            const args = body.slice(1).trim().split(/ +/);
            const cmdName = args.shift().toLowerCase();
            
            const command = commands.get(cmdName);
            if (command) {
                try {
                    await this.sock.sendMessage(from, { react: { text: '⏳', key: msg.key } });
                    await command.execute(this.sock, msg, from, sender, args);
                    await this.sock.sendMessage(from, { react: { text: '✅', key: msg.key } });
                } catch (err) {
                    console.error(`Command Error (${cmdName}):`, err);
                    await this.sock.sendMessage(from, { react: { text: '❌', key: msg.key } });
                }
            }
        });
        return code;
    }
}

// ─── SERVER START ───
io.on('connection', (socket) => { socket.on('join', (id) => socket.join(id)); });

server.listen(PORT, () => {
    console.log(`\n================================`);
    console.log(`  ALPHA MD BOT IS RUNNING`);
    console.log(`  http://localhost:${PORT}`);
    console.log(`================================\n`);
});
