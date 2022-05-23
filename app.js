let section = document.querySelector("section")
let add = document.querySelector("form button");
add.addEventListener("click", e => {
    //prevent being form from submitted
    e.preventDefault();

    //get Value
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDay = form.children[2].value;
    console.log(todoText, todoMonth, todoDay);
    if (todoText == "") {
        alert("Please Enter some Text")
        return;
    }

    //create todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-list");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + "/" + todoDay;
    todo.appendChild(text);
    todo.appendChild(time);

    //create check and trashcan
    //check
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
    completeButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    })

    //trash can
    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    trashButton.addEventListener("click", e => {
        let todoItem = e.target.parentElement;
        todoItem.addEventListener("animationend", () => {
            let text = todoItem.children[0].innerText;
            let mylistArray = JSON.parse(localStorage.getItem("list"));
            mylistArray.forEach((item, index) => {
                if (item.todoText == text) {
                    mylistArray.splice(index, 1);
                    localStorage.setItem("list", JSON.stringify(mylistArray))
                }
            })
            todoItem.remove();
        })
        todoItem.style.animation = "scaledown 0.5s forwards"

    })

    //clear the text
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";


    //append Child area
    todo.appendChild(completeButton);
    todo.appendChild(trashButton);
    todo.style.animation = "scaleup 0.5s forwards"

    //create an object
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDay: todoDay
    };

    //store data into an array of objects
    //if localstorage have not anything
    let mylist = localStorage.getItem("list");
    if (mylist == null) {
        localStorage.setItem("list", JSON.stringify([myTodo]));

    } else {
        let mylistArray = JSON.parse(mylist);
        mylistArray.push(myTodo);
        localStorage.setItem("list", JSON.stringify(mylistArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));


    section.appendChild(todo);

})
loadData();

function loadData() {
    let mylist = localStorage.getItem("list");
    if (mylist != null) {
        let mylistArray = JSON.parse(mylist);
        mylistArray.forEach(item => {
            //creat a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("P");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + "/" + item.todoDay;
            todo.appendChild(text);
            todo.appendChild(time);

            //create check and trashcan
            //check
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
            completeButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            })

            //trash can
            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
            trashButton.addEventListener("click", e => {
                let todoItem = e.target.parentElement;
                todoItem.addEventListener("animationend", () => {
                    //remove from localStorage
                    let text = todoItem.children[0].innerText;
                    let mylistArray = JSON.parse(localStorage.getItem("list"));
                    mylistArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            mylistArray.splice(index, 1);
                            localStorage.setItem("list", JSON.stringify(mylistArray))
                        }
                    })
                    todoItem.remove();
                })
                todoItem.style.animation = "scaledown 0.5s forwards"

            })
            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        })
    }
}


function mergeTIme(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
            if (Number(arr1[i].todoDay) > Number(arr2[j].todoDay)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }
    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }
    return result;
}

function mergesort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTIme(mergesort(right), mergesort(left));
    }
}
console.log(mergesort(JSON.parse(localStorage.getItem("list"))));


let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    //sort data
    let sortedArray = mergesort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    //remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    //laod data
    loadData();
})