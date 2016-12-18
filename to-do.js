var categoryList = ["urgent-important", "not-urgent-important", "urgent-not-important", "not-urgent-not-important"];
var toDoIds = 0;

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
	listItem.id = taskItem.id;
	console.log(listItem.id);
	listItem.innerHTML = '<label for="' + taskItem.id +'"><input type="checkbox" name="' + listItem.id + '"><div class="custom-checkbox"></div>' + taskItem.info + '</label><button class="remove-button"><i class="fa fa-remove"></i></button>';
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
	listItem.lastChild.addEventListener("click", function(elem){removeToDo(elem.currentTarget.parentNode)});
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
		toDoIds++;
		console.log(toDos);
		var toDo = { "checked": false };
		toDo.info = newToDo;
		toDo.id = toDoIds;
		toDos[3].push(toDo);
		localStorage.setItem("toDos", JSON.stringify(toDos));
		writeTasks();

		var form = document.getElementById('form');
		form.reset();
	} else {
		return false;
	}
}


function findIndex(array, value) {
	for (var count=0; count < array.length; count++) {
		if (array[count].id === value) {
			return count;
		} 
	}
}

function removeToDo(removedTask) {
	var toDos = getToDos();
	console.log(removedTask);
	// get the task id, convert to number
	var removedTaskId = +removedTask.id;
	console.log(removedTaskId);
	// search each sub-array for the id to get the index

	for (var s = 0; s < toDos.length; s++) {
		var toDoIndex = findIndex(toDos[s], removedTaskId);
		if (toDoIndex !== undefined) {
			break;
		} 
	}
	console.log(toDoIndex);
	console.log(s);

	if (toDos[s].length  >= 1) {
		toDos[s].splice(toDoIndex, 1);
	} else {
		toDos[s] = [];
	}

	//var count = 0; 
	//do {
	//	console.log(toDos[count]);
	//	var toDoIndex = toDos.findIndex(function(e) {
	//		e.id === removedTaskId;
	//	});
	//	count++;
	// keep searching until the map method returns other than -1
	// don't search beyond the number of sub-arrays
	//} while (toDoIndex === -1 && count < 4);
	console.log(toDoIndex);
	// account for the first do-while execution incrementing i to 1
	//if (toDos[count - 1].length >= 1) {
	//	toDos[count - 1].splice(toDoIndex, 1);
	//} else {
	//	toDos[count - 1] = [];
	//}
	//count = 0;
	console.log(toDos);
	localStorage.setItem("toDos", JSON.stringify(toDos));
	writeTasks();
}

function dragStart(event) {
	console.log('dragStart')
	event.dataTransfer.effectAllowed = 'move';
	var toDos = getToDos();
	var movedTask = event.currentTarget;
	var movedTaskId = +movedTask.id;
	// search each sub-array for the id to get the index

	for (var s = 0; s < toDos.length; s++) {
		var toDoIndex = findIndex(toDos[s], movedTaskId);
		if (toDoIndex !== undefined) {
			break;
		} 
	}

	event.dataTransfer.setData("task",JSON.stringify(toDos[s][toDoIndex]));
	event.dataTransfer.setData("oldCategory", s);
	event.dataTransfer.setData("oldIndex", toDoIndex);
}

function dragDrop(event) {
	console.log('dragDrop')
	var droppedToDo = JSON.parse(event.dataTransfer.getData('task'));
	var oldCat = event.dataTransfer.getData('oldCategory');
	var oldIndex = event.dataTransfer.getData('oldIndex');
	var toDos = getToDos();

	if (toDos[oldCat].length  >= 1) {
		toDos[oldCat].splice(oldIndex, 1);
	} else {
		toDos[oldCat] = [];
	}

	var droppedIndex = categoryList.indexOf(event.target.id);
	console.log(droppedIndex);
	toDos[droppedIndex].push(droppedToDo);
	console.log('dropped todo', droppedToDo);
	localStorage.setItem("toDos", JSON.stringify(toDos));
	writeTasks();

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

// remove all
function deleteAll(ev) {
	deleteTasks();
	var toDos = getToDos();
	toDos = [[],[],[],[]];
	localStorage.setItem("toDos", JSON.stringify(toDos));
	var form = document.getElementById('form');
	form.reset();
}