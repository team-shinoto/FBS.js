const Discord = require("discord.js");
const {MessageActionRow, MessageButton, MessageEmbed, Permissions} = require("discord.js");
require("dotenv").config();

const client = new Discord.Client({
    intents: 0,
});

let currentCategoryId = null;
let currentChannelId = null;
let currentChannelName = null;

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
            currentCategoryId = interaction.guild.channels.cache.find(
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
            //create channel
            const name = interaction.options.get("name");
            const everyoneRole = interaction.guild.roles.cache.find((role) => role.name === "@everyone");
            console.log(everyoneRole);
            await interaction.guild.channels.create(name.value, {
                type: "GUILD_TEXT",
                parent: currentCategoryId,
                permissionOverwrites: [
                    {
                        id: everyoneRole,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                ]
            });
            currentChannelId = interaction.guild.channels.cache.find(
                (channel) => channel.name === name.value
            );
            currentChannelName = name.value;
            const msg = `チャンネル「${name.value}」を作成しました`;
            //create role
            //const role = interaction.guild.roles.cache.find(role => role.name === currentChannelName);
            //interaction.member.roles.add(role);
            //create button
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(currentChannelName)
                    .setLabel("履修")
                    .setStyle('PRIMARY')
            );
            await interaction.reply({content: msg, components: [row]});
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply("エラーが発生しました");
            return;
        }
    },
};

async function onInteraction(interaction) {
    if (!interaction.isCommand()) {
        return;
    }
    return commands[interaction.commandName](interaction);
}

client.on("interactionCreate", async (interaction) => {
    if (interaction.customId === "primary") {
        await interaction.reply({
            content: "ボタンが押されました。",
            ephemeral: true,
        }).catch(console.error);
    }
});

client.on("interactionCreate", (interaction) =>
    onInteraction(interaction).catch((err) => console.error(err))
);
client.login(process.env.token).catch((err) => {
    console.error(err);
    process.exit(-1);
});
