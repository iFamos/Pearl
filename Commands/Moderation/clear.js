const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder, channelLink } = require('discord.js');

module.exports =  {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Permet de supprimer un nombre spécifique de messages d\'un utilisateur ou d\'un channel.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('Nombre de messages à supprimer')
            .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('target')
            .setDescription('Sélectionner un membre pour effacer ses messages')
            .setRequired(false)
        ),

    async execute(interaction) {
        const { channel, options } = interaction;

        const amount = options.getInteger('amount');
        const target = options.getUser('target');

        const messages = await channel.messages.fetch ({
            limit: amount +1,
        });

        const res = new EmbedBuilder()
            .setColor('#00D300')

        if (target) {
            let i = 0;
            const filtered = [];

            (await messages).filter((msg) => {
                if (msg.author.id === target.id && amount > i) {
                    filtered.push(msg);
                    i++;
                };
            });

            await channel.bulkDelete(filtered).then(messages => {
                res.setDescription(`${messages.size} messages de ${target} ont été supprimés avec succès !`);
                interaction.reply({ embeds: [res] });
            });
        } else {
            await channel.bulkDelete(amount, true).then(messages => {
                res.setDescription(`${messages.size} messages ont été supprimés avec succès de ce channel !`);
                interaction.reply({ embeds: [res] });
            });
        };
    },
};