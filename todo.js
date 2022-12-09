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
        time: options.time,
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
    //console.log(todos);
    //todo.jsonを更新
    writetodojson(todos);
};

const getTodo = (userID) => {
    let todos = readtodojson();
    let users = todos.users;
    let todoList = todos.todo;
    let user = users.find((el) => {
        return el.userID === userID;
    });
    let userTodoObjects = user.hasTodo.map((el) => {
        return todoList.find((el2) => {
            return el === el2.id;
        });
    });
    //todoに含まれる教科を取得。
    let subjects = [];
    userTodoObjects.forEach((el) => {
        if (subjects.includes(el.subject)) {
            //
        } else {
            subjects.push(el.subject);
        }
    });
    //教科ごとに分ける。
    let subjectAry = [];
    subjects.forEach((el) => {
        let subjectTodo = userTodoObjects.filter((el2) => {
            return el === el2.subject;
        });
        subjectAry.push(subjectTodo);
    });
    return { subjects: subjects, subjectAry: subjectAry };
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

const doneTodo = (id) => {
    let ifUpdate = false;
    let todos = readtodojson();
    let todoList = todos.todo;
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === id) {
            todoList[i].done = true;
            ifUpdate = true;
            break;
        }
    }
    writetodojson(todos);
    return ifUpdate;
};

const deleteTodoById = (id) => {
    let ifDelete = false;
    let todos = readtodojson();
    let todoList = todos.todo;
    let users = todos.users;
    //todoListからidが一致するものを削除。
    for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === id) {
            todoList.splice(i, 1);
            ifDelete = true;
            break;
        }
    }
    //ユーザーのhasTodoからidが一致するものを削除。
    users.forEach((el) => {
        for (let i = 0; i < el.hasTodo.length; i++) {
            if (el.hasTodo[i] === id) {
                el.hasTodo.splice(i, 1);
                break;
            }
        }
    });
    writetodojson(todos);
    return ifDelete;
};

const deleteTodoByUser = (userID) => {};

const p = (val) => {
    console.log('value: ' + val);
    console.log('type: ' + typeof val);
};

function createTextFromAry(ary) {
    //create string like a table from array
    let text = '';
    ary.forEach((el) => {
        text = text + el + '\n';
    });
    return text;
}

module.exports = {
    createTodo,
    allTodoCheck,
    p,
    getTodo,
    deleteTodoById,
    doneTodo,
};
