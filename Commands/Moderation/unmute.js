const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Démute un utilisateur sur le serveur')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Un utilisateur à démute')
            .setRequired(true)
        ),
    
    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser('target');
        const member = guild.members.cache.get(user.id);

        const errEmbed = new EmbedBuilder()
            .setDescription('La commande ne s\'éxécute pas, réessayer plus tard.')
            .setColor('#D30000');
        
        const successEmbed = new EmbedBuilder()
            .setTitle('**Démuté**')
            .setDescription(`Le démute a été effectué avec succès sur ${user}.`)
            .setColor('#00D320')
            .setTimestamp()

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(null);
    
            interaction.reply({ embeds: [successEmbed] });
        } catch(err) {
            console.log(err);
        };
    }
}