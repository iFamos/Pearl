const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const { loadEvents } = require('./Handlers/eventHandler.js');
const { loadCommands } = require('./Handlers/commandHandler.js');

const client = new Client({
    intents: [Guilds, GuildMembers, GuildMessages],
    partials: [User, Message, GuildMember, ThreadMember],
    
});

client.commands = new Collection();
client.config = require('./config.json');

client.login(client.config.token).then(() => {
    loadEvents(client);
    loadCommands(client);
});
