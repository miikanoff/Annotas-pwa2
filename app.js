//Array de notas
let notes = []
let editingNoteId = null

function loadNotes() {
const savedNotes = localStorage.getItem('quickNotes')
// Recupera las notas guardadas en localStorage (que están en JSON), y las convierte a objeto JS.
// Si no hay notas guardadas, devuelve un array vacío.
return savedNotes ? JSON.parse(savedNotes) : []
}

notes = loadNotes()

//recibe el parametro de event que es enviar el formulario
//en java = public void saveNote(ActionEvent e)
function saveNote(event) { 

  //evita que el formulario se envie y se recargue la pagina, en java = e.consume()
  event.preventDefault() 

  // = String title = titleTextFiel.getText().trim()
  // quita espacios de inicio y fin y lo guarda en una constante title
  const title = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();

  if(editingNoteId) {
    //Update existing note
    // busca la posición en el array de la nota que está editando (por id)
    const noteIndex = notes.findIndex(note => note.id === editingNoteId)
    // actualiza el objeto nota, conservando otras propiedades con spread (...), y cambia título y contenido
    notes[noteIndex] = {
      ...notes[noteIndex], // Copia todas las propiedades de la nota original
      title: title, // Sobrescribe solo el título
      content: content // Sobrescribe solo el contenido
    }

  } else {
    //Add new note
    // añade una nueva nota al inicio del array (unshift)
    notes.unshift({
        id: generateId(),
        title: title,
        content: content
    })
  }

  closeNoteDialog()
  saveNotes()
  renderNotes()
}

function generateId() {
  //Genera un id único basado en la fecha y hora actual en milisegundos
  return Date.now().toString()
}

function saveNotes() {
  //Guarda el array de notas actualizado en localStorage, en formato JSON
  localStorage.setItem('quickNotes', JSON.stringify(notes))
}

function deleteNote(noteId) {
  //Elimina la nota con id igual a noteId, filtrando el array de notas
  notes = notes.filter(note => note.id != noteId)
  saveNotes()
  renderNotes()
}

function renderNotes() {
  const notesContainer = document.getElementById('notesContainer');

 if(notes.length === 0) {
    // muestra un mensaje cuando no hay notas (+ Add your first note)
    notesContainer.innerHTML = `
      <div class="empty-state">
        <h2>Aún no tienes notas</h2>
        <p>Crea tu primera nota para empezar!</p>
        <button class="add-note-btn" onclick="openNoteDialog()">+ Añade Tu Primera Nota</button>
      </div>
    `
    return
  } 

  // crea el HTML para mostrar cada nota en un "card", con botones para editar y borrar
  notesContainer.innerHTML = notes.map(note => `
    <div class="note-card" data-id="${note.id}">
      <h3 class="note-title">${note.title}</h3>
      <p class="note-content">${note.content}</p>
      <div class="note-actions">
        <button class="edit-btn" title="Editar nota">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
          </svg>
        </button>
        <button class="delete-btn" title="Borrar nota">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
          </svg>
        </button>
      </div>
    </div>
  `).join('');

  notesContainer.addEventListener('click', function (event) {
  const noteCard = event.target.closest('.note-card');
  if (!noteCard) return;

  const id = noteCard.dataset.id;

  if (event.target.closest('.edit-btn')) {
    openNoteDialog(id);
  }

  if (event.target.closest('.delete-btn')) {
    deleteNote(id);
  }
  });

  }

  function openNoteDialog(noteId = null) {
  const dialog = document.getElementById('noteDialog');
  const titleInput = document.getElementById('noteTitle');
  const contentInput = document.getElementById('noteContent');

  if(noteId) {
    // Edit Mode
    // Busca la nota por id para mostrar sus datos en el formulario para editar
    const noteToEdit = notes.find(note => note.id === noteId)
    editingNoteId = noteId
    document.getElementById('dialogTitle').textContent = 'Edit Note'
    titleInput.value = noteToEdit.title
    contentInput.value = noteToEdit.content
  }
  else {
    // Add Mode
    editingNoteId = null
    document.getElementById('dialogTitle').textContent = 'Añadir Nueva Nota'
    titleInput.value = ''
    contentInput.value = ''
  }

    //modal = ventana pop-up que bloquea la interaccion
    //con el resto de la interfaz hasta que el user interactue con el.
    dialog.showModal()

    //Coloca el cursor automaticamente dentro del campo de texto (titleInput) 
    //para que el user pueda empezar a escribir sin hacer clic.
    titleInput.focus()
}

function closeNoteDialog() {
  // cierra la ventana modal de edición/creación de nota
  document.getElementById('noteDialog').close()
}

function toggleTheme() {

  // alterna la clase CSS 'dark-theme' para cambiar el tema entre claro y oscuro
  const isDark = document.body.classList.toggle('dark-theme')

  // guarda la preferencia en localStorage para mantenerla entre recargas
  localStorage.setItem('theme', isDark ? 'dark' : 'light')

  // cambia el texto del boton que alterna tema para reflejar estado actual
  document.getElementById('themeToggleBtn').textContent = isDark ? '😴' : '😎'
} 

function applyStoredTheme() {
  // Aplica el tema guardado en localStorage al cargar la página
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme')
    document.getElementById('themeToggleBtn').textContent = '😴'
  }
}


//Espera a que el HTML se cargue completamente antes de ejecutar el codigo 
document.addEventListener('DOMContentLoaded',function() {
  applyStoredTheme()

  notes = loadNotes()
  renderNotes()

  //.addEventListener = escucha el evento de envio del formulario 
  // y ejecuta la funcion saveNote
  document.getElementById('noteForm').addEventListener('submit', saveNote)
  document.getElementById('themeToggleBtn').addEventListener('click',toggleTheme)

  document.getElementById('noteDialog').addEventListener('click',function(event) {

      //comprueba si el click ocurrio direcamente sobre el fondo del pop up para cerrarlo
      // === same as (a.equals(b)), comparacion estrica tanto en valor como tipo de dato
      if (event.target === this) {
          //cierra el dialogo.
          closeNoteDialog()
      }
  })

  if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error al registrar el Service Worker:', err));
    });
  }

})