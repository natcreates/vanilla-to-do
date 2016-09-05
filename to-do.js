var categoryList = ["urgent-important", "not-urgent-important", "urgent-not-important", "not-urgent-not-important"];

window.onload = function() {
	writeTasks();
}

function getToDos() {
	var toDos = [[],[],[],[]];
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
	var toDoLists = getToDos();
	for (var i=0; i < toDoLists.length; i++) {
		for (var j=0; j < toDoLists[i].length; j++) {
			writeTask(toDoLists[i][j], categoryList[i]);
		}
	}
}

function writeTask(taskItem, listCategory) {
	var list = document.getElementById(listCategory);
	var listItem = document.createElement('li');
	listItem.id = "task" + taskItem.id;
	console.log(listItem.id);
	listItem.innerHTML = '<label for="' + taskItem.id +'"><input type="checkbox" name="' + listItem.id + '">' + taskItem.info + '</label><button class="remove-button"><i class="fa fa-remove"></i></button>';
	//listItem.appendChild(document.createTextNode(newItem));
	listItem.draggable = "true";
	// listItem.addEventListener("click", dragStart(event), false);
	listItem.setAttribute("ondragstart", "return dragStart(event)");

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

function deleteTasks() {
	for (var i=0; i < categoryList.length; i++) {
		var ul = document.getElementById(categoryList[i]);
		if (ul !== null) {
			while (ul.firstChild) {
				ul.removeChild(ul.firstChild);
			}
		}
	}
}

function addTask() {
	var newToDo = document.getElementById('task-input').value;
	
	if (newToDo !== "") {
		var toDos = getToDos();
		console.log(toDos);
		var toDo = { "checked": false };
		toDo.info = newToDo;
		toDo.id = toDos.length + 1;
		toDos[3].push(toDo);
		localStorage.setItem("toDos", JSON.stringify(toDos));
		writeTasks();

		var form = document.getElementById('form');
		form.reset();
	} else {
		return false;
	}
}

function removeToDo(elem) {
	var toDos = getToDos();
	var removedTask = elem.currentTarget.parentNode;
	// get the task id, convert to number
	var removedTaskId = +removedTask.id.charAt(4);
	// search each sub-array for the id to get the index
	var i=0; 
	do {
		var toDoIndex = toDos[i].map(function(e) {
			return e.id;
		}).indexOf(removedTaskId);
		i++;
	// keep searching until the map method returns other than -1
	// don't search beyond the number of sub-arrays
	} while (toDoIndex === -1 && i < 4);

	// account for the first do-while execution incrementing i to 1
	if (toDos[i - 1].length > 1) {
		toDos[i - 1].splice(toDoIndex, 1);
	} else {
		toDos[i - 1] = [];
	}
	
	console.log(toDos[i]);
	localStorage.setItem("toDos", JSON.stringify(toDos));
	writeTasks();
}

function dragStart(event) {
	console.log('dragStart')
	event.dataTransfer.effectAllowed = 'move';
	removeToDo(event.currentTarget);
	var toDos = getToDos();
	event.dataTransfer.setData('text/html', event.currentTarget.innerHTML);
	return true;
}

function dragDrop(event) {
	console.log('dragDrop')
	var info = event.dataTransfer.getData('text/html');
	var listItem = document.createElement('li');
	listItem.innerHTML = info;
	console.log(event.currentTarget);
	event.currentTarget.appendChild(listItem);

  	event.stopPropagation();
  	return false;
}

// prevent default browser behaviour
function dragEnter(ev) {
	console.log('dragEnter')
   ev.preventDefault();
   return true;
}
function dragOver(ev) {
	console.log('dragOver')
    ev.preventDefault();
}