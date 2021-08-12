"use strict";

//setting system getters
const querySelect = (item) => document.querySelector(item);
const querySelectAll = (item) => document.querySelectorAll(item);
const getByID = (item) => document.getElementById(item);

//setting global variables
const listStorage = window.localStorage;
let totalTasksNumber = Object.keys(localStorage).length;

const submitButton = getByID("add-task-button");
const completeButton = getByID("show-completed-button");
let checkboxes = querySelectAll("input[name='task-status']");
let removes = querySelectAll("[title='Remove item']");

const checkedMark = " checked:true";
const modifiedCheckedMark = checkedMark.trim();

//declaring functions
const saveItem = (key, item) => listStorage.setItem(key, item);
const getItem = (key) => listStorage.getItem(key);
const removeItem = (key) => listStorage.removeItem(key);
const clearListStorage = () => listStorage.clear();

const getRemoveElem = (element) => element.parentNode;
const getTaskElem = (element) => element.parentNode.parentNode;
const getTaskText = (element) => getTaskElem(element).querySelector(".task");
const getCompletedTaskList = (element) => getTaskElem(element).parentNode;

const stringLastWord = (text) => text.split(" ").pop();

const refreshCheckboxAndRemovesLists = () => {
    checkboxes = querySelectAll("input[name='task-status']");
    removes = querySelectAll("[title='Remove item']");
};

const calculateCompletedTasks = () => {
    let counter = 0;
    for (let i = 10000; ; i++) {
        if (getItem(i)) counter++;
        else break;
    }
    return counter;
};

//calculated variables
let completedTasksNumber = calculateCompletedTasks();
let tasksNumber = totalTasksNumber - completedTasksNumber;
let insertPosition = completedTasksNumber + 10000;
//========================================================

const recalcTaskVariables = () => {
    totalTasksNumber = Object.keys(localStorage).length;
    completedTasksNumber = calculateCompletedTasks();
    tasksNumber = totalTasksNumber - completedTasksNumber;
    insertPosition = completedTasksNumber + 10000;
};

const saveToStorage = () => {
    let taskValue;
    for (let i = 0; i < checkboxes.length; i++) {
        taskValue = getTaskText(checkboxes[i]).innerHTML;
        if (checkboxes[i].checked) {
            taskValue += checkedMark;
            saveCompletedTask(taskValue);
        }
        saveItem(i, taskValue);
    }
};

const saveCompletedTask = (item) => {
    recalcTaskVariables();
    let flagInsert = true;
    let taskText;
    for (let i = 10000; i < insertPosition + 1; i++) {
        taskText = item;
        flagInsert = taskText === getItem(i) ? false : true;
        if (flagInsert === false) break;
    }
    if (flagInsert) saveItem(insertPosition, taskText);
};

const reassignStorageKeys = (startingKey, flagCompletedTasks) => {
    let count;
    if (!flagCompletedTasks) count = tasksNumber;
    else count = insertPosition;
    for (let i = startingKey + 1; i < count; i++) {
        if (getItem(i)) {
            saveItem(i - 1, getItem(i));
        }
    }
    removeItem(count - 1);
};

const removeCompletedTask = (item) => {
    let taskText = item + checkedMark;
    for (let i = 10000; i < insertPosition + 1; i++) {
        if (taskText === getItem(i)) {
            removeItem(i);
            reassignStorageKeys(i, true);
        }
    }
};

const removeFromStorage = (element) => {
    recalcTaskVariables();
    let taskValue = getRemoveElem(element).querySelector(".task").innerHTML;
    let modifiedTaskValue = taskValue + checkedMark;
    for (let i = 0; i < removes.length; i++) {
        if (getItem(i) === taskValue || getItem(i) === modifiedTaskValue) {
            removeItem(i);
            reassignStorageKeys(i, false);
        }
    }
};

const restoreFromStorage = () => {
    let taskValue;
    for (let i = 0; i < tasksNumber; i++) {
        taskValue = getItem(i);
        if (modifiedCheckedMark === stringLastWord(taskValue)) {
            let modifiedTaskValue = taskValue.substring(0, taskValue.lastIndexOf(" "));
            insertTask(modifiedTaskValue, true, false);
        } else {
            insertTask(taskValue, false, false);
        }
    }
    for (let i = 10000; i < insertPosition; i++) {
        taskValue = getItem(i);
        if (modifiedCheckedMark === stringLastWord(taskValue)) {
            let modifiedTaskValue = taskValue.substring(0, taskValue.lastIndexOf(" "));
            insertTask(modifiedTaskValue, true, true);
        } else {
            insertTask(taskValue, false, true);
        }
    }
};

const taskExists = (task) => {
    let insertFlag = true;
    let tempTask;
    let taskSpans;
    let list = "task-list";
    taskSpans = querySelectAll(".task");
    for (let taskSpan of taskSpans) {
        tempTask = getCompletedTaskList(taskSpan);
        if (tempTask.id === list) {
            if (taskSpan.innerHTML === task) {
                insertFlag = false;
                break;
            }
        }
    }
    return insertFlag;
};

const renderTask = (task) => {
    let taskCode = `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                <div id="input-task" class="d-flex align-items-center">
                    <input name="task-status" class="form-check-input me-2" type="checkbox" value="" aria-label="..." />
                    <span class="task">${task}</span>
                </div>
                    <a href="#!" data-mdb-toggle="tooltip" title="Remove item">
                    <i class="fas fa-times text-primary"></i>
                </a>
            </li>`;
    return taskCode;
};

const renderCompletedTask = (task) => {
    let taskCode = `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                <div id="input-task" class="d-flex align-items-center">
                    <span class="task task--ready">${task}</span>
                </div>
            </li>`;
    return taskCode;
};

const insertTask = (task, checked, done) => {
    let taskList;
    let taskCode;
    if (!done) {
        taskList = querySelect("#task-list");
        if (!checked) {
            taskCode = renderTask(task);
        }
    } else {
        taskList = querySelect("#done-list");
        taskCode = renderCompletedTask(task);
    }
    taskList.insertAdjacentHTML("afterbegin", taskCode);
    refreshCheckboxAndRemovesLists();
    saveToStorage();
    return document.createTextNode(taskCode);
};

getByID("task-list").addEventListener("change", function (e) {
    if (e.target && e.target.tagName === "INPUT") {
        if (e.target.checked) {
            let taskText = getTaskText(e.target);
            taskText.classList.add("task--ready");
            insertTask(taskText.innerHTML, true, true);
            saveToStorage();
            getTaskElem(taskText).remove();
            removeFromStorage(e.target);
        }
    }
});

getByID("task-list").addEventListener("click", function (e) {
    if (e.target && e.target.tagName === "I") {
        let task = getTaskElem(e.target);
        task.remove();
        removeFromStorage(e.target.parentNode);
        refreshCheckboxAndRemovesLists();
    }
});

//code
document.addEventListener("DOMContentLoaded", function () {
    restoreFromStorage();
});

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    let taskText = getByID("form__add-task").value;
    getByID("form__add-task").value = "";
    if (taskText.trim().length !== 0 && taskExists(taskText)) insertTask(taskText, false, false);
});

completeButton.addEventListener("click", function () {
    let completedList = querySelect("#done-list-container");
    if (completedList.classList.contains("hidden")) completedList.classList.remove("hidden");
    else completedList.classList.add("hidden");
});
