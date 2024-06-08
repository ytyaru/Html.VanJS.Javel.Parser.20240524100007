function preventDefaults (e) {
  console.log(`preventDefaults`)
  e.preventDefault();
  e.stopPropagation();
}

function enabled (e) {
  console.log(this)
  console.log(this.overlay)
  console.log(this.target)
//  this.overlay.style.filter = 'opacity(1)';
//  this.overlay.style.visibility = 'visible';
//  e.target.style.filter = 'opacity(1)';
//  e.target.style.visibility = 'visible';
//  console.log(e.target)
  this.target.style.filter = 'opacity(1)';
  this.target.style.visibility = 'visible';
}

function disabled (e) {
  console.log(`disabled`)
//  this.overlay.style.filter = 'opacity(0)';
//  this.overlay.style.visibility = 'hidden';
//  e.target.style.filter = 'opacity(0)';
//  e.target.style.visibility = 'hidden';
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

function handleDrop (e) {
  console.log(`handleDrop`)
  /*
  // If a file type is csv
  const ext = getExtension(e.dataTransfer.files[0].name);
  if (ext.toLowerCase() != 'csv') {
    e.preventDefault();
    e.stopPropagation();

    document.querySelector('#overlay').style.filter = 'opacity(0)';
    document.querySelector('#overlay').style.visibility = 'hidden';

    setErrorMessage('Invalid file type');
    return false;
  }

  overlay.textContent = 'Now uploading the file...';

  let formData = new FormData();
  formData.append('file', e.dataTransfer.files[0]);

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      switch (xhr.status) {
        case 200:
          location.reload();
          break;
        case 500:
          document.querySelector('#overlay').style.filter = 'opacity(0)';
          document.querySelector('#overlay').style.visibility = 'hidden';
          const errorMessage = JSON.parse(xhr.responseText)['alert'];
          setErrorMessage(errorMessage);
          break;
        default:
          break;
      }
    }
  }
  xhr.open('POST', '/upload');
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  // Uncomment a bellow line when included this code to your app
  // xhr.send(formData);
    */
  // Remove bellow 3 lines when included this code to your app
  alert('Complete uploading');
  document.querySelector('#overlay').style.filter = 'opacity(0)';
  document.querySelector('#overlay').style.visibility = 'hidden';
}
/**
 * @function acceptDragDrop
 * @description Accept a file to upload on window with drag'n'drop
 */
const acceptDragDrop = () => {
  const overlay = document.querySelector('#overlay');

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    overlay.addEventListener(eventName, preventDefaults, false);
  });  

  window.addEventListener('dragenter', { handleEvent: enabled, target: overlay });
  overlay.addEventListener('dragleave', { handleEvent: disabled, target: overlay });
  overlay.addEventListener('drop', { handleEvent: handleDrop, target: overlay });
}
document.addEventListener('DOMContentLoaded', e => {
  acceptDragDrop();
});
