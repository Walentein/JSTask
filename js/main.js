"use strict";

//setting global variables
const listStorage = window.localStorage;
const tasksNumber = Object.keys(localStorage).length;

const submitButton = document.getElementById("add-task-button");
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

const stringLastWord = (text) => text.split(" ").pop();

const refreshCheckboxAndRemovesLists = function(){
    checkboxes = document.querySelectorAll("input[name='task-status']");
    removes = document.querySelectorAll("[title='Remove item']");
    restartEventListeners();
}

const saveToStorage = function(){
    let taskValue;
    for(let i = 0; i < checkboxes.length; i++){
        taskValue = getTaskText(checkboxes[i]).innerHTML;
        if(checkboxes[i].checked)
            taskValue += checkedMark;
        saveItem(i, taskValue);
    }
}

const removeFromStorage = function(element){
    let taskValue = getRemoveElem(element).querySelector(".task").innerHTML;
    let modifiedTaskValue = taskValue + checkedMark;
    for(let i = 0; i < removes.length; i++){
        if(getItem(i) === taskValue || getItem(i) === modifiedTaskValue){
            removeItem(i);
            reassignStorageKeys(i);
        }
    }
}

const reassignStorageKeys = function(startingKey){
    let tempStorage;
    for(let i = startingKey + 1; i < tasksNumber; i++)
        saveItem(i - 1, getItem(i));
    removeItem(tasksNumber - 1);
}

const restoreFromStorage = function(){
    let taskValue;
    for(let i = 0; i < tasksNumber; i++){
        taskValue = getItem(i);
        if(modifiedCheckedMark === stringLastWord(taskValue)){
            let modifiedTaskValue = taskValue.substring(0, taskValue.lastIndexOf(" "));
            insertTask(modifiedTaskValue, true);
        }else{
            insertTask(taskValue, false);
        }
    }
}

const insertTask = function(task, checked){
    let taskList = document.querySelector("#task-list");
    let taskCode;
    if(checked){
        taskCode = 
        `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
            <div id="input-task" class="d-flex align-items-center">
                <input name="task-status" class="form-check-input me-2" type="checkbox" value="" aria-label="..." checked />
                <span class="task task--ready">${task}</span>
            </div>
                <a href="#!" data-mdb-toggle="tooltip" title="Remove item">
                <i class="fas fa-times text-primary"></i>
            </a>
        </li>`
    }else{
        taskCode = 
        `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
            <div id="input-task" class="d-flex align-items-center">
                <input name="task-status" class="form-check-input me-2" type="checkbox" value="" aria-label="..." />
                <span class="task">${task}</span>
            </div>
                <a href="#!" data-mdb-toggle="tooltip" title="Remove item">
                <i class="fas fa-times text-primary"></i>
            </a>
        </li>`
    }
    taskList.insertAdjacentHTML("beforeend", taskCode);
    refreshCheckboxAndRemovesLists();
    restartEventListeners();
    saveToStorage();
    return document.createTextNode(taskCode);
}

const startEventListeners = function(){
    for(let checkbox of checkboxes){
        checkbox.addEventListener('change', function() {
            let taskText;
            if (this.checked) {
                taskText = getTaskText(this);
                taskText.classList.add("task--ready");
                saveToStorage();
            } else {
                taskText = getTaskText(this);
                taskText.classList.remove("task--ready");
                saveToStorage();
            }
        });
    }

    for(let remove of removes){
        remove.addEventListener('click', function() {
            let task = getRemoveElem(this);
            task.remove();
            removeFromStorage(this);
            refreshCheckboxAndRemovesLists();
        });
    }
}

const stopEventListeners = function(){
    for(let checkbox of checkboxes){
        checkbox.removeEventListener('change', function() {
            let taskText;
            if (this.checked) {
                taskText = getTaskText(this);
                taskText.classList.add("task--ready");
            } else {
                taskText = getTaskText(this);
                taskText.classList.remove("task--ready");
            }
        });
    }

    for(let remove of removes){
        remove.removeEventListener('click', function() {
            let task = getRemoveElem(this);
            task.remove();
            refreshCheckboxAndRemovesLists();
            saveToStorage();
        });
    }
}

const restartEventListeners = function(){
    stopEventListeners();
    startEventListeners();
}

//code
document.addEventListener('DOMContentLoaded', function(){
    restoreFromStorage();
});

startEventListeners();

submitButton.addEventListener('click', function() {
    let taskText = document.getElementById("form__add-task").value;
    document.getElementById("form__add-task").value = "";
    if(taskText)
        insertTask(taskText, false);
});