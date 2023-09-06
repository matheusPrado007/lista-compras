// Global var definitions
const todoTitleInput = document.querySelector("#todoTitle");
const addTodoForm = document.querySelector("#addTodoForm");
const todoListOutput = document.querySelector("#todoList");

let allTodoList = [];
let isEditMode = false;
let selectedIndex = null;

// Main function ----------------
function start() {
  addTodoForm.addEventListener("submit", handleSubmitTodo);
  getTodoListFromLocalStorage();
  renderTodoList();
  todoTitleInput.focus();
}

// Actions functions ----------------

function handleSubmitTodo(event) {
  event.preventDefault();
  todoTitleInput.focus();
  const title = todoTitleInput.value.trim();
  if (!title) {
    clearInput();
    return;
  }
  if (isEditMode) {
    handleUpdateTodo(title);
  } else {
    handleAddTodo(title);
  }
  clearInput();
  renderTodoList();
}

function toggleTodoUpdateMode(event) {
  const itemToUpdate = Number(event.currentTarget.id.split("-")[1]);
  todoTitleInput.value = allTodoList[itemToUpdate].title;
  selectedIndex = itemToUpdate;
  isEditMode = true;
  todoTitleInput.focus();
}

function handleAddTodo(todoTitle) {
  allTodoList.push({ title: todoTitle, isDone: false });
}

function handleUpdateTodo(todoTitle) {
  allTodoList[selectedIndex].title = todoTitle;
}

function handleDeleteTodo(event) {
  let confirmDelete = confirm("Você tem certeza que quer deletar a tarefa?");
  if (confirmDelete) {
    const itemIndexToDelete = Number(event.currentTarget.id.split("-")[1]);
    allTodoList = allTodoList.filter((_, i) => i !== itemIndexToDelete);
  }
  renderTodoList();
}

function handleCompleteTodo(event) {
  const itemToComplete = Number(event.currentTarget.id.split("-")[1]);
  allTodoList.forEach((todo, index) => {
    if (index === itemToComplete) {
      todo.isDone = !todo.isDone;
    }
  });
  renderTodoList();
}

// HTML construction funciton ----------------

function createTodoItemHTML(itemData, itemIndex) {
  const { title, isDone } = itemData;
  const priceKey = `price-''`;
  const quantityKey = `quantity-''`;
  const storedPrice = localStorage.getItem(priceKey);
  const storedQuantity = localStorage.getItem(quantityKey);
  const price = storedPrice !== null ? storedPrice : '';
  const quantity = storedQuantity !== null ? storedQuantity : '';
  //prettier-ignore
  return `
    <li>
      <span class="todo-text ${isDone ? "completed" : ""}">
        <input type="checkbox" id="item-${itemIndex}" ${isDone ? "checked" : ""} />${title}</span>
      <div class="todo-info">
        <input type="number" id="price-${itemIndex}" class="todo-price price" placeholder="Preço" value="${price}" />
        <input type="number" id="quantity-${itemIndex}" class="todo-quantity price" placeholder="Quantidade" value="${quantity}" />
        <button type="button" id="calculate_item-${itemIndex}" class=" btn-calculate">Calcular</button>
        <span class="result" id="result-${itemIndex}">R$ </span>
      </div>
      <div class="todo-list-controls">
        <button type="button" id="update_item-${itemIndex}" class="btn btn-update"> <i class="far fa-edit"></i> </button>
        <button type="button" id="del_item-${itemIndex}" class="btn btn-delete"> <i class="far fa-trash-alt"></i> </button>
      </div>  
    </li>
  `;
}

// Adicione esse código para lidar com as mudanças nos campos de preço e quantidade
document.addEventListener("input", (event) => {
  const inputId = event.target.id;
  if (inputId.startsWith("price-") || inputId.startsWith("quantity-")) {
    const itemIndex = inputId.split("-")[1];
    const inputValue = event.target.value;
    localStorage.setItem(inputId, inputValue);
  }
});

