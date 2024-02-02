const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Armazena as datas dos eventos para cada usuário
const eventDates = {};

client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!adicionar_evento')) {
        const args = message.content.split(' ');
        args.shift(); // Remove o comando '!adicionar_evento'

        const data = args[0];
        const descricao = args.slice(1).join(' ');

        try {
            const dataFormatada = new Date(data);
            if (isNaN(dataFormatada)) {
                throw new Error('Formato de data inválido. Use o formato: aaaa-mm-dd');
            }

            const userId = message.author.id;

            if (!eventDates[userId]) {
                eventDates[userId] = [];
            }

            eventDates[userId].push({
                data: dataFormatada.toISOString(),
                descricao: descricao,
            });

            message.reply(`Evento adicionado com sucesso para ${message.author.username}!`);
        } catch (error) {
            message.reply(error.message);
        }
    }
});

// Verifica os eventos a cada 30 minutos
const verificarEventos = setInterval(() => {
    const agora = new Date();
    for (const [userId, eventos] of Object.entries(eventDates)) {
        const user = client.users.cache.get(userId);

        if (user) {
            for (const evento of eventos) {
                const dataEvento = new Date(evento.data);
                if (
                    dataEvento.getUTCFullYear() === agora.getUTCFullYear() &&
                    dataEvento.getUTCMonth() === agora.getUTCMonth() &&
                    dataEvento.getUTCDate() === agora.getUTCDate()
                ) {
                    user.send(`Lembrete: Hoje é o evento - ${evento.descricao}`);
                }
            }
        }
    }
}, 30 * 60 * 1000); // 30 minutos

client.login('MTIwMzAxNTY3MDMwNTEyODUzMQ.GgrLjl._84LztQn3p9ox0fPrONxAKEihnKA2KeDOvXCng'); // Substitua pelo seu token de bot