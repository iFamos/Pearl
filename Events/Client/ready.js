const { Client } = require('discord.js');   
const mongoose = require('mongoose');
const config = require('../../config.json');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        mongoose.set('strictQuery', true);
        await mongoose.connect(config.mongodb || '', {
            keepAlive: true,
        });

        if (mongoose.connect) {
            
            console.log(`MongoDB est connecté.`);
        }

        let guildsCount = await client.guilds.fetch();
        let usersCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

        console.log(`Le client ${client.user.tag} est connecté pour ${usersCount} utilisateurs sur ${guildsCount.size} serveurs.`);
    }
};