// Render funciton ----------------

function renderTodoList() {
  if (allTodoList.length === 0) {
    removeTodoListFromLocalStorage();
    return (todoListOutput.innerHTML =
      "<p class='info-message'>Nenhuma tarefa cadastrada.<p>");
  }

  let todoListHTML = allTodoList.map((item, i) => {
    return createTodoItemHTML(item, i);
  });

  todoListOutput.innerHTML = todoListHTML.join("");

  allTodoList.forEach((_, i) => {
    const checkbox = document.getElementById(`item-${i}`);
    const deleteButton = document.getElementById(`del_item-${i}`);
    const updateButton = document.getElementById(`update_item-${i}`);
    const calculateButton = document.getElementById(`calculate_item-${i}`);
    const resultTag = document.getElementById(`result-${i}`);

    checkbox.addEventListener("input", handleCompleteTodo);
    deleteButton.addEventListener("click", handleDeleteTodo);
    updateButton.addEventListener("click", toggleTodoUpdateMode);

    calculateButton.addEventListener("click", () => {
      const priceInput = document.getElementById(`price-${i}`);
      const quantityInput = document.getElementById(`quantity-${i}`);

      const price = parseFloat(priceInput.value) || 0;
      const quantity = parseFloat(quantityInput.value) || 0;

      const resultado = price * quantity;
      resultTag.textContent = `R$ ${resultado}`;

      // Salvar o resultado no Local Storage
      allTodoList[i].resultado = resultado;
      setTodoListToLocalStorage();
    });

    // Certifique-se de atualizar a tag de resultado com o valor correto
    resultTag.textContent = `R$ ${allTodoList[i].resultado || ''}`;
  });

  setTodoListToLocalStorage();
}

// Handle Local Storage ----------------

function getTodoListFromLocalStorage() {
  const localStorageList = JSON.parse(localStorage.getItem("todoList"));
  if (localStorageList) {
    allTodoList = localStorageList;
  }

  allTodoList.forEach((item, i) => {
    if (localStorage.getItem(`resultado-${i}`) !== null) {
      item.resultado = parseFloat(localStorage.getItem(`resultado-${i}`));
    }
  });

  renderTodoList(); // Certifique-se de chamar a renderização após a leitura
}



function setTodoListToLocalStorage() {
  localStorage.setItem("todoList", JSON.stringify(allTodoList));
}

function removeTodoListFromLocalStorage() {
  localStorage.removeItem("todoList");
}

// Helper functions ----------------

function clearInput() {
  isEditMode = false;
  todoTitleInput.value = "";
}
// Adicione esse código após a definição das outras variáveis globais
const somaTotalButton = document.querySelector(".soma");

// ...

// Adicione esse código ao final do seu código JavaScript
somaTotalButton.addEventListener("click", calcularSomaTotal);

function calcularSomaTotal() {
  let somaTotal = 0;
  allTodoList.forEach((item) => {
    if (item.resultado) {
      somaTotal += parseFloat(item.resultado);
    }
  });

  const somaTotalResult = document.getElementById("somaTotalResult");
  somaTotalResult.textContent = `R$ ${somaTotal.toFixed(2)}`;

  // Salve o resultado no Local Storage
  localStorage.setItem("somaTotal", somaTotal.toFixed(2));
}

// Adicione essa função para carregar a soma total do Local Storage ao iniciar a página
function loadSomaTotalFromLocalStorage() {
  const somaTotal = localStorage.getItem("somaTotal");
  if (somaTotal) {
    const somaTotalResult = document.getElementById("somaTotalResult");
    somaTotalResult.textContent = `R$ ${parseFloat(somaTotal).toFixed(2)}`;
  }
}

// Chame a função para carregar a soma total do Local Storage ao iniciar a página
loadSomaTotalFromLocalStorage();

// Execute main function
start();
