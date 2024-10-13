const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('close_ticket_request')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDescription('Request to close the ticket.')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The ID of the user associated with the ticket.')
                .setRequired(true)), // Make this option required
    async execute(interaction) {
        const userId = interaction.options.getString('id'); // Get the user ID from the command options

        const user = await interaction.guild.members.fetch(userId);

        // Create an embed asking if the user wants to close the ticket
        const embed = new EmbedBuilder()
        .setColor(0x7091fd)
        .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
            .setDescription(`Would you like to close this ticket, <@${userId}>?`);

        // Create Accept and Decline buttons
        const acceptButton = new ButtonBuilder()
            .setCustomId('accept_close_ticket')
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success);

        const declineButton = new ButtonBuilder()
            .setCustomId('decline_close_ticket')
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder().addComponents(acceptButton, declineButton);

        // Send the message with the embed and buttons
        await interaction.reply({ content: `<@${userId}>`, embeds: [embed], components: [row], ephemeral: false });

        // Collector to handle button clicks
        const filter = (i) => i.user.id === userId && (i.customId === 'accept_close_ticket' || i.customId === 'decline_close_ticket');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'accept_close_ticket') {
                // User accepted to close the ticket
                const closingEmbed = new EmbedBuilder()
                .setColor(0x7091fd)
                .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                    .setDescription('Ticket will be closed in 2 seconds.');

                await i.update({ embeds: [closingEmbed], components: [] });

                setTimeout(async () => {
                    await interaction.channel.delete('Ticket closed by user request');
                }, 5000);
            } else if (i.customId === 'decline_close_ticket') {
                // User declined to close the ticket
                const declinedEmbed = new EmbedBuilder()
                .setColor(0x7091fd)
                .setThumbnail("https://cdn.discordapp.com/icons/1294279351629516842/bbab831a44bb08cff095ec6978bfecef.png?size=4096")
                    .setDescription(`<@${userId}> has declined to close the ticket.`);

                await i.update({ embeds: [declinedEmbed], components: [] });
            }
        });

        collector.on('end', (collected) => {
            if (collected.size === 0) {
                interaction.followUp({ content: 'Close ticket request timed out.', ephemeral: true });
            }
        });
    },
};
