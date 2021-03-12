const toDoList = document.querySelector(`#todo-list`)
const addButton = document.querySelector(`.fa-plus`)
const AddTodoInput = document.querySelector(`#inputfield`)
const inputChecker = toDoList.getElementsByClassName("inputbar")
let localArray = []

// First request from API to localArray.
// This to avoid unnecessary data traffic with the API
const apiGetTolocalArray = async () => {
	const apiGetRequest = await noteGET()
	apiGetRequest.reverse().map((node) => localArray.push(node))
	return toDoNodesToDom(localArray)
}
apiGetTolocalArray()

//Building DOM
const toDoNodesToDom = () => {
	const toDoNodes = localArray.map((toDoNode) => {
		const toDo = document.createElement(`li`)
		toDo.classList.add(`todo_id_${toDoNode.id}`)
		toDo.innerHTML = `<div class="todo-container">
            <input type="checkbox">
            <input class="inputbar" type="text" value="${toDoNode.description}" disabled>
            <i class="far fa-save"></i>
            <i class="fas fa-times"></i>
            <i class="far fa-edit"></i>
            <i  class="far fa-trash-alt" name="bin"></i>
         </div>`
		addEventListeners(toDo, toDoNode)
		return toDo
	})
	toDoNodes.forEach((node) => {
		toDoList.append(node)
	})
}

AddTodoInput.addEventListener("keyup", (event) => {
	if (event.keyCode === 13) {
		event.preventDefault()
		addButton.click()
	}
})

addButton.addEventListener("click", () => {
	// This piece of code prevent to add a new todo while edit-mode(todo) is enabled)
	const inputEnabled = Array.from(inputChecker)
	const TrueOrFalse = inputEnabled.some((item) => item.disabled !== true)
	//Inputfield for adding new todos to the list
	if (AddTodoInput.value !== "" && !TrueOrFalse) {
		addButton.classList.add("transform")
		const newToDo = { description: AddTodoInput.value, done: false }
		setTimeout(() => {
			postToDoRecord(newToDo)
			AddTodoInput.value = ""
			addButton.classList.remove("transform")
		}, 400)
	} else {
		alert(
			"\r\nYou can`t add a new ToDo:\r\n\r\n  1. You have to make sure the input field is not empty \r\n \r\n2. While editing you can`t apply another, finish your editing first  "
		)
	}
})

const addEventListeners = (toDo, toDoNode) => {
	const [
		checkBtn,
		inputField,
		saveBtn,
		cancelBtn,
		editBtn,
		deleteBtn,
	] = toDo.children[0].children

	// check currunt todo for done status
	if (toDoNode.done) {
		inputField.classList.add(`line-through`)
		editBtn.classList.add("remove")
		checkBtn.checked = true
	}
	checkBtn.addEventListener("click", (event) => {
		// Marks a todo with a white line-through (status: done)
		if (event.target.checked) {
			const newToDo = { description: inputField.value, done: true }

			inputField.classList.add("line-through")
			editBtn.classList.add("remove")
			cancelBtn.classList.remove("show")
			saveBtn.classList.remove("show")
			inputField.disabled = true

			updateToDoRecord(toDoNode.id, newToDo)
		} else {
			//Removes the line-through from the todo status : undone
			const newToDo = { description: inputField.value, done: false }
			inputField.classList.remove("line-through")
			editBtn.classList.remove("remove")
			updateToDoRecord(toDoNode.id, newToDo)
		}
	})

	// Function for when you edit a new todo, and then want to confirm it by pressing enter
	inputField.addEventListener("keyup", (event) => {
		if (event.keyCode === 13) {
			event.preventDefault()
			saveBtn.click()
		}
	})
	// save todo with new values after editing
	saveBtn.addEventListener("click", () => {
		saveBtn.classList.add("transform")
		const newToDo = { description: `${inputField.value}`, done: checkBtn.checked }

		setTimeout(() => {
			editBtn.classList.remove("remove")
			cancelBtn.classList.remove("show")
			saveBtn.classList.remove("show")
			inputField.disabled = true
			saveBtn.classList.remove("transform")
		}, 400)

		updateToDoRecord(toDoNode.id, newToDo)
	})
	// cancel todo's editing mode
	cancelBtn.addEventListener("click", () => {
		cancelBtn.classList.add("transform")
		setTimeout(() => {
			inputField.disabled = true
			editBtn.classList.remove("remove")
			cancelBtn.classList.remove("show")
			saveBtn.classList.remove("show")
			cancelBtn.classList.remove("transform")
		}, 400)
	})
	// enable todo's edit mode
	editBtn.addEventListener("click", () => {
		editBtn.classList.add("remove")
		cancelBtn.classList.add("show")
		saveBtn.classList.add("show")
		inputField.disabled = false
	})

	deleteBtn.addEventListener("click", () => {
		deleteBtn.classList.add("transform")

		deleteToDoRecord(toDoNode.id, toDo)
	})
}

// update todo's and handle requests
const postToDoRecord = async (newToDo) => {
	const postToDo = await notePOST(newToDo)
	localArray.unshift(postToDo)
	toDoList.innerHTML = ""
	toDoNodesToDom(localArray)
}

const updateToDoRecord = async (id, todo) => {
	await noteEDIT(id, todo)
	localArray.map((node) => {
		if (node.id === id) {
			node.description = todo.description
			node.done = todo.done
		}
	})
}
const deleteToDoRecord = async (id, todo) => {
	await noteDELETE(id)
	const filterOut = localArray.filter((toDo) => {
		return toDo.id !== id
	})
	todo.parentNode.removeChild(todo)
	localArray = filterOut
}
