const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const axios = require('axios');
const pino = require('pino');
const readline = require('readline');

const CONFIG_FILE = './config.json';
const HISTORY_FILE = './history.json';

let config = { baseUrl: '', apiKey: '', model: '' };
let chatHistory = {}; 

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) { console.error('Load config error:', e); }
}
function saveConfig() { fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2)); }
loadConfig();

function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) chatHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) { chatHistory = {}; }
}
function saveHistory() { fs.writeFileSync(HISTORY_FILE, JSON.stringify(chatHistory, null, 2)); }
loadHistory();

async function callAI(messagesHistory, isThinking) {
    if (!config.baseUrl || !config.model) return 'Bot belum disetup.';
    try {
        const url = config.baseUrl.replace(/\/+$/, '') + '/chat/completions';
        
        const systemPrompt = isThinking 
            ? "Kamu adalah asisten AI yang sangat cerdas dan analitis. Pikirkan pertanyaan dengan mendalam, pertimbangkan berbagai konteks, dan berikan jawaban yang komprehensif, detail, dan terstruktur."
            : "Kamu adalah asisten AI yang membantu. Jawablah pertanyaan dengan sangat SINGKAT, PADAT, dan JELAS. Jangan bertele-tele, langsung ke inti jawaban. Gunakan bahasa Indonesia yang santai.";

        const messages = [
            { role: 'system', content: systemPrompt },
            ...messagesHistory
        ];

        const res = await axios.post(url, {
            model: config.model,
            messages: messages,
            stream: false
        }, {
            headers: { 'Content-Type': 'application/json', ...(config.apiKey ? { 'Authorization': `Bearer ${config.apiKey}` } : {}) },
            timeout: 180000
        });
        return res.data.choices?.[0]?.message?.content || 'Tidak ada respons dari AI.';
    } catch (e) { return '❌ Error API: ' + (e.response?.data?.error?.message || e.message); }
}

