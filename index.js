const Discord = require("discord.js");
require('dotenv').config();

const commands = {

    async ping(interaction) {
        const now = Date.now();
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
                return `こんにちは、${name}さん。`;
            },
        };
        const name =
            interaction.member?.displayName ?? interaction.user.username;
        const lang = interaction.options.get("language");
        return interaction.reply(source[lang.value](name));
    },

    async createCategory(interaction) {
        try {
            const schoolYear = interaction.options.get("schoolYear");
            const term = interaction.options.get("term");
            const name = `${schoolYear.value}年${term.value}学期`;
            await interaction.guild.channels.create(name, {
                type: "GUILD_CATEGORY",
            });
            return interaction.reply(`カテゴリ ${name} を作成しました。`);
        } catch (err) {
            console.error(err);
            return interaction.reply("エラーが発生しました。");
        }
    },
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
