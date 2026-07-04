const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const axios = require('axios');
const pino = require('pino');
const readline = require('readline');

const CONFIG_FILE = './config.json';
const HISTORY_FILE = './history.json';
const LANG_FILE = './lang.json';

let config = { baseUrl: '', apiKey: '', model: '' };
let chatHistory = {};
let lang = 'id';

// =========================================================================
// BILINGUAL MESSAGES
// =========================================================================
const i18n = {
    id: {
        // Startup / language selection
        selectLangHeader: '\n====================================\n        PILIH BAHASA / SELECT LANGUAGE\n====================================',
        selectLangOptions: '1. Bahasa Indonesia\n2. English',
        selectLangFooter: '====================================',
        selectLangPrompt: 'Pilihan (1/2): ',
        invalidLang: 'Pilihan tidak valid. Default ke Bahasa Indonesia.',
        langSaved: (l) => `\n[OK] Bahasa disimpan: ${l}\n`,
        // Loading
        loadingState: '[*] Loading state...',
        // Pairing
        pairingMode: '\n=== MODE PAIRING ===',
        openWAPrompt: 'Buka WA -> Tautkan perangkat -> Tautkan dengan nomor. Tekan ENTER...',
        enterNumber: 'Masukkan nomor (628xxx): ',
        requestingCode: '[*] Sabar, sedang meminta kode dari server WA... (Tunggu 3 detik)',
        pairingCodeLabel: 'KODE PAIRING',
        enterCodeNow: 'Masukkan kodenya sekarang.\n',
        pairingSuccess: '\n[OK] PAIRING SUKSES. Bot siap jalan.\n',
        pairingFailed: 'X Gagal minta kode. Error:',
        deleteAuth: 'Hapus folder auth (rm -rf auth) lalu jalankan lagi.',
        alreadyLoggedIn: '\n[OK] Sudah login. Lanjut ke proses bot...\n',
        botOnline: '[OK] Bot online dan siap dipakai! Kirim /ai di WA.\n',
        // Connection
        connClosed: (reason) => `[!] Connection closed. Reason: ${reason}`,
        reconnecting: '[*] Reconnecting...',
        loggedOut: '[X] Logout. Hapus folder auth (rm -rf auth) kalo mau login lagi.',
        // AI
        aiNotSetup: 'Bot belum disetup.',
        aiNoResponse: 'Tidak ada respons dari AI.',
        aiError: (msg) => 'X Error API: ' + msg,
        aiTyping: (sender, mode) => `[AI] User ${sender} nanya (${mode}), AI sedang mengetik.`,
        aiSent: '[AI] Jawaban sukses dikirim!',
        aiThinkingError: 'Terjadi error saat AI sedang berpikir.',
        aiNoFinalOutput: '(AI tidak memberikan output final)',
        thinkingMode: 'THINKING',
        normalMode: 'NORMAL',
        // Errors
        loadConfigError: 'Load config error:',
        msgHandlerError: 'Message handler error:',
        uncaughtError: 'Uncaught:',
        unhandledError: 'Unhandled:',
        // WhatsApp messages
        waSetupGuide: "*[Dibuat oleh Zhaw (Shadiq)]*\nInstagram: mas_ukkantext\nTiktok: @ravmoise/test\n\n*Panduan Setup Bot AI*\n\nKirim perintah dengan format persis seperti ini:\n\n/ai set\nendpoint: https://api...\napikey: sk-...\nmodel: gpt-4o\n\n*Contoh:*\n/ai set\nendpoint: https://api.openai.com/v1\napikey: sk-proj-123\nmodel: gpt-4o-mini",
        waSetupSuccess: (baseUrl, apiKey, model) => `*Setup Berhasil Diperbarui!*\n\nEndpoint: ${baseUrl || '-'}\nAPI Key: ${apiKey ? '***tersimpan***' : '-'}\nModel: ${model || '-'}`,
        waFormatError: "X Format salah. Pastikan ada kata 'endpoint:', 'apikey:', dan 'model:'.",
        waClearSuccess: "*Riwayat percakapan untuk chat ini telah dihapus!*",
        waBotNotSetup: "*[Dibuat oleh Zhaw (Shadiq)]*\nInstagram: mas_ukkantext\nTiktok: @ravmoise/test\n\n*Bot Belum Disetup.*\n\nSilakan lakukan setup dengan format:\n/ai set\nendpoint: https://api...\napikey: sk-...\nmodel: gpt-4o",
        waAddPrompt: "*Tambahkan prompt.*\n\nContoh:\n/ai halo\n/ai (thinking) jelaskan teori relativitas\n/ai clear (hapus ingatan)",
        waThinkingNeedPrompt: "*Tolong tambahkan prompt setelah (thinking)!*",
        waImageDownloadFail: 'X Gagal mengunduh gambar.',
        waBotNotSetupShort: 'Bot belum disetup. Ketik /ai untuk panduan setup.',
        // AI system prompts
        systemPromptThinking: "Kamu adalah asisten AI yang sangat cerdas dan analitis. Pikirkan pertanyaan dengan mendalam, pertimbangkan berbagai konteks, dan berikan jawaban yang komprehensif, detail, dan terstruktur.",
        systemPromptNormal: "Kamu adalah asisten AI yang membantu. Jawablah pertanyaan dengan sangat SINGKAT, PADAT, dan JELAS. Jangan bertele-tele, langsung ke inti jawaban. Gunakan bahasa Indonesia yang santai."
    },
    en: {
        // Startup / language selection
        selectLangHeader: '\n====================================\n        PILIH BAHASA / SELECT LANGUAGE\n====================================',
        selectLangOptions: '1. Bahasa Indonesia\n2. English',
        selectLangFooter: '====================================',
        selectLangPrompt: 'Choice (1/2): ',
        invalidLang: 'Invalid choice. Defaulting to English.',
        langSaved: (l) => `\n[OK] Language saved: ${l}\n`,
        // Loading
        loadingState: '[*] Loading state...',
        // Pairing
        pairingMode: '\n=== PAIRING MODE ===',
        openWAPrompt: 'Open WA -> Link a device -> Link with phone number. Press ENTER...',
        enterNumber: 'Enter number (628xxx): ',
        requestingCode: '[*] Please wait, requesting code from WA server... (Wait 3 seconds)',
        pairingCodeLabel: 'PAIRING CODE',
        enterCodeNow: 'Enter the code now.\n',
        pairingSuccess: '\n[OK] PAIRING SUCCESS. Bot is ready to run.\n',
        pairingFailed: 'X Failed to request code. Error:',
        deleteAuth: 'Delete the auth folder (rm -rf auth) and run again.',
        alreadyLoggedIn: '\n[OK] Already logged in. Continuing bot process...\n',
        botOnline: '[OK] Bot is online and ready! Send /ai on WA.\n',
        // Connection
        connClosed: (reason) => `[!] Connection closed. Reason: ${reason}`,
        reconnecting: '[*] Reconnecting...',
        loggedOut: '[X] Logout. Delete the auth folder (rm -rf auth) to login again.',
        // AI
        aiNotSetup: 'Bot is not set up yet.',
        aiNoResponse: 'No response from AI.',
        aiError: (msg) => 'X API Error: ' + msg,
        aiTyping: (sender, mode) => `[AI] User ${sender} asked (${mode}), AI is typing.`,
        aiSent: '[AI] Answer sent successfully!',
        aiThinkingError: 'An error occurred while AI was thinking.',
        aiNoFinalOutput: '(AI gave no final output)',
        thinkingMode: 'THINKING',
        normalMode: 'NORMAL',
        // Errors
        loadConfigError: 'Load config error:',
        msgHandlerError: 'Message handler error:',
        uncaughtError: 'Uncaught:',
        unhandledError: 'Unhandled:',
        // WhatsApp messages
        waSetupGuide: "*[Created by Zhaw (Shadiq)]*\nInstagram: mas_ukkantext\nTiktok: @ravmoise/test\n\n*AI Bot Setup Guide*\n\nSend the command with this exact format:\n\n/ai set\nendpoint: https://api...\napikey: sk-...\nmodel: gpt-4o\n\n*Example:*\n/ai set\nendpoint: https://api.openai.com/v1\napikey: sk-proj-123\nmodel: gpt-4o-mini",
        waSetupSuccess: (baseUrl, apiKey, model) => `*Setup Successfully Updated!*\n\nEndpoint: ${baseUrl || '-'}\nAPI Key: ${apiKey ? '***saved***' : '-'}\nModel: ${model || '-'}`,
        waFormatError: "X Invalid format. Make sure to include 'endpoint:', 'apikey:', and 'model:'.",
        waClearSuccess: "*Conversation history for this chat has been cleared!*",
        waBotNotSetup: "*[Created by Zhaw (Shadiq)]*\nInstagram: mas_ukkantext\nTiktok: @ravmoise/test\n\n*Bot Not Set Up Yet.*\n\nPlease set up using this format:\n/ai set\nendpoint: https://api...\napikey: sk-...\nmodel: gpt-4o",
        waAddPrompt: "*Add a prompt.*\n\nExamples:\n/ai hello\n/ai (thinking) explain relativity theory\n/ai clear (clear memory)",
        waThinkingNeedPrompt: "*Please add a prompt after (thinking)!*",
        waImageDownloadFail: 'X Failed to download image.',
        waBotNotSetupShort: 'Bot is not set up yet. Type /ai for setup guide.',
        // AI system prompts
        systemPromptThinking: "You are a highly intelligent and analytical AI assistant. Think about the question deeply, consider various contexts, and provide a comprehensive, detailed, and structured answer.",
        systemPromptNormal: "You are a helpful AI assistant. Answer questions very BRIEFLY, CONCISELY, and CLEARLY. Don't be wordy, get straight to the point. Use casual English."
    }
};

