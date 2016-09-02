window.onload = function() {
	writeTasks();
}

function getToDos() {
	var toDos = [];
	var toDoString = localStorage.getItem('toDos');
	console.log(toDoString);
	if (toDoString) {
		toDos = JSON.parse(toDoString);
		return toDos;
	} else {
		return toDos;
	}
}

function writeTasks() {
	deleteTasks();
	var toDos = getToDos();
	for (var i=0; i < toDos.length-1; i++) {
		writeTask(toDos[i]);
	}
}

function writeTask(taskItem) {
	var list = document.getElementById('list');
	var listItem = document.createElement('li');
	listItem.id = "task" + taskItem.id;
	listItem.innerHTML = '<label for="' + taskItem.id +'"><input type="checkbox" name="' + listItem.id + '">' + taskItem.info + '</label><button class="remove-button"><i class="fa fa-remove"></i></button>';
	//listItem.appendChild(document.createTextNode(newItem));
	listItem.firstChild.addEventListener("click", function(e) {

		if (e.currentTarget.classList.contains("task-done")) {
			e.currentTarget.classList.remove("task-done");
			e.currentTarget.firstChild.removeAttribute('checked');
		} else {
			e.currentTarget.classList.add("task-done");
			e.currentTarget.firstChild.setAttribute('checked', true)
		}

	});
	listItem.lastChild.addEventListener("click", removeToDo);
	list.appendChild(listItem);
}

function addTask() {
	var newToDo = document.getElementById('task-input').value;
	
	if (newToDo !== "") {
		var toDos = getToDos();
		var toDo = { "checked": false };
		toDo.info = newToDo;
		toDo.id = toDos.length + 1;
		toDos.push(toDo);
		localStorage.setItem("toDos", JSON.stringify(toDos));
		writeTasks();

		var form = document.getElementById('form');
		form.reset();
	} else {
		return false;
	}
}

// function deleteTask(elem) {
// 	var removedTask = elem.currentTarget.parentNode;
// 	var ul = removedTask.parentNode;
// 	ul.removeChild(removedTask);
// }

function removeToDo(elem) {
	var toDos = getToDos();
	var removedTask = elem.currentTarget.parentNode;
	toDos.splice(removedTask.id, 1);
	localStorage.setItem("toDos", JSON.stringify(toDos));
	writeTasks();
}

function deleteTasks() {
	var ul = document.getElementById('ul');
	if (ul !== null) {
		while (ul.firstChild) {
		ul.removeChild(ul.firstChild);
		}
	}
}
