class ToDo {
    constructor(task, date) {
        this.task = task;
        this.date = date;
    }
}

let tasks = [];

function addTask(todo) {
    let tableTask = document.getElementById("to-do-table");
    let tableRow = tableTask.insertRow();

    let checkboxCell = tableRow.insertCell();
    checkboxCell.classList.add("checkbox")
    checkboxCell.appendChild(createCheckbox());

    let taskCell = tableRow.insertCell();
    let p = document.createElement("p");
    let pText = document.createTextNode(todo.task);
    p.appendChild(pText);
    taskCell.classList.add("task");
    taskCell.appendChild(p);

    let dateCell = tableRow.insertCell();
    let pDate = document.createElement("p");
    let pTextDate = document.createTextNode(todo.date);
    pDate.appendChild(pTextDate);
    dateCell.classList.add("date");
    dateCell.appendChild(pDate);

    let deleteCell = tableRow.insertCell();
    deleteCell.classList.add("delete-button");
    deleteCell.appendChild(createDeleteButton());
}

function createDeleteButton() {
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-task-button");
    let deleteButtonBody = document.createTextNode("Usuń");
    deleteButton.appendChild(deleteButtonBody);

    deleteButton.onclick = function () {

        let row = deleteButton.closest("tr");
        let index = row.rowIndex - 1;

        row.remove();
        tasks.splice(index, 1);
        localStorage.setItem("tasksLocalStorage", JSON.stringify(tasks));

        draw();
    }

    return deleteButton;
}

function createCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    return checkbox;
}

function draw() {
    let todoTable = document.getElementById("to-do-table");

    let rowCount = todoTable.rows.length;
    for (let i = rowCount - 1; i > 0; i--) {
        todoTable.deleteRow(i);
    }

    tasks = JSON.parse(localStorage.getItem("tasksLocalStorage"));
    for (let task of tasks) {
        addTask(task);
    }
}

function addFromInput() {
    let addButton = document.getElementById("add-task-button");
    addButton.onclick = function () {
        let taskName = document.getElementById("task-name-input");
        if (taskName.value.length < 3) {
            alert("Nazwa zadania musi zawierać minimum 3 znaki.");
            return;
        } else if (taskName.value.length > 255) {
            alert("Nazwa zadania nie może zawierać więcej niż 255 znaków.")
            return;
        }

        let taskDate = document.getElementById("task-date-input");
        const inputDate = new Date(taskDate.value);
        const currentDate = new Date();
        if (inputDate < currentDate) {
            alert("Niepoprawna data.")
            return;
        }

        let toDo = new ToDo(taskName.value, taskDate.value);
        tasks.push(toDo);
        localStorage.setItem("tasksLocalStorage", JSON.stringify(tasks));

        taskName.value = "";
        taskDate.value = "";

        draw();
    }
}

function editTasks() {
    document.addEventListener("click", function () {
        const taskCells = document.querySelectorAll(".task");
        const dateCells = document.querySelectorAll(".date");

        taskCells.forEach(function (cell) {
            editCell(cell, false);
        });

        dateCells.forEach(function (cell) {
            editCell(cell, true);
        });
    });

}

function editCell(cell, isDate) {
    cell.addEventListener('click', function () {

        const input = document.createElement("input");
        if (isDate) {
            input.type = "date";
        }
        input.value = cell.querySelector("p").textContent;

        let index = null;

        if (isDate) {
            for (let todo of tasks) {
                if (input.value === todo.date) {
                    index = tasks.indexOf(todo);
                }
            }
        } else {
            for (let todo of tasks) {
                if (input.value === todo.task) {
                    index = tasks.indexOf(todo);
                }
            }
        }

        cell.innerHTML = "";
        cell.appendChild(input);

        input.focus();

        input.addEventListener("blur", function () {
            cell.innerHTML = `<p>${input.value}</p>`;
            if (isDate) {
                tasks[index].date = input.value;
            } else {
                tasks[index].task = input.value;
            }
            localStorage.setItem("tasksLocalStorage", JSON.stringify(tasks));
            tasks = JSON.parse(localStorage.getItem("tasksLocalStorage"));
        });
    });
}

function searchTasks() {
    let searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", function () {
        const searchText = this.value;
        filterTasks(searchText);
    });
}

function filterTasks(searchText) {
    const rows = document.querySelectorAll("#to-do-table tr");
    for (let row of rows) {
        const taskCell = row.querySelector(".task p");
        if (taskCell) {
            const taskText = taskCell.textContent;
            const markedText = markSearchText(taskText, searchText);
            taskCell.innerHTML = markedText;

            row.style.display = taskText.includes(searchText) ? "" : "none";
        }
    }
}

function markSearchText(text, searchText) {
    const lowerText = text.toLowerCase();
    const lowerSearchText= searchText.toLowerCase();
    const index = lowerText.indexOf(lowerSearchText);

    if (index !== -1) {
        const before = text.substring(0, index);
        const match = text.substring(index, index + searchText.length);
        const after = text.substring(index + searchText.length);
        return before + `<mark>${match}</mark>` + after;
    } else {
        return text;
    }
}
draw();
addFromInput();
draw();
editTasks();
searchTasks();

// function testData() {
//     let task = new ToDo("test1", "2020-01-01");
//     tasks.push(task);
//     let task2 = new ToDo("test2", "2020-02-02");
//     tasks.push(task2);
//     let task3 = new ToDo("test3", "2020-03-03");
//     tasks.push(task3);
//     draw();
// }
