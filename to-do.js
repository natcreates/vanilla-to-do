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
	// print the tasks for each category
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

	listItem.innerHTML = '<label for="' + taskItem.id +'"><input type="checkbox" name="' + listItem.id + '"><div class="custom-checkbox"></div>' + taskItem.info + '</label><button class="button--remove"><i class="fa fa-remove"></i></button>';
	
	// make each list item draggable
	listItem.draggable = "true";
	listItem.setAttribute("ondragstart", "return dragStart(event)");

	// change done state when clicked
	listItem.firstChild.addEventListener("click", function(e) {

		if (e.currentTarget.classList.contains("task-done")) {
			e.currentTarget.classList.remove("task-done");
			e.currentTarget.firstChild.removeAttribute('checked');
		} else {
			e.currentTarget.classList.add("task-done");
			e.currentTarget.firstChild.setAttribute('checked', true)
		}

	});


	// add task to the end of the category list
	list.appendChild(listItem);

	// hook up the remove task button
	listItem.lastChild.addEventListener("click", function(elem){removeToDo(elem.currentTarget.parentNode)});

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
		var toDo = { "checked": false };
		toDo.info = newToDo;
		toDo.id = toDoIds;

		// always push new tasks to category 3
		toDos[3].push(toDo);

		// store new task list
		localStorage.setItem("toDos", JSON.stringify(toDos));
		
		// redraw tasks
		writeTasks();

		// clear the input field
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

	// get the task id, convert to number
	var removedTaskId = +removedTask.id;
	
	// search each sub-array for the id to get the index
	for (var s = 0; s < toDos.length; s++) {
		var toDoIndex = findIndex(toDos[s], removedTaskId);

		// stop when we get the index
		if (toDoIndex !== undefined) {
			break;
		} 
	}

	if (toDos[s].length  >= 1) {
		toDos[s].splice(toDoIndex, 1);
	} else {
		toDos[s] = [];
	}

	// store and redraw the changed tasklist
	localStorage.setItem("toDos", JSON.stringify(toDos));
	writeTasks();
}

function dragStart(event) {
	event.dataTransfer.effectAllowed = 'move';
	var toDos = getToDos();
	var movedTask = event.currentTarget;
	// convert to number
	var movedTaskId = +movedTask.id;

	// search each sub-array for the id to get the index
	for (var s = 0; s < toDos.length; s++) {
		var toDoIndex = findIndex(toDos[s], movedTaskId);
		if (toDoIndex !== undefined) {
			break;
		} 
	}

	// store the task object, plus source index and category
	event.dataTransfer.setData("task",JSON.stringify(toDos[s][toDoIndex]));
	event.dataTransfer.setData("oldCategory", s);
	event.dataTransfer.setData("oldIndex", toDoIndex);
}

function dragDrop(event) {
	var droppedToDo = JSON.parse(event.dataTransfer.getData('task'));
	var oldCategory = event.dataTransfer.getData('oldCategory');
	var oldIndex = event.dataTransfer.getData('oldIndex');
	var toDos = getToDos();
	event.currentTarget.classList.remove("dragged-over");

	// remove task object from old position
	if (toDos[oldCategory].length  >= 1) {
		toDos[oldCategory].splice(oldIndex, 1);
	} else {
		toDos[oldCategory] = [];
	}

	var droppedIndex = categoryList.indexOf(event.currentTarget.id);

	// find the index of the list item we're dropping onto
	var target = toDos[droppedIndex].findIndex(function(element) {
		var targetTest;

		// check that we're getting a task id, not a category id
		if(event.target.parentNode.id.length < 2) {
			targetTest = event.target.parentNode.id;
		} else {
			targetTest = event.target.id;
		}
		return element.id == targetTest;
	});

	// insert the dropped item afterwards
	toDos[droppedIndex].splice(target + 1, 0, droppedToDo);

	// store changed tasklist and re-draw
	localStorage.setItem("toDos", JSON.stringify(toDos));
	writeTasks();

  	event.stopPropagation();
  	return false;
}

// prevent default browser behaviour
function dragEnter(ev) {
   ev.preventDefault();
   return true;
}

// apply styling to the list being dragged over
function dragOver(ev) {
    ev.preventDefault();
    ev.currentTarget.classList.add("dragged-over");
}

// remove styling
function dragLeave(ev) {
	ev.currentTarget.classList.remove("dragged-over");
}

// remove all
function deleteAll(ev) {
	// delete from the screen
	deleteTasks();
	// delete from storage
	var toDos = getToDos();
	toDos = [[],[],[],[]];
	localStorage.setItem("toDos", JSON.stringify(toDos));
	var form = document.getElementById('form');
	form.reset();
}