
import {initialValuesTemplate, initialValuesBlock} from "../constants/initialValues";

const getCheckSum = (_string = "") => {
  return Math.abs(_string.split("").reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }));
};

export const exportTemplateFile = (templateData, version, callback = () => {}) => {
  const saveFile = (textToSave, fileName) => {
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display: none";
    let url = "data:application/json;charset=utf-8,%EF%BB%BF" + encodeURI(textToSave);
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  
  let fileContent = JSON.parse(JSON.stringify(templateData));
  //loop blocks
  Object.entries(fileContent).forEach(([key, value]) => {
    if (key in initialValuesTemplate) {
      if (value === initialValuesTemplate[key]) {
        delete fileContent[key];
      }
    }
    if (key === "children") {
      value.forEach((block, blockId) => {
        Object.entries(block).forEach(([blockKey, blockValue]) => {
          if (blockKey in initialValuesBlock) {
            if (blockValue === initialValuesBlock[blockKey]) {
              delete fileContent.children[blockId][blockKey];
            }else if (blockKey === "style") {
              Object.entries(blockValue).forEach(([blockStyleKey, blockStyleValue]) => {
                if (blockStyleKey in initialValuesBlock.style) {
                  if (blockStyleValue === initialValuesBlock.style[blockStyleKey]) {
                    delete fileContent.children[blockId].style[blockStyleKey];
                  }
                }
              });
            }
          }
        });
      });
    }
  });
  fileContent.version = version;
  fileContent.checksum = getCheckSum(JSON.stringify(fileContent).replace(/,"checksum":\d{1,10}/, ""));
  let fileJSONContent = JSON.stringify(fileContent);
  // let fileJSONContent = JSON.stringify(fileContent, null, 2); //save with indentations
  saveFile(fileJSONContent, templateData.name + ".optydoc");
  callback();
};

export const importTemplateFile = (file, version, successCallback = (templateData) => { templateData; }, errorCallback = (err) => { err; }) => {
  let fileText = "";
  let fileReader = new FileReader();
  fileReader.onload = function () {
    fileText = fileReader.result;
    let templateData = JSON.parse(fileText);
    let valid = true;
    //check checksum
    if(templateData.checksum !== getCheckSum(fileText.replace(/,"checksum":\d{1,10}/, ""))) {
      valid = false;
      errorCallback("invalid checksum");
      return;
    }
    //check version
    if(templateData.version !== version) {
      valid = false;
      errorCallback("invalid version");
      return;
    }

    //it shoud add deleted initial values
    Object.entries(initialValuesTemplate).forEach(([initialTemplateKey, initialTemplateValue]) => {
      if(!(initialTemplateKey in templateData)) {
        templateData[initialTemplateKey] = initialTemplateValue;
      }
    });
    templateData.children.forEach((block, blockId) => {
      Object.entries(initialValuesBlock).forEach(([initialBlockKey, initialBlockValue]) => {
        if(initialBlockKey === "style") {
          Object.entries(initialBlockValue).forEach(([initialBlockStyleKey, initialBlockStyleValue]) => {
            if(!(initialBlockStyleKey in block.style)) {
              templateData.children[blockId].style[initialBlockStyleKey] = initialBlockStyleValue;
            }
          });
        }else{
          if(!(initialBlockKey in block)) {
            templateData.children[blockId][initialBlockKey] = initialBlockValue;
          }
        }
      });
    });

    if(valid) {
      successCallback(templateData);
      return;
    }else{
      errorCallback("invalid file");
      return;
    }
  };
  fileReader.readAsText(file);
};
