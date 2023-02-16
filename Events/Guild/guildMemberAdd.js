const { EmbedBuilder, GuildMember } = require('discord.js');
const Schema = require('../../Models/Welcome');

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {
        Schema.findOne({ Guild: member.guild.id }, async(err, data) =>{
            if (!data) return;
            let channel = data.Channel;
            let Msg = data.Msg;
            let Role = data.Role;

            const { user, guild } = member;
            const welcomeChannel = member.guild.channels.cache.get(data.Channel);

            const welcomeEmbed = new EmbedBuilder()
                .setTitle('**Nouveau Membre**')
                .setDescription(data.Msg)
                .setColor('#00D300')
                .addFields({name: 'Membre total', value: `${guild.memberCount}`})
                .setFooter({text: `➕ Nouveau membre • ID ${member.id}`})
                .setTimestamp()

            welcomeChannel.send({ embeds: [welcomeEmbed] });
            member.roles.add(data.Role);
        });
    },
};