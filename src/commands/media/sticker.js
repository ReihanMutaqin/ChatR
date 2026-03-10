const { MessageMedia } = require('whatsapp-web.js');

module.exports = {
    name: 'sticker',
    aliases: ['s', 'stiker'],
    description: 'Convert gambar/video ke sticker',
    category: 'media',
    usage: '!sticker (reply ke gambar/video)',
    execute: async (message) => {
        let media = null;

        // Cek apakah pesan punya media
        if (message.hasMedia) {
            media = await message.downloadMedia();
        }

        // Cek apakah reply ke pesan dengan media
        if (!media && message.hasQuotedMsg) {
            const quotedMsg = await message.getQuotedMessage();
            if (quotedMsg.hasMedia) {
                media = await quotedMsg.downloadMedia();
            }
        }

        if (!media) {
            return message.reply('❌ Kirim gambar/video dengan caption !sticker\natau reply gambar dengan !sticker');
        }

        try {
            await message.reply(media, message.from, {
                sendMediaAsSticker: true,
                stickerName: 'WhatsApp Bot',
                stickerAuthor: 'Bot',
            });
        } catch (error) {
            await message.reply('❌ Gagal membuat sticker. Pastikan gambar/video valid.');
        }
    },
};
