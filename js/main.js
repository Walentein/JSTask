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

//declaring functions
const createTask = ({ id, checked, taskValue }) => (task = { id: id, checked: checked, taskValue: taskValue });

const saveItem = (key, item) => listStorage.setItem(key, item);
const getItem = (key) => listStorage.getItem(key);
const removeItem = (key) => listStorage.removeItem(key);
const clearListStorage = () => listStorage.clear();

const prepareForStaorage = (item) => JSON.stringify(item);
const retrieveFromStorage = (item) => JSON.parse(item);

const getRemoveElem = (element) => element.parentNode;
const getTaskElem = (element) => element.parentNode.parentNode;
const getTaskText = (element) => getTaskElem(element).querySelector(".task");
const getCompletedTaskList = (element) => getTaskElem(element).parentNode;

const generateID = () => Date.now();

const saveToStorage = () => {
    let taskValue;
    let id;
    let checked;
    for (let checkbox of checkboxes) {
        taskValue = getTaskText(checkbox).innerHTML;
        id = generateID();
        checked = checkbox.checked ? true : false;
        taskObj = createTask({ id, checked, taskValue });
        task = prepareForStaorage(taskObj);
        saveItem(taskObj.id, task);
    }
};

const removeFromStorage = (item) => {
    let taskText = getRemoveElem(item).querySelector(".task").innerHTML;
    for (let task of listStorage) {
        if (task.taskValue === taskText) {
            removeItem(task.id);
        }
    }
};

const restoreFromStorage = () => {
    let taskObj;
    for (let task of listStorage) {
        taskObj = retrieveFromStorage(task);
        insertTask({ taskValue: taskObj.taskValue, checked: taskObj.checked });
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

const insertTask = (task) => {
    let taskList;
    let taskCode;
    if (!task.checked) {
        taskList = querySelect("#task-list");
        taskCode = renderTask(task.taskValue);
    } else {
        taskList = querySelect("#done-list");
        taskCode = renderCompletedTask(task.taskValue);
    }
    taskList.insertAdjacentHTML("afterbegin", taskCode);
    saveToStorage();
    return document.createTextNode(taskCode);
};

//code
getByID("task-list").addEventListener("change", function (e) {
    if (e.target && e.target.tagName === "INPUT") {
        if (e.target.checked) {
            let taskText = getTaskText(e.target);
            taskText.classList.add("task--ready");
            insertTask({ checked: true, taskValue: taskText.innerHTML });
            saveToStorage();
            getTaskElem(taskText).remove();
        }
    }
});

getByID("task-list").addEventListener("click", function (e) {
    if (e.target && e.target.tagName === "I") {
        let task = getTaskElem(e.target);
        task.remove();
        removeFromStorage(e.target.parentNode);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    restoreFromStorage();
});

submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    let taskText = getByID("form__add-task").value;
    getByID("form__add-task").value = "";
    if (taskText.trim().length !== 0 && taskExists(taskText)) {
        insertTask({ taskValue: taskText, checked: false });
    }
});

completeButton.addEventListener("click", function () {
    let completedList = querySelect("#done-list-container");
    if (completedList.classList.contains("hidden")) {
        completedList.classList.remove("hidden");
    } else {
        completedList.classList.add("hidden");
    }
});
