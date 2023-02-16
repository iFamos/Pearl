const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, AutoModerationRuleKeywordPresetType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Débannir un utilisateur du serveur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(option => 
            option.setName('userid')
            .setDescription('ID de l\'utilisateur à débannir')
            .setRequired(true)
        ),

        async execute(interaction) {
            const { channel, options } = interaction;

            const userId = options.getString('userid');

            try {

                await interaction.guild.members.unban(userId);

                const embed = new EmbedBuilder()
                    .setDescription(`Le membre ${userId} a bien été débanni.`)
                    .setColor('#00D320')
                    .setTimestamp();

                await interaction.reply({ embeds: [embed] })

            } catch(err) {
                console.error(err);

                const errEmbed = new EmbedBuilder()
                    .setDescription(`Veuillez fournir un ID valide pour débannir.`)
                    .setColor('#D30000');

                interaction.reply({ embeds: [errEmbed], ephemeral: true })
            };
        },
};