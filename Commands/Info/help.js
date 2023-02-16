const { ComponentType, EmbedBuilder, SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Liste des commandes disponibles.'),
        
    async execute(interaction) {
        const emojis = {
            info: '📝',
            moderation: '👮🏻‍♂️',
            general: '⚙️',
            setup: '🔨',
        };

        const directories = [ 
            ...new Set(interaction.client.commands.map((cmd) => cmd.folder)),         
        ];

        const formatString = (str) => 
            `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

        const categories = directories.map((dir) => {
            const getCommands = interaction.client.commands
                .filter((cmd) => cmd.folder === dir).map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description: cmd.data.description || 'Pas de description',
                    };
                });

            return {
                directory: formatString(dir),
                commands: getCommands,
            };
        });

        const embed = new EmbedBuilder()
            .setDescription('Choisis une liste dans le menu');

        const components = (state) =>  [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('help-menu')
                    .setPlaceholder('Sélectionner une catégorie')
                    .setDisabled(state)
                    .addOptions(
                        categories.map((cmd) => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commandes de la catégorie ${cmd.directory}`,
                                emoji: emojis[cmd.directory.toLowerCase() || null ],
                            };
                        }),
                    ),
            ),
        ];
        
        const initialMessage = await interaction.reply({
            embeds: [embed],
            components: components(false),
            ephemeral: true,
        });

        const filter = (interaction) => interaction.user.id === interaction.member.id;

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
        });

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                (x) => x.directory.toLowerCase() === directory
            );

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${formatString(directory)} commandes`)
                .setDescription(`Liste des commandes dans la catégorie ${directory}`)
                .addFields(
                    category.commands.map((cmd) => {
                        return {
                            name: `\`${cmd.name}\``,
                            value: cmd.description || 'Pas de description',
                            inline: true,
                        };
                    }),
                );

            interaction.update({ embeds: [categoryEmbed] });
        });

        collector.on('end', () => {
            initialMessage.edit({ components: components(true) });
        });
    },
};

