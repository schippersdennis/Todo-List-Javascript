const toDoList = document.querySelector(`#todo-list`);
const addButton = document.querySelector(`.fa-plus`);
const AddTodoInput = document.querySelector(`#inputfield`);
const inputChecker = toDoList.getElementsByClassName('inputbar')
let localeArray = [];



const apiGetTolocaleArray = async () => {
   const apiGetRequest = await noteGET();
   apiGetRequest.reverse().map(node => localeArray.unshift(node));

   return toDoNodesToDom(localeArray);
}
apiGetTolocaleArray();



const toDoNodesToDom = () => {
   const toDoNodes = localeArray.map(toDoNode => {
      const toDo = document.createElement(`li`);
      toDo.classList.add(`${toDoNode._id}`);

      toDo.innerHTML =
         `<div id="class="${toDoNode._id}" class="todo-container">
            <input class=" ${toDoNode.done} checkbox ${toDoNode._id} " type="checkbox">
            <input class="inputbar" type="text" state="${toDoNode.done}" value="${toDoNode.description}" disabled>
            <i class="far fa-save ${toDoNode._id}"></i>
            <i class="fas fa-times ${toDoNode._id}"></i>
            <i class="far fa-edit ${toDoNode._id}"></i>
            <i  class="far fa-trash-alt ${toDoNode._id}"  name="bin"></i>
         </div>`;


      const inputField = toDo.children[0].children[1].classList;
      const editbtn = toDo.children[0].children[4];
      const checkBox = toDo.children[0].children[0];

      if (toDoNode.done) {
         inputField.add(`line-through`);
         editbtn.classList.add('remove');
         checkBox.checked = true;
      }
      addEventListeners(toDo);


      return toDo;
   });

   toDoNodes.forEach(node => {
      toDoList.append(node);
   });
};



AddTodoInput.addEventListener("keyup", (event) => {
   newToDo.description = event.target.value;
   if (event.keyCode === 13) {
      event.preventDefault();

      addButton.click();
   };
});



addButton.addEventListener('click', () => {
   const inputEnabled = Array.from(inputChecker)
   const TrueOrFalse = inputEnabled.some(item => item.disabled !== true)
 
console.log(TrueOrFalse)
   if (AddTodoInput.value !== "" && !TrueOrFalse) {
      addButton.classList.add('transform');
      setTimeout(() => {
         postToDoRecord(AddTodoInput.value);
         AddTodoInput.value = '';
         addButton.classList.remove('transform');
      }, 400);

   } else {
      alert('\r\nYou can`t add a new ToDo:\r\n\r\n  1. You have to make sure the input field is not empty \r\n \r\n2. While editing you can`t apply another, finish your editing first  ')
   };
});



const addEventListeners = (toDo) => {
   const checkBtn = toDo.children[0].children[0];
   const inputField = toDo.children[0].children[1];
   let oldValue = null;
   const saveBtn = toDo.children[0].children[2];
   const cancelBtn = toDo.children[0].children[3];
   const editBtn = toDo.children[0].children[4];
   const deleteBtn = toDo.children[0].children[5];


   checkBtn.addEventListener('click', (event) => {
      if (event.target.checked) {
         RECORD_ID = event.target.classList[2]
         newToDo = { description: inputField.value, done: true };

         inputField.classList.add('line-through');
         editBtn.classList.add('remove');
         cancelBtn.classList.remove('show');
         saveBtn.classList.remove('show');
         inputField.disabled = true;

         updateToDoRecord();

      } else {
         RECORD_ID = event.target.classList[2];
         newToDo = { description: inputField.value, done: false };

         inputField.classList.remove('line-through');
         editBtn.classList.remove('remove');

         updateToDoRecord();
      };
   });


   inputField.addEventListener("keyup", (event) => {
      newToDo.description = event.target.value;
      if (event.keyCode === 13) {
         event.preventDefault();
         saveBtn.click();
      };
   });



   saveBtn.addEventListener('click', (event) => {
      saveBtn.classList.add('transform');
      RECORD_ID = event.target.classList[2];
      newToDo = { description: `${inputField.value}`, done: checkBtn.checked };

      setTimeout(() => {
         editBtn.classList.remove('remove');
         cancelBtn.classList.remove('show');
         saveBtn.classList.remove('show');
         inputField.disabled = true;
         saveBtn.classList.remove('transform');
      }, 400);

      updateToDoRecord(toDo);
   });



   cancelBtn.addEventListener('click', () => {
      cancelBtn.classList.add('transform');
      inputField.value = oldValue;

      setTimeout(() => {
         inputField.disabled = true;
         editBtn.classList.remove('remove');
         cancelBtn.classList.remove('show');
         saveBtn.classList.remove('show');
         cancelBtn.classList.remove('transform');
      }, 400);
   });



   editBtn.addEventListener('click', () => {
      editBtn.classList.add('remove');
      cancelBtn.classList.add('show');
      saveBtn.classList.add('show');
      inputField.disabled = false;
      oldValue = inputField.value;
   })



   deleteBtn.addEventListener('click', (event) => {
      deleteBtn.classList.add('transform');
      const recordId = event.target.classList[2];

      deleteToDoRecord(recordId, toDo);
   });
};



const postToDoRecord = async () => {
   const postToDo = await notePOST();
   localeArray.unshift(postToDo);

   toDoList.innerHTML = '';
   toDoNodesToDom();
}



const updateToDoRecord = async () => {
   await noteEDIT();

   localeArray.map(node => {
      if (node._id === RECORD_ID) {
         node.description = newToDo.description;
         node.done = newToDo.done;
      };
   });
   newToDo = { description: "", done: false };
};



const deleteToDoRecord = async (recordId, toDo) => {
   RECORD_ID = recordId;
   await noteDELETE();

   const filterOut = localeArray.filter(toDo => {
      if (toDo._id !== recordId) {
         return toDo;
      };
   });

   toDo.parentNode.removeChild(toDo);
   localeArray = filterOut;
};