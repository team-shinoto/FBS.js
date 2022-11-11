const { Client, Intents } = require("discord.js");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.MESSAGE_CONTENT] });
require("dotenv").config();

const token = process.env.token;

if (token == undefined) {
    console.error("TOKENが設定されていません。");
    process.exit(0);
}

client.on("ready", () => {
    console.log(`ログイン: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (interaction.mentions.users.has(client.user.id)) {
        interaction.reply("呼びましたか？");
        return;
    }
});

client.login(token);
