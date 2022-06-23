const compareArr = (a, b) => {
  if(!(a && b)) {
    return false;
  }
  let isDifferent = true;
  if(a.length !== b.length) {
    return false;
  }
  a.forEach((av, ai) => {
    b.forEach((bv, bi) => {
      if(ai === bi && av !== bv) {
        isDifferent = false;
      }
    });
  });
  return isDifferent;
};

export const exportCSVFile = (columnsTitles, columnsRows, templateName) => {
  const saveTable = (textToSave, fileName) => {
    let link = document.createElement("a");
    document.body.appendChild(link);
    link.style = "display: none";
    let url = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(textToSave);
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  };
  if(columnsTitles.length && columnsRows[0].length) {
    columnsTitles = [columnsTitles].concat(columnsRows.map(row => {
      const rowToSave = row.map(cell => {
        let cellToSave = cell.replace(/\n/g, "%2F");
        if(cell.includes(",")) {
          cellToSave = `"${cell}"`;
        }
        return cellToSave;
      }).join(",");
      return rowToSave;
    })).join("\r\n");
  }
  saveTable(columnsTitles, templateName + "_table.csv");
};

export const importCSVFile = (e, fileType, copiesColumns, callBack = (tableData) => { tableData; }) => {
  let file = e.target.files[0];
  let fileText = "";
  if(file.name.substr(-(fileType.length), fileType.length) === fileType) {
    //geting text value of csv file
    let fr = new FileReader();
    fr.onload = function () {
      //parsing csv
      fileText = fr.result;
      function parseCSV (str) {
        var arr = [];
        var quote = false;
        for (var row = 0, col = 0, c = 0; c < str.length; c++) {
          var cc = str[c], nc = str[c + 1];
          arr[row] = arr[row] || [];
          arr[row][col] = arr[row][col]?.replace(/(%2F)/g, "\n") || "";
          if (cc === "\"" && quote && nc === "\"") { arr[row][col] += cc; ++c; continue; }
          if (cc === "\"") { quote = !quote; continue; }
          if (cc === "," && !quote) { ++col; continue; }
          if (cc === "\r" && nc === "\n" && !quote) { ++row; col = 0; ++c; continue; }
          if (cc === "\n" && !quote) { ++row; col = 0; continue; }
          if (cc === "\r" && !quote) { ++row; col = 0; continue; }
          arr[row][col] += cc;
        }
        return arr;
      }
      let formatedTableData = parseCSV(fileText);
              
      //check length of all rows
      if(compareArr(formatedTableData[0], copiesColumns.map(col => { return col.title; }))) {
        let valid = true;
        formatedTableData.forEach((row) => {
          if(row.length !== formatedTableData[0].length) {
            valid = false;
          }
        });
        if(valid) {
          callBack(formatedTableData);
        }else{
          alert("invalid table | неправильна таблиця");
          console.log("invalid table");
        }
      }else{
        alert("wrong table size | неправильний розмір таблиці");
        console.log("wrong size");
      }
    };                        
    fr.readAsText(file);
  }
};