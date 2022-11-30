const { Client, ClientApplication } = require('discord.js');

async function register(client, commands, guildID) {
    if (guildID == null) {
        return client.application.commands.set(commands);
    }
    return client.application.commands.set(commands, guildID);
}
const ping = {
    name: 'ping',
    description: 'pong!',
};

const hello = {
    name: 'hello',
    description: 'botがあなたに挨拶します',
    options: [
        {
            type: 'STRING',
            name: 'language',
            description: 'どの言語で挨拶するか指定します',
            required: true,
            choices: [
                {
                    name: 'English',
                    value: 'en',
                },
                {
                    name: 'Japanese',
                    value: 'ja',
                },
            ],
        },
    ],
};

const create_category = {
    name: 'create_category',
    description: 'カテゴリを作成します',
    options: [
        {
            type: 'STRING',
            name: 'year',
            description: '学年を指定します',
            required: true,
            choices: [
                {
                    name: '1年生',
                    value: '1',
                },
                {
                    name: '2年生',
                    value: '2',
                },
                {
                    name: '3年生',
                    value: '3',
                },
                {
                    name: '4年生',
                    value: '4',
                },
            ],
        },
        {
            type: 'STRING',
            name: 'term',
            description: '学期を指定します',
            required: true,
            choices: [
                {
                    name: '前期',
                    value: '前期',
                },
                {
                    name: '後期',
                    value: '後期',
                },
            ],
        },
    ],
};

const create_channel = {
    name: 'create_channel',
    description: '最後に作成したカテゴリ科目チャンネルを作成します',
    options: [
        {
            type: 'STRING',
            name: 'name',
            description: '科目名を指定します',
            required: true,
        },
        {
            type: "STRING",
            name: "parent",
            description: "チャンネルを作成するカテゴリを指定します指定しないと最後に作成したカテゴリに作成します",
            required: false,
        }
    ],
};

const todo_create = {
    name: 'todo_create',
    description: 'TODOを作成します',
    options: [
        {
            type: 'STRING',
            name: 'name',
            description: 'TODOの名前を指定します',
            required: true,
        },
        {
            type: 'CHANNEL',
            name: 'subject',
            description: 'TODOを作成する科目のチャンネルを指定します',
            required: true,
        },
    ],
};

const todo_check = {
    name: 'todo_check',
    description: 'TODOのチェックをします',
};

const delete_dm = {
    name: 'delete_dm',
    description: 'DMを削除します',
};


const commands = [
    ping,
    hello,
    create_category,
    create_channel,
    todo_create,
    todo_check,
    delete_dm,
];
const client = new Client({
    intents: 0,
});
require('dotenv').config();
client.token = process.env.token;
async function main() {
    client.application = new ClientApplication(client, {});
    await client.application.fetch();
    await register(client, commands, process.argv[2]);
    console.log('registration succeed!');
}
main().catch((err) => console.error(err));