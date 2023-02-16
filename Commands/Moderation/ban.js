const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports ={
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bannir un utilisateur du serveur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option => 
            option.setName('target')
            .setDescription('Utilisateur à bannir')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
            .setDescription('Raison du ban')
            .setRequired(true)
        ),

        async execute(interaction) {
            const { channel, options } = interaction;

            const user = options.getUser('target');
            const reason = options.getString('reason');

            const member = await interaction.guild.members.fetch(user.id);

            const errEmbed = new EmbedBuilder()
            .setDescription(`Tu ne peux pas exécuter la commande sur ${user}, car l'utilisateur a un rôle plus élévé.`)
            .setColor('#D30000');

            if (member.roles.highest.position >= interaction.member.roles.highest.position)
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        
            await member.ban({ reason });

            const embed = new EmbedBuilder()
                .setDescription(`Le membre ${user} a bien été banni pour la raison: ${reason}`)
                .setColor('#00D320')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        },
};