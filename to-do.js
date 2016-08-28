	var taskId = 1;

function newTask() {
	var newItem = document.getElementById('task-input').value;
	var list = document.getElementById('list');

	if (newItem !== "") {
		var listItem = document.createElement('li');
		taskId++;
		listItem.id = "task" + taskId;
		listItem.innerHTML = '<label for="' + taskId +'"><input type="checkbox" name="' + taskId + '">' + newItem + '</label><button class="remove-button"><i class="fa fa-remove"></i></button>';
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
		listItem.lastChild.addEventListener("click", removeTask);
		list.appendChild(listItem);

		var form = document.getElementById('form');
		form.reset();
	} else {
		return false;
	}
	
}

function removeTask(elem) {
	var removedTask = elem.currentTarget.parentNode;
	var ul = removedTask.parentNode;
	ul.removeChild(removedTask);
}
