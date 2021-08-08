"use strict";

//setting global variables
const listStorage = window.localStorage;
let totalTasksNumber = Object.keys(localStorage).length;

const submitButton = document.getElementById("add-task-button");
const completeButton = document.getElementById("show-completed-button");
let checkboxes = document.querySelectorAll("input[name='task-status']");
let removes = document.querySelectorAll("[title='Remove item']");

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

const refreshCheckboxAndRemovesLists = function () {
    checkboxes = document.querySelectorAll("input[name='task-status']");
    removes = document.querySelectorAll("[title='Remove item']");
    restartEventListeners();
};

const calculateCompletedTasks = function () {
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

const recalcTaskVariables = function () {
    totalTasksNumber = Object.keys(localStorage).length;
    completedTasksNumber = calculateCompletedTasks();
    tasksNumber = totalTasksNumber - completedTasksNumber;
    insertPosition = completedTasksNumber + 10000;
};

const saveToStorage = function () {
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

const saveCompletedTask = function (item) {
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

const reassignStorageKeys = function (startingKey, flagCompletedTasks) {
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

const removeCompletedTask = function (item) {
    let taskText = item + checkedMark;
    for (let i = 10000; i < insertPosition + 1; i++) {
        if (taskText === getItem(i)) {
            removeItem(i);
            reassignStorageKeys(i, true);
        }
    }
};

const removeFromStorage = function (element) {
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

const restoreFromStorage = function () {
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

const completedTaskExists = function (task) {
    let insertFlag = true;
    let tempTask;
    let taskSpans = document.querySelectorAll(".task--ready");
    for (let taskSpan of taskSpans) {
        tempTask = getCompletedTaskList(taskSpan);
        if (tempTask.id === "done-list")
            if (taskSpan.innerHTML === task) {
                insertFlag = false;
                break;
            }
    }
    return insertFlag;
};

const insertTask = function (task, checked, done) {
    if (!completedTaskExists(task)) return -1;
    let taskList;
    let taskCode;
    if (!done) {
        taskList = document.querySelector("#task-list");
        if (checked) {
            taskCode = `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                <div id="input-task" class="d-flex align-items-center">
                    <input name="task-status" class="form-check-input me-2" type="checkbox" value="" aria-label="..." checked />
                    <span class="task task--ready">${task}</span>
                </div>
                    <a href="#!" data-mdb-toggle="tooltip" title="Remove item">
                    <i class="fas fa-times text-primary"></i>
                </a>
            </li>`;
        } else {
            taskCode = `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                <div id="input-task" class="d-flex align-items-center">
                    <input name="task-status" class="form-check-input me-2" type="checkbox" value="" aria-label="..." />
                    <span class="task">${task}</span>
                </div>
                    <a href="#!" data-mdb-toggle="tooltip" title="Remove item">
                    <i class="fas fa-times text-primary"></i>
                </a>
            </li>`;
        }
    } else {
        taskList = document.querySelector("#done-list");
        taskCode = `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
                <div id="input-task" class="d-flex align-items-center">
                    <span class="task task--ready">${task}</span>
                </div>
            </li>`;
    }
    taskList.insertAdjacentHTML("beforeend", taskCode);
    refreshCheckboxAndRemovesLists();
    restartEventListeners();
    saveToStorage();
    return document.createTextNode(taskCode);
};

const startEventListeners = function () {
    for (let checkbox of checkboxes) {
        checkbox.addEventListener("change", function () {
            let taskText;
            if (this.checked) {
                taskText = getTaskText(this);
                if (!taskText.classList.contains("task--ready")) {
                    taskText.classList.add("task--ready");
                    insertTask(taskText.innerHTML, true, true);
                    saveToStorage();
                }
            } else {
                taskText = getTaskText(this);
                if (taskText.classList.contains("task--ready")) {
                    taskText.classList.remove("task--ready");
                    saveToStorage();
                }
                removeCompletedTask(taskText.innerHTML);
            }
        });
    }

    for (let remove of removes) {
        remove.addEventListener("click", function () {
            let task = getRemoveElem(this);
            task.remove();
            removeFromStorage(this);
            refreshCheckboxAndRemovesLists();
        });
    }
};

const stopEventListeners = function () {
    for (let checkbox of checkboxes) {
        checkbox.removeEventListener("change", function () {});
    }

    for (let remove of removes) {
        remove.removeEventListener("click", function () {});
    }
};

const restartEventListeners = function () {
    stopEventListeners();
    startEventListeners();
};

//code
document.addEventListener("DOMContentLoaded", function () {
    restoreFromStorage();
});

startEventListeners();

submitButton.addEventListener("click", function () {
    let taskText = document.getElementById("form__add-task").value;
    document.getElementById("form__add-task").value = "";
    if (taskText) insertTask(taskText, false, false);
});

completeButton.addEventListener("click", function () {
    let completedList = document.querySelector("#done-list-container");
    if (completedList.classList.contains("hidden")) completedList.classList.remove("hidden");
    else completedList.classList.add("hidden");
});
