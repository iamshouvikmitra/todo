// global state
var todos = []
var count = 0;
var lastItem = ''
// loading list from URL if present
window.onpopstate = ()=>{
    if(window.location.search != "")
        loadTodo()
}

window.onload = ()=>{
    if(window.location.search != "")
        loadTodo()
}



// This function is called when the page loads and is supposed to populate the todo list
// from the data available from search query in the url. This function basicially enables
// to load previously writted todos from the url. 
function loadTodo(){
    todos = JSON.parse(LZMA.decompress(base64ToBuffer(window.location.search.substr(1)))) //extracting the todos from the search parameter
    document.getElementById("demo").style.display = "none"
    // Looping over all the todos extracted and populating the view area with saved todos
    for(elem in todos){
        newItem = document.createElement("li")
        newItem.innerText = todos[elem].i
        newItem.id = "x-"+count++
        newItem.setAttribute('onclick', "removeItem(this)")
        document.getElementById("todos")
            .appendChild(
                newItem
            );
    }
}


// This function handels when users enters a new todo from the input tag. It saves the todo
// item in the array of todos and updates the UI with the new addition
function addTodo() {
    document.getElementById("demo").style.display = "none"
    // Get value
    newTodoValue = document.getElementById("todo").value
    // Validation
    if (newTodoValue == '' || newTodoValue == lastItem) {
        //do nothing
    }
    else{
        // save state
        todos.push({
            'i': newTodoValue, // item value
            's': false         // status : true is complete, false is incomplete
        })
        // update UI
        newItem = document.createElement("li")
        newItem.innerText = newTodoValue
        newItem.id = "x-"+count++
        newItem.setAttribute('onclick', "removeItem(this)")
        document.getElementById("todos")
            .appendChild(
                newItem
            );
        lastItem = newTodoValue
        save()
    }
}

function save(){
    search = JSON.stringify(todos)
    buffer = new Uint8Array(LZMA.compress(search, 9)); //compress using the LZMA Compression algorithm
    data = bufferToBase64(buffer) //create base64 string from Uint8Array
    l = window.location.origin+window.location.pathname+"?"+data //create the url
    history.replaceState({},"ToDo",l) // update the url reflecting current state
}

function removeItem(e){
    console.log(e.id)
    document.getElementById(e.id).innerHTML = e.innerText.strike() 
    for(elem in todos){
        if(todos[elem].i == e.innerText){
            todos.splice(elem,1)
        }
    }
    save()
}

function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

function base64ToBuffer(base64) {
            var binstr = atob(base64);
            var buf = new Uint8Array(binstr.length);
            Array.prototype.forEach.call(binstr, function (ch, i) {
                buf[i] = ch.charCodeAt(0);
            });
            return buf;
        }