function t() { return i18n[lang] || i18n.id; }

// =========================================================================
// LANGUAGE MANAGEMENT
// =========================================================================
function loadLang() {
    try {
        if (fs.existsSync(LANG_FILE)) {
            const data = JSON.parse(fs.readFileSync(LANG_FILE, 'utf8'));
            if (data.lang === 'id' || data.lang === 'en') lang = data.lang;
        }
    } catch (e) { lang = 'id'; }
}
function saveLang() { fs.writeFileSync(LANG_FILE, JSON.stringify({ lang }, null, 2)); }

async function promptLanguageSelection() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        console.log(t().selectLangHeader);
        console.log(t().selectLangOptions);
        console.log(t().selectLangFooter);
        rl.question(t().selectLangPrompt, (answer) => {
            rl.close();
            const choice = (answer || '').trim();
            if (choice === '1') {
                lang = 'id';
            } else if (choice === '2') {
                lang = 'en';
            } else {
                console.log(t().invalidLang);
                lang = 'id';
            }
            saveLang();
            console.log(t().langSaved(lang === 'id' ? 'Bahasa Indonesia' : 'English'));
            resolve();
        });
    });
}

// =========================================================================
// CONFIG & HISTORY MANAGEMENT
// =========================================================================
function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) { console.error(t().loadConfigError, e); }
}
function saveConfig() { fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2)); }

