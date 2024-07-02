class FileOpener {
    static openDialog(type='file', accept='.txt, .md, .j, .ja, .jav, .jvl, .javel, text/plain') {
        return new Promise(resolve => {
            const input = document.createElement('input');
            input.type = type;
            input.accept = accept;
            input.onchange = event => { resolve(event.target.files[0]); };
            input.click();
        });
    }
    static readAsText(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = () => { resolve(reader.result); };
        });
    }
}
/*
const showOpenFileDialog = () => {
    return new Promise(resolve => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt, .md, .j, .ja, .jav, .jvl, .javel, text/plain';
        input.onchange = event => { resolve(event.target.files[0]); };
        input.click();
    });
};

const readAsText = file => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => { resolve(reader.result); };
    });
};

(async () => {
    const file = await showOpenFileDialog();
    const content = await readAsText(file);
    // 内容表示
    alert(content);
})();
*/
