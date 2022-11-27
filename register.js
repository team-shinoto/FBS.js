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
    description: "botがあなたに挨拶します。",
    options: [
        {
            type: "STRING",
            name: "language",
            description: "どの言語で挨拶するか指定します。",
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
    description: "カテゴリを作成します。",
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

const commands = [ping, hello, create_category];
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
