module.exports = {
    name: 'tagall',
    description: 'Tag semua member grup',
    category: 'group',
    groupOnly: true,
    adminOnly: true,
    usage: '!tagall [pesan]',
    execute: async (message, args) => {
        const chat = await message.getChat();
        const participants = chat.participants || [];

        if (participants.length === 0) {
            return message.reply('❌ Tidak bisa mendapatkan daftar member.');
        }

        const customMessage = args.length > 0 ? args.join(' ') : 'Perhatian!';
        let text = `📢 *TAG ALL*\n\n${customMessage}\n\n`;

        const mentions = [];
        for (const participant of participants) {
            const id = participant.id._serialized;
            text += `@${id.replace('@c.us', '')} `;
            mentions.push(id);
        }

        await chat.sendMessage(text, { mentions });
    },
};