function loadHistory() {
    try {
        if (fs.existsSync(HISTORY_FILE)) chatHistory = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (e) { chatHistory = {}; }
}
function saveHistory() { fs.writeFileSync(HISTORY_FILE, JSON.stringify(chatHistory, null, 2)); }

// =========================================================================
// AI CALL
// =========================================================================
async function callAI(messagesHistory, isThinking) {
    if (!config.baseUrl || !config.model) return t().aiNotSetup;
    try {
        const url = config.baseUrl.replace(/\/+$/, '') + '/chat/completions';

        const systemPrompt = isThinking ? t().systemPromptThinking : t().systemPromptNormal;

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
        return res.data.choices?.[0]?.message?.content || t().aiNoResponse;
    } catch (e) { return t().aiError(e.response?.data?.error?.message || e.message); }
}

// =========================================================================
// BOT EVENT LISTENERS
// =========================================================================
function setupBotListeners(sock, saveCreds) {
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            console.log(t().connClosed(reason));
            if (reason !== DisconnectReason.loggedOut) {
                console.log(t().reconnecting);
                setTimeout(() => startSock(), 3000);
            } else {
                console.log(t().loggedOut);
            }
        } else if (connection === 'open') {
            console.log(t().botOnline);
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
                    return sock.sendMessage(jid, { text: t().waSetupGuide }, { quoted: msg });
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
                    return sock.sendMessage(jid, { text: t().waSetupSuccess(config.baseUrl, config.apiKey, config.model) }, { quoted: msg });
                } else {
                    return sock.sendMessage(jid, { text: t().waFormatError }, { quoted: msg });
                }
            }

            if (body.toLowerCase() === 'clear') {
                delete chatHistory[jid];
                saveHistory();
                return sock.sendMessage(jid, { text: t().waClearSuccess }, { quoted: msg });
            }

            if (body === '') {
                if (!config.baseUrl || !config.model) {
                    return sock.sendMessage(jid, { text: t().waBotNotSetup }, { quoted: msg });
                } else {
                    return sock.sendMessage(jid, { text: t().waAddPrompt }, { quoted: msg });
                }
            }

            let isThinking = false;
            let prompt = body;
            if (body.toLowerCase().startsWith('(thinking)')) {
                isThinking = true;
                prompt = body.slice(10).trim();
                if (!prompt) return sock.sendMessage(jid, { text: t().waThinkingNeedPrompt }, { quoted: msg });
            }

            if (hasImage) {
                try { imageBuffer = await downloadMediaMessage(msg, 'buffer', {}, { logger: pino({level:'silent'}) }); }
                catch (e) { await sock.sendMessage(jid, { text: t().waImageDownloadFail }, { quoted: msg }); return; }
            }

            if (!config.baseUrl || !config.model) {
                return sock.sendMessage(jid, { text: t().waBotNotSetupShort }, { quoted: msg });
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
            console.log(t().aiTyping(sender, isThinking ? t().thinkingMode : t().normalMode));

            const typingInterval = setInterval(() => {
                sock.sendPresenceUpdate('composing', jid).catch(() => {});
            }, 2500);

            try {
                let response = await callAI(apiMessages, isThinking);

                response = response.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
                if (!response) response = t().aiNoFinalOutput;

                chatHistory[jid].push({ role: 'assistant', content: response });
                if (chatHistory[jid].length > 10) chatHistory[jid] = chatHistory[jid].slice(-10);
                saveHistory();

                clearInterval(typingInterval);
                await sock.sendPresenceUpdate('paused', jid);
                await sock.sendMessage(jid, { text: response }, { quoted: msg });
                console.log(t().aiSent);
            } catch (e) {
                clearInterval(typingInterval);
                await sock.sendPresenceUpdate('paused', jid);
                await sock.sendMessage(jid, { text: t().aiThinkingError }, { quoted: msg });
            }

        } catch (e) { console.error(t().msgHandlerError, e); }
    });
}

