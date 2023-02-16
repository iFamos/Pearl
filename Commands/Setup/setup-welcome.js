const { Message, Client, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const welcomeSchema = require('../../Models/Welcome');
const { model, Schema } = require('mongoose');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-welcome')
        .setDescription('Configurez votre message de bienvenue pour le bot.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel pour le messsage de bienvenue')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('welcome-message') 
            .setDescription('Entrer votre message de bienvenue')
            .setRequired(true)
        )
        .addRoleOption(option =>
            option.setName('welcome-role')
            .setDescription('Entrer votre role de bienvenue')
            .setRequired(true)
        ),
        
        async execute(interaction) {
            const { channel, options } = interaction;

            const welcomeChannel = options.getChannel('channel')
            const welcomeMessage = options.getString('welcome-message')
            const roleId = options.getRole('welcome-role');

            if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.SendMessages)) {
                interaction.reply({ content: 'Je n\'ai pas les permissions pour ça', ephemeral: true });
            }

            welcomeSchema.findOne({ Guild: interaction.guild.id }, async (err, data) => {
                if(!data) {
                    const newWelcome = await welcomeSchema.create({
                        Guild: interaction.guild.id,
                        Channel: welcomeChannel.id,
                        Msg: welcomeMessage,
                        Role: roleId.id
                    });
                }
                interaction.reply({ content: 'Message de bienvenue créé avec succès.'})
            })  
        }
}
