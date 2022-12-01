//todo.js
//
// created by: Aoki Takumi
const fs = require('fs');

const readtodojson = () => {
    //objectを返す。文字列ではない。
    return JSON.parse(fs.readFileSync('./todo.json', 'utf8'));
};

const writetodojson = (data) => {
    //objectを受け取り、文字列として書き出す。
    fs.writeFileSync('./todo.json', JSON.stringify(data, null, 4), 'utf8');
};
const readdmjson = () => {
    return JSON.parse(fs.readFileSync('./dmChannels.json', 'utf8'));
};

const writedmjson = (data) => {
    fs.writeFileSync(
        './dmChannels.json',
        JSON.stringify(data, null, 4),
        'utf8'
    );
};

const createTodo = (client, options) => {
    let todos = readtodojson();
    //todoのidを作成
    let ary = new Array(todos.todo.length);
    ary.fill(0);
    for (let i = 0; i < todos.todo.length; i++) {
        if (todos.todo[i].id >= ary.length) {
            //
        } else {
            ary[todos.todo[i].id] = 1;
        }
    }
    let index = ary.indexOf(0);
    if (index === -1) {
        index = ary.length;
    }
    //todoを作成
    let newTodo = {
        id: index,
        name: options.name,
        subject: options.subject,
        done: false,
        userID: options.userID,
    };
    todos.todo.push(newTodo);
    //ユーザーのtodoリストに追加
    let users = todos.users;
    for (let i = 0; i < users.length; i++) {
        if (users[i].userID === options.userID) {
            users[i].hasTodo.push(index);
            client.users.cache
                .get(options.userID)
                .send(
                    'TODOを追加しました。取得にはコマンドを実行してください。'
                );
            break;
        } else if (i === users.length - 1) {
            let newUser = {
                userID: options.userID,
                userName: options.userName,
                hasTodo: [index],
            };
            users.push(newUser);
            client.users.cache.get(options.userID).send('TODOを作成しました。');
            break;
        }
    }
    //todo.jsonを更新
    writetodojson(todos);
};

const allTodoCheck = () => {
    let msg = 'todoデータベースをチェックします...\n';
    let todos = null;
    let status = 'yet';
    data = fs.readFileSync('./todo.json', 'utf8');
    todos = JSON.parse(data);
    let todoList = todos.todo;
    let users = todos.users;
    users.forEach((el) => {
        //ユーザーごとにtodoをチェック
        let currents = todoList.filter((todo) => {
            return todo.userID === el.userID;
        });
        el.hasTodo.forEach((hasTodoId) => {
            //ユーザーのtodoをチェック
            for (let i = 0; i < currents.length; i++) {
                if (currents[i].id === hasTodoId) {
                    break;
                } else if (i === currents.length - 1) {
                    msg =
                        msg +
                        `エラー: ユーザー「${el.userName} 」は、インデックス[${hasTodoId}]のTODOを所有していません。\n`;
                    status = 'error';
                }
            }
        });
        msg = msg + `ユーザー「${el.userName}」のチェックを完了しました。\n`;
    });
    if (status !== 'error') {
        status = 'passed';
    }
    msg = msg + `チェック完了 ステータス: ${status}`;
    return msg;
};

const p = (val) => {
    console.log('value: ' + val);
    console.log('type: ' + typeof val);
};

module.exports = {
    createTodo,
    allTodoCheck,
    p,
};
