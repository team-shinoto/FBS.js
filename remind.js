//remind.js
//
// created by: Ri3090

const fs = require('fs');
const cron = require('node-cron');
let cronList = [];

const readtodojson = () => {
    //objectを返す。文字列ではない。
    return JSON.parse(fs.readFileSync('./todo.json', 'utf8'));
};

const createRemind = (client, options) => {
    let todos = readtodojson();
    //todoに追加されたtimeを取得し、cronに渡すことでリマインドを作成。
    try {
        let id = todos.todo[todos.todo.length - 1].id;
        let task = todos.todo[id].name;
        let subject = todos.todo[id].subject;
        let time = todos.todo[id].time.slice(5, todos.todo[id].time.length);

        const cronMsg = '「' + subject + 'の' + task + '」は終わりましたか？';
        const user = client.users.cache.get(options.userID);

        var dt = new Date();
        if (time != "なし") {
            cronList.push([cron.schedule(time, () => {
                user.send(
                    `${dt.getMonth() + 1}月${dt.getDate()}日${dt.getHours()}時${dt.getMinutes()}分になりました。\n ${cronMsg}`
                );
            }), id, time]);
        }
        console.log(cronList);
        return;
    } catch (err) {
        console.error(err);
        interaction.reply("エラーが発生しました");
        return;
    }
};

const deleteRemind = (id) => {
    try {
        for (let i = 0; i < cronList.length; i++) {
            if (cronList[i][1] === id) {
                cronList[i][0].stop();
                delete cronList[i];
                cronList = cronList.filter(Boolean); //ここで配列を詰めている
                /*console.log(cronList);
                console.log(cronList.length);*/
            }
        }
        return;
    } catch (err) {
        console.error(err);
        interaction.reply("エラーが発生しました");
        return;
    }
};


//起動時にリマインドをJSONから設定する。
const settingRemind = async (client) => {
    const todos = readtodojson();

    try {
        var dt = new Date();
        if (todos.todo.length > 1) {
            for (let i = 1; i < todos.users.length; i++) {
                let user = await client.users.fetch(todos.users[i].userID); //非同期処理のためawaitで処理を待つ
                let array = todos.users[i].hasTodo;
                console.log(user);
                for (let j = 1; j < todos.todo.length; j++) {
                    if (array.includes(todos.todo[j].id)) {
                        let time = todos.todo[j].time.slice(5, todos.todo[j].time.length);
                        let task = todos.todo[j].name;
                        let subject = todos.todo[j].subject;
                        let cronMsg = '「' + subject + 'の' + task + '」は終わりましたか？';

                        //user.send("あほ");

                        cronList.push([cron.schedule(time, () => {
                            user.send(
                                `${dt.getMonth() + 1}月${dt.getDate()}日${dt.getHours()}時${dt.getMinutes()}分になりました。\n ${cronMsg}`
                            );
                        }), todos.todo[j].id, time]);
                        console.log("リマインドを設定しました。")
                    }
                }
            }
        }
        console.log(cronList);
    } catch (err) {
        console.error(err);
        interaction.reply("エラーが発生しました");
        return;
    }
};

module.exports = {
    createRemind,
    deleteRemind,
    settingRemind,
};
