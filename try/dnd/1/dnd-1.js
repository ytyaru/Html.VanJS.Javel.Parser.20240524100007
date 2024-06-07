function preventDefaults (e) {
  console.log(`preventDefaults`)
  e.preventDefault();
  e.stopPropagation();
}

function enabled (e) {
  console.log(`enabled`)
  console.log(this)
  console.log(this.overlay)
  console.log(this.target)
  this.target.style.filter = 'opacity(1)';
  this.target.style.visibility = 'visible';
}

function disabled (e) {
  console.log(`disabled`)
  this.target.style.filter = 'opacity(0)';
  this.target.style.visibility = 'hidden';
}

function setErrorMessage (message) {
  console.log(`setErrorMessage`)
  let messages = document.createElement('p');
  messages.id = 'error';
  messages.textContent = message;

  const importFile = document.querySelector('#form');
  if (importFile.lastChild) {
    importFile.lastChild.remove();
  }
  importFile.appendChild(messages);
}

function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

async function handleDrop (e) {
  console.log(`handleDrop`)
  console.log(e)
  console.log(e.dataTransfer.files[0].name)
  // Remove bellow 3 lines when included this code to your app
  alert('Complete uploading');
  document.querySelector('#overlay').style.filter = 'opacity(0)';
  document.querySelector('#overlay').style.visibility = 'hidden';
}
const acceptDragDrop = () => {
  const overlay = document.querySelector('#overlay');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    overlay.addEventListener(eventName, preventDefaults, false);
  });  

  window.addEventListener('dragenter', { handleEvent: enabled, target: overlay });
  overlay.addEventListener('dragleave', { handleEvent: disabled, target: overlay });
  //overlay.addEventListener('drop', { handleEvent: handleDrop, target: overlay });
  overlay.addEventListener('drop', async(e)=>{ await handleDrop(e) });
}
document.addEventListener('DOMContentLoaded', e => {
  acceptDragDrop();
});
