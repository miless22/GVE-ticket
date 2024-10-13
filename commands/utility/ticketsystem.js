const { PermissionsBitField, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket22')
        .setDescription('Create a ticket'),

    async execute(interaction) {
        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });

        const embed = new EmbedBuilder()
            .setTitle('Server Support')
            .setColor(0x7091fd)
            .setDescription(`
Please click the button below to create a ticket. Any troll tickets will lead to moderation action. Kindly wait for our staff team to assist you.`)
            .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setImage("https://cdn.discordapp.com/attachments/1294341752068767874/1294583147970691123/Session_Startup_9.png?ex=670b8a02&is=670a3882&hm=da4d075252013f2736c46763145aff264900298434c1f3f63caa5e504963e1f3&")
            .setFooter({
                text: 'Greenville Extreme',
                iconURL: 'https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096'
            });

        const button = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Create Ticket')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.channel.send({ embeds: [embed], components: [row] });

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};
