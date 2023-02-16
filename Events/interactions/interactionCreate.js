const { CommandInteraction } = require('discord.js');

module.exports = {
    name: 'interactionCreate',

    execute(interaction, client) {

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) {
               interaction.reply({ content: 'Commande obsolète.'});           
            };

            command.execute(interaction, client)

        } else if (interaction.isButton()) {
            
            const { customId } = interaction;
            if (customId == "verify") {
               
                const role = interaction.guild.roles.cache.get('1069407789547524146');
                return interaction.member.roles.add(role).then((member) => 
                    interaction.reply({ 
                        content: `Le rôle ${role} vous a été ajouté !`,
                        ephemeral: true,
                    })
                );
            };
   
        } else {
            return;
        };     
    },
};