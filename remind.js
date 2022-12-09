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
        id = todos.todo[todos.todo.length - 1].id;
        task = todos.todo[id].name;
        subject = todos.todo[id].subject;
        time = todos.todo[id].time.slice(5, todos.todo[id].length - 1);

        const cronMsg = '「' + subject + 'の' + task + '」は終わりましたか？';
        const user = client.users.cache.get(options.userID)

        var dt = new Date();
        cronList.push([cron.schedule(time, () => {
            user.send(
                    `${dt.getMonth() + 1}月${dt.getDate()}日${dt.getHours()}時${dt.getMinutes()}分になりました。\n ${cronMsg}`
                    );
        }), id, time]);
        console.log(cronList);
        return;
    } catch (err) {
        console.error(err);
        interaction.reply("エラーが発生しました");
        return;
    }
};


module.exports = {
    createRemind,
};