function setupBotListeners(sock, saveCreds) {
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(`⚠️ Connection closed. Reason: ${reason}`);
            if (reason !== DisconnectReason.loggedOut) {
                console.log('🔄 Reconnecting...');
                setTimeout(() => startSock(), 3000);
            } else {
                console.log('[X] Logout. Hapus folder auth (rm -rf auth) kalo mau login lagi.');
            }
        } else if (connection === 'open') {
            console.log('[✓] Bot online dan siap dipakai! Kirim /ai di WA.\n');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message) return;

            let text = '', hasImage = false, imageBuffer = null, mimeType = '';
            if (msg.message.conversation) text = msg.message.conversation;
            else if (msg.message.extendedTextMessage) text = msg.message.extendedTextMessage.text;
            else if (msg.message.imageMessage) {
                text = msg.message.imageMessage.caption || '';
                hasImage = true;
                mimeType = msg.message.imageMessage.mimetype || 'image/jpeg';
            } else return;

            if (!text.startsWith('/ai')) return;

            const jid = msg.key.remoteJid;
            const sender = msg.key.participant || msg.key.remoteJid;
            const body = text.slice(3).trim();

            if (body.toLowerCase().startsWith('set')) {
                const setBody = body.slice(3).trim();
                if (!setBody) {
                    return sock.sendMessage(jid, { 
                                                text: "*[Dibuat oleh Zhaw (Shadiq)]*\nInstagram: mas_ukkantext\nTiktok: @ravmoise/test\n\n*Panduan Setup Bot AI*\n\nKirim perintah dengan format persis seperti ini:\n\n/ai set\nendpoint: https://api...\napikey: sk-...\nmodel: gpt-4o\n\n*Contoh:*\n/ai set\nendpoint: https://api.openai.com/v1\napikey: sk-proj-123\nmodel: gpt-4o-mini"    }, { quoted: msg });
                }
                
                const endpointMatch = setBody.match(/endpoint\s*:\s*(.+)/i);
                const apikeyMatch = setBody.match(/apikey\s*:\s*(.+)/i);
                const modelMatch = setBody.match(/model\s*:\s*(.+)/i);

                let updated = false;
                if (endpointMatch) { config.baseUrl = endpointMatch[1].trim(); updated = true; }
                if (apikeyMatch) { config.apiKey = apikeyMatch[1].trim(); updated = true; }
                if (modelMatch) { config.model = modelMatch[1].trim(); updated = true; }

                if (updated) {
                    saveConfig();
                    return sock.sendMessage(jid, { 
                        text: `✓ *Setup Berhasil Diperbarui!*\n\n Endpoint: ${config.baseUrl || '-'}\n API Key: ${config.apiKey ? '***tersimpan***' : '-'}\n Model: ${config.model || '-'}` 
                    }, { quoted: msg });
                } else {
                    return sock.sendMessage(jid, { text: "X Format salah. Pastikan ada kata 'endpoint:', 'apikey:', dan 'model:'." }, { quoted: msg });
                }
            }

            if (body.toLowerCase() === 'clear') {
                delete chatHistory[jid];
                saveHistory();
                return sock.sendMessage(jid, { text: "🗑️ *Riwayat percakapan untuk chat ini telah dihapus!*" }, { quoted: msg });
            }

            if (body === '') {
                if (!config.baseUrl || !config.model) {
                    return sock.sendMessage(jid, { 
                                                text: "*[Dibuat oleh Zhaw (Shadiq)]*\nInstagram: mas_ukkantext\nTiktok: @ravmoise/test\n\n*Bot Belum Disetup.*\n\nSilakan lakukan setup dengan format:\n/ai set\nendpoint: https://api...\napikey: sk-...\nmodel: gpt-4o"  }, { quoted: msg });
                } else {
                    return sock.sendMessage(jid, { 
                        text: " *tambahkan prompt.*\n\nContoh:\n/ai halo\n/ai (thinking) jelaskan teori relativitas\n/ai clear (hapus ingatan)" 
                    }, { quoted: msg });
                }
            }

            let isThinking = false;
            let prompt = body;
            if (body.toLowerCase().startsWith('(thinking)')) {
                isThinking = true;
                prompt = body.slice(10).trim();
                if (!prompt) return sock.sendMessage(jid, { text: " *Tolong tambahkan prompt setelah (thinking)!*" }, { quoted: msg });
            }

            if (hasImage) {
                try { imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: pino({level:'silent'}) }); } 
                catch (e) { await sock.sendMessage(jid, { text: 'C Gagal mengunduh gambar.' }, { quoted: msg }); return; }
            }

            if (!config.baseUrl || !config.model) { 
                return sock.sendMessage(jid, { text: ' Bot belum disetup. Ketik /ai untuk panduan setup.' }, { quoted: msg }); 
            }

            if (!chatHistory[jid]) chatHistory[jid] = [];
            chatHistory[jid].push({ role: 'user', content: prompt });
            if (chatHistory[jid].length > 10) chatHistory[jid] = chatHistory[jid].slice(-10);

            let apiMessages = chatHistory[jid].map(m => ({ ...m })); 
            if (hasImage) {
                apiMessages[apiMessages.length - 1].content = [
                    { type: 'text', text: prompt },
                    { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBuffer.toString('base64')}` } }
                ];
            }

            await sock.sendPresenceUpdate('composing', jid);
            console.log(`[AI] User ${sender} nanya (${isThinking ? 'THINKING' : 'NORMAL'}), AI sedang mengetik.`);
            
            const typingInterval = setInterval(() => {
                sock.sendPresenceUpdate('composing', jid).catch(() => {});
            }, 2500);

            try {
                let response = await callAI(apiMessages, isThinking);
                
                response = response.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
                if (!response) response = "(AI tidak memberikan output final)";

                chatHistory[jid].push({ role: 'assistant', content: response });
                if (chatHistory[jid].length > 10) chatHistory[jid] = chatHistory[jid].slice(-10);
                saveHistory();

                clearInterval(typingInterval);
                await sock.sendPresenceUpdate('paused', jid); 
                await sock.sendMessage(jid, { text: response }, { quoted: msg });
                console.log(`[AI] Jawaban sukses dikirim!`);
            } catch (e) {
                clearInterval(typingInterval);
                await sock.sendPresenceUpdate('paused', jid);
                await sock.sendMessage(jid, { text: 'Terjadi error saat AI sedang berpikir.' }, { quoted: msg });
            }

        } catch (e) { console.error('Message handler error:', e); }
    });
}

async function startSock() {
    console.log('🔄 Loading state...');
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Ubuntu', 'Chrome', '20.0.04'], 
        syncFullHistory: false,
        generateHighQualityLinkPreview: false,
    });

    sock.ev.on('creds.update', saveCreds);

    if (!state.creds.registered) {
        console.log('\n === MODE PAIRING === ');
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask = (q) => new Promise(res => rl.question(q, res));
        
        await ask('. Buka WA -> Tautkan perangkat -> Tautkan dengan nomor. Tekan ENTER...');
        const phone = await ask('Masukkan nomor (628xxx): ');
        rl.close();
        
        const number = phone.replace(/[^0-9]/g, '');
        
        try {
            console.log('🔄 Sabar, sedang meminta kode dari server WA... (Tunggu 3 detik)');
            await new Promise(r => setTimeout(r, 3000));
            
            const code = await sock.requestPairingCode(number);
            console.log(`\n====================================`);
            console.log(` KODE PAIRING : ${code} `);
            console.log(`====================================\n`);
            console.log('Masukkan kodenya sekarang.\n');
            
            const checkInterval = setInterval(() => {
                if (state.creds.registered) {
                    clearInterval(checkInterval);
                    console.log('\n✓ PAIRING SUKSES. Bot siap jalan.\n');
                    setupBotListeners(sock, saveCreds);
                }
            }, 2000);
            
            return; 
        } catch (e) {
            console.error('X Gagal minta kode. Error:', e.message);
            console.log('Hapus folder auth (rm -rf auth) lalu jalankan lagi..');
            process.exit(1);
        }
    }

    console.log('\n✓ Sudah login. Lanjut ke proses bot...\n');
    setupBotListeners(sock, saveCreds);
}

startSock();
process.on('uncaughtException', (e) => console.error('Uncaught:', e));
process.on('unhandledRejection', (e) => console.error('Unhandled:', e));