// =========================================================================
// START SOCK
// =========================================================================
async function startSock() {
    console.log(t().loadingState);
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
        console.log(t().pairingMode);
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask = (q) => new Promise(res => rl.question(q, res));

        await ask(t().openWAPrompt);
        const phone = await ask(t().enterNumber);
        rl.close();

        const number = phone.replace(/[^0-9]/g, '');

        try {
            console.log(t().requestingCode);
            await new Promise(r => setTimeout(r, 3000));

            const code = await sock.requestPairingCode(number);
            console.log('\n====================================');
            console.log(`${t().pairingCodeLabel}: ${code}`);
            console.log('====================================\n');
            console.log(t().enterCodeNow);

            const checkInterval = setInterval(() => {
                if (state.creds.registered) {
                    clearInterval(checkInterval);
                    console.log(t().pairingSuccess);
                    setupBotListeners(sock, saveCreds);
                }
            }, 2000);

            return;
        } catch (e) {
            console.error(t().pairingFailed, e.message);
            console.log(t().deleteAuth);
            process.exit(1);
        }
    }

    console.log(t().alreadyLoggedIn);
    setupBotListeners(sock, saveCreds);
}

// =========================================================================
// MAIN ENTRY
// =========================================================================
async function main() {
    // Load config and history first
    loadConfig();
    loadHistory();

    // Load saved language, if not set, prompt user to select
    loadLang();
    const langFileExists = fs.existsSync(LANG_FILE);
    if (!langFileExists) {
        // First run: prompt user to select language
        // Default to Indonesian for the prompt itself (since user hasn't chosen yet)
        lang = 'id';
        await promptLanguageSelection();
    }

    // Start the WhatsApp socket
    await startSock();
}

main();

process.on('uncaughtException', (e) => console.error(t().uncaughtError, e));
process.on('unhandledRejection', (e) => console.error(t().unhandledError, e));
