let btnBlockly = document.getElementById('btnBlockly');
btnBlockly.addEventListener('click', (event) => {
    window.location.assign('./blockly/index.html');
});

let btnSimulate = document.getElementById('btnSimulate');
btnSimulate.addEventListener('click', (event) => {
    window.location.assign('./simulation/index.html');
});