//todo.js
//
// created by: Aoki Takumi
const fs = require('fs');

const createTodo = (options) => {
    let data = fs.readFileSync('./todo.json', 'utf8');
    let todos = JSON.parse(data);
    //todoのidを作成
    let ary = new Array(todos.todo.length);
    ary.fill(0);
    for(let i = 0; i < todos.todo.length; i++) {
        if(todos.todo[i].id >= ary.length) {
            //
        } else {
            ary[todos.todo[i].id] = 1;
        }
    }
    let index = ary.indexOf(0);
    if(index === -1) {
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
            break;
        } else if(i === users.length - 1) {
            let newUser = {
                userID: options.userID,
                userName: options.userName,
                hasTodo: [index],
            }
            users.push(newUser);
            break;
        }
    }
    //todo.jsonを更新
    let json = JSON.stringify(todos, null, 4);
    fs.writeFileSync('./todo.json', json, 'utf8');
};

const allTodoCheck = () => {
    console.log('Checking all todo...');
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
                    console.log(
                        `Error: ${el.userName} has no todoID ${hasTodoId}`
                    );
                    status = 'error';
                }
            }
        });
        console.log(`${el.userName}'s todo checked`);
    });
    if (status !== 'error') {
        status = 'passed';
    }
    console.log(`checking finished. result: ${status}`);
    return `checking finished. result: ${status}`;
};

const todoJson = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./todo.json', 'utf8', (err, data) => {
            if (err) {
                reject('todo.json not found');
            }
            resolve(data);
        });
    });
};

module.exports = {
    createTodo,
    allTodoCheck,
};
