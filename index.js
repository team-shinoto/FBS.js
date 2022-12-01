const {
    Client,
    Intents,
    MessageActionRow,
    MessageButton,
    Permissions,
} = require('discord.js');
const { createTodo, allTodoCheck, p } = require('./todo.js');
require('dotenv').config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS],
});

let currentCategory = null;

const getChannelName = (guild, id) => {
    return guild.channels.cache.get(id).name;
};

const commands = {
    async ping(interaction) {
        const now = Date.now();
        const msg = ['pong!', '', `gateway: ${interaction.client.ws.ping}ms`];
        await interaction.reply({ content: msg.join('\n'), ephemeral: true });
        await interaction.editReply(
            [...msg, `往復: ${Date.now() - now}ms`].join('\n')
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
        const lang = interaction.options.get('language');
        return interaction.reply(source[lang.value](name));
    },

    async create_category(interaction) {
        try {
            const year = interaction.options.get('year');
            const term = interaction.options.get('term');
            const name = `${year.value}年${term.value}`;
            currentCategory = await interaction.guild.channels.create(name, {
                type: 'GUILD_CATEGORY',
            });
            const msg = `カテゴリー「${name}」を作成しました`;
            await interaction.reply(msg);
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply('エラーが発生しました');
            return;
        }
    },

    async create_channel(interaction) {
        try {
            let category = currentCategory;
            let categoryName = null;
            let specifiedCategory = null;
            if (interaction.options.get('parent') !== null) {
                categoryName = interaction.options.get('parent').value;
                specifiedCategory = interaction.guild.channels.cache.find(
                    (channel) => channel.name === categoryName
                );
                category = specifiedCategory;
            }
            const name = interaction.options.get('name');
            //create role
            const currentRole = await interaction.guild.roles.create({
                name: name.value,
                color: 'BLUE',
                reason: '科目ロールを作成',
            });
            //create channel
            const everyoneRole = interaction.guild.roles.everyone;
            currentChannel = await interaction.guild.channels.create(
                name.value,
                {
                    type: 'GUILD_TEXT',
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: everyoneRole,
                            deny: [Permissions.FLAGS.VIEW_CHANNEL],
                        },
                        {
                            id: currentRole,
                            allow: [Permissions.FLAGS.VIEW_CHANNEL],
                        },
                    ],
                }
            );
            const msg = `チャンネルとロール「${name.value}」を作成しました\n履修を押すとロールが付与されます`;
            //create button
            const row = new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(name.value)
                    .setLabel('履修')
                    .setStyle('PRIMARY')
            );
            await interaction.reply({ content: msg, components: [row] });
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply('エラーが発生しました');
            return;
        }
    },

    async todo_create(interaction) {
        try {
            let guild = interaction.guild;
            let name = interaction.options.get('name');
            let subjectName = getChannelName(
                guild,
                interaction.options.get('subject').value
            );
            let user = interaction.user;
            let options = {
                name: name.value,
                subject: subjectName,
                userID: user.id,
                userName: user.username,
            };
            createTodo(client, options);
            const msg = `科目「${subjectName}」のTODO「${name.value}」を作成しました`;
            await interaction.reply(msg);
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply('エラーが発生しました');
            return;
        }
    },

    async todo_check(interaction) {
        try {
            let result = allTodoCheck();
            await interaction.reply({
                content: result,
                ephemeral: false,
            });
            return;
        } catch (err) {
            console.error(err);
            await interaction.reply('エラーが発生しました');
            return;
        }
    },

    async delete_dm(interaction) {
        //botとのDMの内容を削除します
        try {
            let dmChannelID = interaction.user.dmChannel.id;
            p(dmChannelID);
            const msg = 'DMを削除しました';
            await interaction.reply(msg);
        } catch (err) {
            console.error(err);
            await interaction.reply('エラーが発生しました');
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
client.on('interactionCreate', async (interaction) => {
    try {
        if (interaction.isButton()) {
            const role = interaction.guild.roles.cache.find(
                (role) => role.name === interaction.customId
            );
            await interaction.member.roles.add(role);
            await interaction.reply({
                content: `ロール「${role.name}」を付与しました`,
                ephemeral: true,
            });
        }
    } catch (err) {
        console.error(err);
        await interaction.reply('エラーが発生しました');
    }
    return;
});

client.on('interactionCreate', (interaction) =>
    onInteraction(interaction).catch((err) => console.error(err))
);
client.login(process.env.token).catch((err) => {
    console.error(err);
    process.exit(-1);
});
