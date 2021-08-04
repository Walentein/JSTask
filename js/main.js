"use strict";

let checkboxes = document.querySelectorAll("input[name='task-status']");
console.log(checkboxes);
let removes = document.querySelectorAll("[title='Remove item']");
console.log(removes);

const getRemoveElem = (element) => element.parentNode;
const getTaskElem = (element) => element.parentNode.parentNode;
const getTaskText = (element) => getTaskElem(element).querySelector(".task");

const refreshCheckboxAndRemovesLists = function(){
    checkboxes = document.querySelectorAll("input[name='task-status']");
    removes = document.querySelectorAll("[title='Remove item']");

    //console.log(checkboxes);
    //console.log(removes);
}

const insertTask = function(task){
    let taskList = document.querySelector("#task-list");
    taskList.insertAdjacentHTML("beforeend", 
    `<li id="list-item" class="list-group-item d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
    <div id="input-task" class="d-flex align-items-center">
      <input name="task-status" class="form-check-input me-2" type="checkbox" value="" aria-label="..." />
      <span class="task">${task}</span>
    </div>
    <a href="#!" data-mdb-toggle="tooltip" title="Remove item">
      <i class="fas fa-times text-primary"></i>
    </a>
  </li>
    `);
    refreshCheckboxAndRemovesLists();
    restartEventListeners();
}
const startEventListeners = function(){
    for(let checkbox of checkboxes){
        checkbox.addEventListener('change', function() {
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
        remove.addEventListener('click', function() {
            let task = getRemoveElem(this);
            console.log(task);
            task.remove();
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
            console.log(task);
            task.remove();
            refreshCheckboxAndRemovesLists();
        });
    }
}

const restartEventListeners = function(){
    stopEventListeners();
    startEventListeners();
}

startEventListeners();