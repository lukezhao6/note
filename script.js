async function fetchNotes() {
  const response = await fetch("notes.json");
  const data = await response.json();
  return data;
}

async function showCategory(category) {
  const notesContent = document.getElementById("notesContent");
  const rightSidebar = document.getElementById("rightSidebar");
  notesContent.innerHTML = "";
  rightSidebar.innerHTML = "";

  const notes = await fetchNotes();
  const subcategories = notes[category];

  for (const subcategory in subcategories) {
    const subcategoryNotes = subcategories[subcategory];

    // Create subcategory title and anchor
    const subcategoryAnchor = document.createElement("a");
    subcategoryAnchor.name = `${category}-${subcategory}`;
    notesContent.appendChild(subcategoryAnchor);

    const subcategoryTitle = document.createElement("h2");
    subcategoryTitle.textContent = subcategory;
    notesContent.appendChild(subcategoryTitle);

    // Create right sidebar link
    const sidebarItem = document.createElement("li");
    sidebarItem.textContent = subcategory;
    sidebarItem.onclick = () => {
      document
        .getElementsByName(`${category}-${subcategory}`)[0]
        .scrollIntoView({
          behavior: "smooth",
        });
    };
    rightSidebar.appendChild(sidebarItem);

    subcategoryNotes.forEach((note, index) => {
      const noteDiv = document.createElement("div");
      noteDiv.className = "note";
      noteDiv.innerHTML = `
          <h3>${note.title}</h3>
          <p id="note-content-${category}-${subcategory}-${index}">${note.content}</p>
          <button class="copy-button" id="copy-button-${category}-${subcategory}-${index}" onclick="copyContent('note-content-${category}-${subcategory}-${index}', 'copy-button-${category}-${subcategory}-${index}')">复制</button>
        `;
      notesContent.appendChild(noteDiv);
    });
  }

  // Add scroll event listener to highlight current subcategory
  notesContent.onscroll = () => {
    let activeItem = null;
    for (const subcategory in subcategories) {
      const subcategoryAnchor = document.getElementsByName(
        `${category}-${subcategory}`
      )[0];
      const rect = subcategoryAnchor.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        activeItem = subcategory;
        break;
      }
    }
    const rightSidebarItems = rightSidebar.getElementsByTagName("li");
    for (const item of rightSidebarItems) {
      item.classList.remove("active");
      if (item.textContent === activeItem) {
        item.classList.add("active");
      }
    }
  };
}

function copyContent(contentId, buttonId) {
  const content = document.getElementById(contentId).textContent;
  navigator.clipboard.writeText(content).then(() => {
    const button = document.getElementById(buttonId);
    button.classList.add("copied");
    button.textContent = "已复制";
    setTimeout(() => {
      button.classList.remove("copied");
      button.textContent = "复制";
    }, 2000);
  });
}

async function globalSearch() {
  const query = document.getElementById("globalSearch").value.toLowerCase();
  const notesContent = document.getElementById("notesContent");
  notesContent.innerHTML = "";
  const notes = await fetchNotes();

  for (const category in notes) {
    const subcategories = notes[category];
    for (const subcategory in subcategories) {
      const subcategoryNotes = subcategories[subcategory];
      subcategoryNotes.forEach((note, index) => {
        if (
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        ) {
          const noteDiv = document.createElement("div");
          noteDiv.className = "note";
          noteDiv.innerHTML = `
              <h3>${note.title}</h3>
              <p id="note-content-${category}-${subcategory}-${index}">${note.content}</p>
              <button class="copy-button" id="copy-button-${category}-${subcategory}-${index}" onclick="copyContent('note-content-${category}-${subcategory}-${index}', 'copy-button-${category}-${subcategory}-${index}')">复制</button>
            `;
          notesContent.appendChild(noteDiv);
        }
      });
    }
  }
}

// 默认显示git笔记
document.addEventListener("DOMContentLoaded", () => {
  showCategory("git");
});
