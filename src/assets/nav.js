const settings = require('electron-settings');

function hideAllSectionsAndDeselectButtons() {
    const sections = document.querySelectorAll('.is-shown');
    Array.prototype.forEach.call(sections, (section) => {
        section.classList.remove('is-shown');
    });
}

function renderSection(section) {
    console.log(section);
    hideAllSectionsAndDeselectButtons();

    // Highlight clicked button and show view
    event.target.classList.add('is-selected');

    // Display the current section
    const sectionId = `${event.target.dataset.section}-section`;
    document.getElementById(sectionId).classList.add('is-shown');

    // Save currently active button in localStorage
    const buttonId = event.target.getAttribute('id');
    settings.set('activeSectionButtonId', buttonId);
}

document.body.addEventListener('click', (event) => {
    if (event.target.dataset.section) {
        renderSection(event.target.dataset.section);
    }
});