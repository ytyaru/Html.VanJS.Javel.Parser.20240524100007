window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOMContentLoaded!!');
    const editor = new JavelEditor()
    editor.init()
});
window.addEventListener('beforeunload', (event) => {
    console.log('beforeunload!!');
});

