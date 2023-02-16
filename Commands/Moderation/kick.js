const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Exclure un utilisateur du serveur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Utilisateur à exclure')
            .setRequired(true) 
        )
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('Raison de l\'exclusion')
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const user = options.getUser('target');
        const reason = options.getString('reason') || 'Pas de raison';

        const member = await interaction.guild.members.fetch(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription(`Tu ne peux pas exécuter la commande sur ${user}, car l'utilisateur a un rôle plus élévé.`)
            .setColor('#D30000');
        
        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        
        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setDescription(`Le membre ${user} a bien été exclu pour la raison: ${reason}`)
            .setColor('#00D320')
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })

    },
};