async function fetchNotes() {
  const response = await fetch('notes.json');
  const data = await response.json();
  return data;
}

async function showCategory(category) {
  const notesContent = document.getElementById("notesContent");
  notesContent.innerHTML = "";
  const notes = await fetchNotes();
  notes[category].forEach((note, index) => {
      const noteDiv = document.createElement("div");
      noteDiv.className = "note";
      noteDiv.innerHTML = `
          <h3>${note.title}</h3>
          <p id="note-content-${category}-${index}">${note.content}</p>
          <button class="copy-button" id="copy-button-${category}-${index}" onclick="copyContent('note-content-${category}-${index}', 'copy-button-${category}-${index}')">复制</button>
      `;
      notesContent.appendChild(noteDiv);
  });
}

function copyContent(contentId, buttonId) {
  const content = document.getElementById(contentId).innerText;
  navigator.clipboard.writeText(content).then(() => {
      const button = document.getElementById(buttonId);
      button.innerText = "已复制";
      button.classList.add("copied");
      setTimeout(() => {
          button.innerText = "复制";
          button.classList.remove("copied");
      }, 2000);
  }).catch((err) => {
      console.error("复制失败:", err);
  });
}

async function globalSearch() {
  const query = document.getElementById('globalSearch').value.toLowerCase();
  const notesContent = document.getElementById('notesContent');
  notesContent.innerHTML = "";
  const notes = await fetchNotes();
  for (const category in notes) {
      notes[category].forEach((note, index) => {
          if (note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)) {
              const noteDiv = document.createElement("div");
              noteDiv.className = "note";
              noteDiv.innerHTML = `
                  <h3>${note.title}</h3>
                  <p id="note-content-${category}-${index}">${note.content}</p>
                  <button class="copy-button" id="copy-button-${category}-${index}" onclick="copyContent('note-content-${category}-${index}', 'copy-button-${category}-${index}')">复制</button>
              `;
              notesContent.appendChild(noteDiv);
          }
      });
  }
}

// 默认显示工作笔记
document.addEventListener("DOMContentLoaded", () => {
  showCategory("git");
});
