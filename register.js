const {Client, ClientApplication} = require("discord.js");

async function register(client, commands, guildID) {
    if (guildID == null) {
        return client.application.commands.set(commands);
    }
    return client.application.commands.set(commands, guildID);
}
const ping = {
    name: "ping",
    description: "pong!",
};

const hello = {
    name: "hello",
    description: "botがあなたに挨拶します",
    options: [
        {
            type: "STRING",
            name: "language",
            description: "どの言語で挨拶するか指定します",
            required: true,
            choices: [
                {
                    name: "English",
                    value: "en",
                },
                {
                    name: "Japanese",
                    value: "ja",
                },
            ],
        },
    ],
};

const create_category = {
    name: "create_category",
    description: "カテゴリを作成します",
    options: [
        {
            type: "STRING",
            name: "year",
            description: "学年を指定します",
            required: true,
            choices: [
                {
                    name: "1年生",
                    value: "1",
                },
                {
                    name: "2年生",
                    value: "2",
                },
                {
                    name: "3年生",
                    value: "3",
                },
                {
                    name: "4年生",
                    value: "4",
                },
            ],
        },
        {
            type: "STRING",
            name: "term",
            description: "学期を指定します",
            required: true,
            choices: [
                {
                    name: "前期",
                    value: "前期",
                },
                {
                    name: "後期",
                    value: "後期",
                },
            ],
        },
    ],
};

const create_channel = {
    name: "create_channel",
    description: "最後に作成したカテゴリ科目チャンネルを作成します",
    options: [
        {
            type: "STRING",
            name: "name",
            description: "科目名を指定します",
            required: true,
        },
        {
            type: "STRING",
            name: "parent",
            description: "チャンネルを作成するカテゴリを指定します\n指定しないと最後に作成したカテゴリに作成します",
            required: false,
        }
    ],
};

const reminder = {
    name: "reminder",
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
                    name: "5秒毎",
                    value: "0,10,20,30,45,55 * * * * *",
                },
                {
                    name: "毎日0時",
                    value: "0 0 0 * * *",
                },
                {
                    name: "毎日6時",
                    value: "0 0 6 * * *",
                },
                {
                    name: "毎日12時",
                    value: "0 0 12 * * *",
                },
                {
                    name: "毎日18時",
                    value: "0 0 18 * * *",
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
};

const commands = [ping, hello, create_category, create_channel, reminder, delete_reminder];
const client = new Client({
    intents: 0,
});
require("dotenv").config();
client.token = process.env.token;
async function main() {
    client.application = new ClientApplication(client, {});
    await client.application.fetch();
    await register(client, commands, process.argv[2]);
    console.log("registration succeed!");
}
main().catch((err) => console.error(err));
