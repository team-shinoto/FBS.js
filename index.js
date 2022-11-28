const Discord = require("discord.js");
require('dotenv').config();
const test = require("./button.js");

let currentCategory = null;

const commands = {

    async ping(interaction) {
        const now = Date.now();
        //const msg = [test(), ""];
        const msg = ["pong!", "", `gateway: ${interaction.client.ws.ping}ms`];
        await interaction.reply({content: msg.join("\n"), ephemeral: true});
        await interaction.editReply(
            [...msg, `往復: ${Date.now() - now}ms`].join("\n")
        );
        return;
    },

    async hello(interaction) {
        const source = {
            en(name) {
                return `Hello, ${name}!`;
            },
            ja(name) {
                return `こんにちは、${name}さん`;
            },
        };
        const name =
            interaction.member?.displayName ?? interaction.user.username;
        const lang = interaction.options.get("language");
        return interaction.reply(source[lang.value](name));
    },

    async create_category(interaction) {
        try {
            const year = interaction.options.get("year");
            const term = interaction.options.get("term");
            const name = `${year.value}年${term.value}`;
            await interaction.guild.channels.create(name, {
                type: "GUILD_CATEGORY",
            });
            currentCategory = interaction.guild.channels.cache.find(
                (channel) => channel.name === name
            );
            const msg = `カテゴリー「${name}」を作成しました`;
            await interaction.reply(msg);
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply("エラーが発生しました");
            return;
        }
    },

    async create_channel(interaction) {
        try {
            const name = interaction.options.get("name");
            await interaction.guild.channels.create(name.value, {
                type: "GUILD_TEXT",
                parent: currentCategory,
            });
            const msg = `チャンネル「${name.value}」を作成しました`;
            await interaction.reply(msg);
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply("エラーが発生しました");
            return;
        }
    }
};

async function onInteraction(interaction) {
    if (!interaction.isCommand()) {
        return;
    }
    return commands[interaction.commandName](interaction);
}
const client = new Discord.Client({
    intents: 0,
});
client.on("interactionCreate", (interaction) =>
    onInteraction(interaction).catch((err) => console.error(err))
);
client.login(process.env.token).catch((err) => {
    console.error(err);
    process.exit(-1);
});
