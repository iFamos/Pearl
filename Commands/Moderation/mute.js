const { Client, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute un utilisateur.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Séléctionner un utilisateur à mute')
            .setRequired(true)
        )
        .addStringOption(option =>  
            option.setName('time')
            .setDescription('La durée du mute')
            .setRequired(true)
        )
        .addStringOption(option =>  
            option.setName('reason')
            .setDescription('La raison du mute')
            .setRequired(true)
        ),
    
    async execute(interaction) {
        const { guild, options } = interaction;

        const user = options.getUser('target');
        const member = guild.members.cache.get(user.id);
        const time = options.getString('time');
        const convertedTime = ms(time);
        const reason = options.getString('reason');

        const errEmbed = new EmbedBuilder()
            .setDescription('La commande ne s\'éxécute pas, réessayer plus tard.')
            .setColor('#D30000');
        
        const successEmbed = new EmbedBuilder()
            .setTitle('**Muté**')
            .setDescription(`Le mute a été effectué avec succès sur ${user}.`)
            .addFields(
                { name: 'Raison', value: `${reason}`, inline: true},
                { name: 'Durée', value: `${time}`, inline: true}
            )
            .setColor('#00D320')
            .setTimestamp()

        if (member.roles.highest.position >= interaction.member.roles.highest.position)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        if (!convertedTime)
            return interaction.reply({ embeds: [errEmbed], ephemeral: true });

        try {
            await member.timeout(convertedTime, reason);

            interaction.reply({ embeds: [successEmbed] });
        } catch(err) {
            console.log(err);
        };
    },
};
