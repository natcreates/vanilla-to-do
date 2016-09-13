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

function removeToDo(elem) {
	var toDos = getToDos();
	var removedTask = elem.currentTarget.parentNode;
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
	console.log(event.currentTarget);
	removeToDo(event.currentTarget);
	var toDos = getToDos();
	var draggedToDo = toDos.findIndex(event.currentTarget.id);
	event.dataTransfer.setData("task",JSON.stringify(draggedToDo));
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