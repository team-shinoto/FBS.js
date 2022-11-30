const { Client, Intents, MessageActionRow, MessageButton, Permissions } = require("discord.js");
const cron = require('node-cron');

require("dotenv").config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});

let currentCategory = null;
let cronList = [[]];

const commands = {
    async ping(interaction) {
        const now = Date.now();
        const msg = ["pong!", "", `gateway: ${interaction.client.ws.ping}ms`];
        await interaction.reply({ content: msg.join("\n"), ephemeral: true });
        await interaction.editReply(
            [...msg, `往復: ${Date.now() - now}ms`].join("\n")
        );
        return;
    },

    hello(interaction) {
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
            currentCategory = await interaction.guild.channels.create(name, {
                type: "GUILD_CATEGORY",
            });
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
            let category = currentCategory;
            let categoryName = null;
            let specifiedCategory = null;
            if (interaction.options.get("parent") !== null) {
                categoryName = interaction.options.get("parent").value;
                specifiedCategory = interaction.guild.channels.cache.find(
                    (channel) => channel.name === categoryName
                );
                category = specifiedCategory;
            }
            const name = interaction.options.get("name");
            //create role
            const currentRole = await interaction.guild.roles.create({
                name: name.value,
                color: 'BLUE',
                reason: '科目ロールを作成',
            });
            //create channel
            const everyoneRole = interaction.guild.roles.everyone;
            currentChannel = await interaction.guild.channels.create(name.value, {
                type: "GUILD_TEXT",
                parent: category,
                permissionOverwrites: [
                    {
                        id: everyoneRole,
                        deny: [Permissions.FLAGS.VIEW_CHANNEL],
                    },
                    {
                        id: currentRole,
                        allow: [Permissions.FLAGS.VIEW_CHANNEL],
                    }
                ]
            });
            const msg = `チャンネルとロール「${name.value}」を作成しました\n履修を押すとロールが付与されます`;
            //create button
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(name.value)
                    .setLabel("履修")
                    .setStyle('PRIMARY')
            );
            await interaction.reply({ content: msg, components: [row] });
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply("エラーが発生しました");
            return;
        }
    },

    async reminder(interaction) {
        try {
        await interaction.reply(`現在登録されているリマインダーは以下の通りです`);

        for(let i = 0; i < cronList.length; i++){
            await interaction.reply(`「${cronList[i][1]}」を${cronList[i][2]}`);
        }
        return;
        } catch (err) {
            console.error(err);
            interaction.reply("現在登録されているリマインダーはありません");
            return;
        }
    },


    async create_reminder(interaction) {
        try {
            const name = interaction.options.get("name");
            const hour = interaction.options.get("hour");
            const time = hour.value.slice(0, 4);
            const value = hour.value.slice(5, hour.value.length);
            console.log(value);
            const msg = `「${name.value}」を${time}に通知するリマインドを作成しました`;
            await interaction.reply(msg);

            const channel = interaction.guild.channels.cache.find((channel) => channel.name === "リマインド");
            const cronMsg = '「' + name.value + '」は終わりましたか？';

            var dt = new Date();
            cronList.push([cron.schedule(value, () => {
                channel.send(`${dt.getMonth()+1}月${dt.getDate()}日${dt.getHours()}時${dt.getMinutes()}分になりました。\n ${cronMsg}`);
            }), name.value, time]);
            /*
            console.log(cronList[1][0]);
            console.log(cronList[1][1]);
            console.log(cronList[1][2]);
            */
            return;
        } catch (err) {
            console.error(err);
            interaction.reply("エラーが発生しました");
            return;
        }
    },

    async delete_reminder(interaction) {
        try {
            const name = interaction.options.get("name");

            for(let i = 0; i < cronList.length; i++){
                if (cronList[i][1] === name.value) {
                    cronList[i][0].stop();
                }
            }
        const cronDeleteMsg = '「' + name.value + '」のリマインドを削除しました';
        await interaction.reply(`${cronDeleteMsg}`);
            return;
        } catch (err) {
            console.error(err);
            interaction.reply("エラーが発生しました");
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

//button event
client.on("interactionCreate", async (interaction) => {
    try {
        if (interaction.isButton()) {
            const role = interaction.guild.roles.cache.find(role => role.name === interaction.customId);
            await interaction.member.roles.add(role);
            await interaction.reply({ content: `ロール「${role.name}」を付与しました`, ephemeral: true });
        }
    } catch (err) {
        console.error(err);
        await interaction.reply("エラーが発生しました");
    }
    return;
});

client.on("interactionCreate", (interaction) =>
    onInteraction(interaction).catch((err) => console.error(err))
);
client.login(process.env.token).catch((err) => {
    console.error(err);
    process.exit(-1);
});
