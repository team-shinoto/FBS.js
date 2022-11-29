//todo.js
// スラッシュコマンド用関数
// create by 青木拓海^^
const fs = require('fs');

const createTodo = () => {
    let todo = {
        id: 0,
        name: 'test',
        subject: 'test',
        done: false,
        userID: 'test',
    };
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
            return todo.userID == el.userID;
        });
        el.hasTodo.forEach((hasTodoId) => {
            //ユーザーのtodoをチェック
            for (let i = 0; i < currents.length; i++) {
                if (currents[i].id == hasTodoId) {
                    break;
                } else if (i == currents.length - 1) {
                    console.log(
                        'Error: ' + el.userName + ' has no todoID ' + hasTodoId
                    );
                    status = 'error';
                }
            }
        });
        console.log(el.userName + "'s todo checked");
    });
    if (status != 'error') {
        status = 'passed';
    }
    console.log('checking finished. result: ' + status);
    return 'checking finished. result: ' + status;
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
