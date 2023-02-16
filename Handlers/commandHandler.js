function loadCommands(client) {
    const ascii = require('ascii-table');
    const fs = require('fs');
    const table = new ascii().setHeading('Commande', 'Statut');
    
    let commandsArray = [];

    const commandsFolder = fs.readdirSync('./Commands');
    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./Commands/${folder}`).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandFile = require(`../Commands/${folder}/${file}`);

            const propreties = {folder, ...commandFile};
            client.commands.set(commandFile.data.name, propreties);

            commandsArray.push(commandFile.data.toJSON());

            table.addRow(file, 'chargée');
            continue;       
        };
    };
    client.application.commands.set(commandsArray);

    return console.log(table.toString(), `\nCommande(s) chargée(s).`);
};

module.exports = { loadCommands };