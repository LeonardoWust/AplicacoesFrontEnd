const items = [];
let nextId = 1;
let lastApiUrl = "";

const form       = document.getElementById("study-form");
const input      = document.getElementById("study-input");
const feedback   = document.getElementById("feedback");

const apiForm          = document.getElementById("api-form");
const apiUserIdInput   = document.getElementById("api-user-id");
const apiFeedback      = document.getElementById("api-feedback");
const statusMessage    = document.getElementById("status-message");
const reloadButton     = document.getElementById("reload-button");

const apiSubmitButton  = apiForm.querySelector('button[type="submit"]');

const list        = document.getElementById("study-list");
const emptyState  = document.getElementById("empty-state");

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = "feedback";
  if (type) {
    feedback.classList.add(`feedback--${type}`);
  }
}

function setApiFeedback(message, type = "") {
  apiFeedback.textContent = message;
  apiFeedback.className = "feedback";
  if (type) {
    apiFeedback.classList.add(`feedback--${type}`);
  }
}

function validateTitle(title) {
  if (title.length === 0) return "Digite uma atividade";
  if (title.length < 3)   return "Use pelo menos 3 caracteres";
  return "";
}

function setApiLoading(isLoading) {
  apiSubmitButton.disabled  = isLoading;
  reloadButton.disabled     = isLoading;
  apiUserIdInput.disabled   = isLoading;

  apiSubmitButton.textContent = isLoading ? "Buscando..."    : "Buscar Sugestões";
  reloadButton.textContent    = isLoading ? "Atualizando..." : "Recarregar última busca";
}

function createStudyItem(item) {
  const li = document.createElement("li");
  li.className = "study-item";
  li.dataset.id = String(item.id);

  const title = document.createElement("p");
  title.className = "study-item__title";
  title.textContent = item.title;

  const content = document.createElement("div");
  content.className = "study-item__content";

  const top = document.createElement("div");
  top.className = "study-item__top";

  const badge = document.createElement("span");
  badge.className   = item.source === "api" ? "badge badge--api" : "badge badge--manual";
  badge.textContent = item.source === "api" ? "API" : "Manual";

  const meta = document.createElement("p");
  meta.className = "study-item__meta";

  if (item.source === "api") {
    const statusLabel = item.completed ? "concluída" : "pendente";
    meta.textContent = `Sugestão remota | userId: ${item.userId} | ${statusLabel}`;
  } else {
    meta.textContent = "Item criado manualmente";
  }

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "btn btn--danger";
  removeButton.textContent = "Remover";
  removeButton.dataset.action = "remove";

  top.append(title, badge);
  content.append(top, meta);
  li.append(content, removeButton);

  return li;
}

function renderList() {
  list.replaceChildren();

  if (items.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  items.forEach((item) => {
    list.appendChild(createStudyItem(item));
  });
}

function handleFormSubmit(event) {
  event.preventDefault();

  const title = input.value.trim();
  const errorMessage = validateTitle(title);

  if (errorMessage) {
    setFeedback(errorMessage, "error");
    return;
  }

  items.unshift({
    id: nextId++,
    title,
    source: "manual",
  });

  form.reset();
  input.focus();

  setFeedback("Item adicionado com sucesso!", "success");
  renderList();
}

function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const itemElement = button.closest(".study-item");
  if (!itemElement) return;

  const id    = Number(itemElement.dataset.id);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return;

  const removedTitle = items[index].title;
  items.splice(index, 1);

  setFeedback(`Item removido: "${removedTitle}".`, "success");
  renderList();
}

async function fetchSuggestions(url) {
  setApiLoading(true);
  setApiFeedback("Carregando sugestões da API...");
  statusMessage.textContent = "Buscando...";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      setApiFeedback("Nenhuma sugestão encontrada para esse userId.", "error");
      statusMessage.textContent = "";
      return;
    }

    data.forEach((todo) => {
      items.unshift({
        id:        nextId++,
        title:     todo.title,
        source:    "api",
        userId:    todo.userId,
        completed: todo.completed,
      });
    });

    setApiFeedback(`${data.length} sugestão(ões) carregada(s) com sucesso!`, "success");
    statusMessage.textContent = `Última busca: userId ${apiUserIdInput.value || "todos"}`;
    renderList();

  } catch (error) {
    setApiFeedback(`Falha ao buscar sugestões: ${error.message}`, "error");
    statusMessage.textContent = "Erro na última busca.";
  } finally {
    setApiLoading(false);
  }
}

async function handleApiFormSubmit(event) {
  event.preventDefault();

  const userId = apiUserIdInput.value.trim();

  const url = userId
    ? `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
    : "https://jsonplaceholder.typicode.com/todos";

  lastApiUrl = url;

  await fetchSuggestions(url);
}

async function handleReload() {
  if (!lastApiUrl) {
    setApiFeedback("Nenhuma busca realizada ainda.", "error");
    return;
  }
  await fetchSuggestions(lastApiUrl);
}

form.addEventListener("submit", handleFormSubmit);
list.addEventListener("click", handleListClick);

apiForm.addEventListener("submit", handleApiFormSubmit);
reloadButton.addEventListener("click", handleReload);

input.addEventListener("input", () => {
  if (feedback.classList.contains("feedback--error")) {
    setFeedback("");
  }
});

renderList();