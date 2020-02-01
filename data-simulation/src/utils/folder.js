const fs = require('fs');

function createBaseFolder(hierarchy) {
  const { root, subs } = hierarchy;

  if (!fs.existsSync(root)) {
    fs.mkdirSync(root);
  }

  subs.forEach(sub => {
    const subFolderPath = `${root}/${sub}`;
    if (!fs.existsSync(subFolderPath)) {
      fs.mkdirSync(subFolderPath);
    }
  })
}

function createFolder(parentFolder, folders) {
  folders.forEach(f => {
    const subFolderPath = `${parentFolder}/${f}`;
    if (!fs.existsSync(subFolderPath)) {
      fs.mkdirSync(subFolderPath);
    }
  })
}

module.exports = {
  createBaseFolder,
  createFolder
}
