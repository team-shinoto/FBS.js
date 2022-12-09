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
            type: 'STRING',
            name: 'parent',
            description:
                'チャンネルを作成するカテゴリを指定します指定しないと最後に作成したカテゴリに作成します',
            required: false,
        },
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
        {
            type: "STRING",
            name: "time",
            description: "時間を指定します",
            required: true,
            choices:[
                {
                    name: "なし",
                    value: "なし",
                },
                {
                    name: "5秒毎",
                    value: "5秒ごと */5 * * * * *", //valueは先頭5文字までをnameとして使い、それ以降はスライスしてcronに使う
                },
                {
                    name: "毎日0時",
                    value: "毎日0時 0 0 0 * * *",
                },
                {
                    name: "毎日6時",
                    value: "毎日6時 0 0 6 * * *",
                },
                {
                    name: "毎日12時",
                    value: "毎日12時0 0 12 * * *",
                },
                {
                    name: "毎日18時",
                    value: "毎日18時0 0 18 * * *",
                },
            ],
        },
        {
            type: 'STRING',
            name: 'parent',
            description:
                'チャンネルを作成するカテゴリを指定します\n指定しないと最後に作成したカテゴリに作成します',
            required: false,
        },
    ],
};

const todo_check = {
    name: 'todo_check',
    description: 'TODOのチェックをします',
};

const delete_dm = {
    name: 'delete_dm',
    description: 'botとのDMの内容を削除します',
};

const todo_get = {
    name: 'todo_get',
    description: 'TODOを取得します',
    options: [
        {
            type: 'BOOLEAN',
            name: 'ifdm',
            description: 'DMでTODOを取得するかどうかを指定します',
            required: true,
        },
    ],
};

const todo_delete = {
    name: 'todo_delete',
    description: 'TODOを削除します',
    options: [
        {
            type: 'INTEGER',
            name: 'index',
            description: 'TODOのインデックスを指定します',
            required: true,
        },
    ],
};

const todo_finish = {
    name: 'todo_finish',
    description: 'インデックスで指定されたTODOを完了します。',
    options: [
        {
            type: 'INTEGER',
            name: 'index',
            description: '完了するTODOのインデックスを指定します',
            required: true,
        },
        {
            type: 'BOOLEAN',
            name: 'delete',
            description: '完了したTODOを削除するかどうかを指定します',
        },
    ],
};

const exit = {
    name: 'exit',
    description: '開発用:botを終了します',
};

/*
const reminder = {
    name: "reminder",
    description: "現在登録中のリマインダーを確認します",
};

const create_reminder = {
    name: "create_reminder",
    description: "リマインドを設定します",
    options: [
        {
            type: "STRING",
            name: "name",
            description: "再通知名を指定します",
            required: true,
        },
        {
            type: "STRING",
            name: "hour",
            description: "時間を指定します",
            required: true,
            choices: [
                {
                    name: "なし",
                    value: "なし",
                },
                {
                    name: "5秒毎",
                    value: "5秒ごと 5 * * * * *", //valueは先頭5文字までをnameとして使い、それ以降はスライスしてcronに使う
                },
                {
                    name: "毎日0時",
                    value: "毎日0時 0 0 0 * * *",
                },
                {
                    name: "毎日6時",
                    value: "毎日6時 0 0 6 * * *",
                },
                {
                    name: "毎日12時",
                    value: "毎日12時0 0 12 * * *",
                },
                {
                    name: "毎日18時",
                    value: "毎日18時0 0 18 * * *",
                },
            ],
        },
    ],
};

const delete_reminder = {
    name: "delete_reminder",
    description: "リマインドを削除します",
    options: [
        {
            type: "STRING",
            name: "name",
            description: "削除したいリマインド名を指定します",
            required: true,
        },
    ],
};*/

const commands = [
    ping,
    hello,
    create_category,
    create_channel,
    todo_create,
    todo_check,
    todo_get,
    todo_delete,
    todo_finish,
    delete_dm,
    exit,
    /*
    reminder,
    create_reminder,
    delete_reminder,
    */
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
