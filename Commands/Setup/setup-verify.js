const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verify')
        .setDescription('Setup ton channel de vérification.')
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Envoie l\'embed de vérification dans ce channel')
            .setRequired(true)       
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const verifyEmbed = new EmbedBuilder()
            .setTitle('Vérification')
            .setDescription('Clique sur le button pour vérifier ton compte et pour avoir accès aux autres channels.')
            .setColor('#00D3D0')
        let sendChannel = channel.send({
            embeds: ([verifyEmbed]),
            components: [
                new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('verify').setLabel('Vérifier').setStyle(ButtonStyle.Success),                   
                ),
            ],
        });
        if (!sendChannel) {
            return interaction.reply ({ content: 'Il y a une erreur lors de la création du channel de vérification, réessayer plus tard.', ephemeral: true})
        } else {
            return interaction.reply ({ content: 'Channel de vérification a été défini avec succès.', ephemeral: true})
        };
    },
};