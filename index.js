var colors = require('colors'); 
module.exports = function (results) {
  colors.setTheme({  
      silly: 'rainbow',  
      input: 'grey',  
      verbose: 'cyan',  
      prompt: 'red',  
      info: 'green',  
      data: 'blue',  
      help: 'cyan',  
      warn: 'yellow',  
      debug: 'magenta',  
      error: 'red'  
  });
    /*
[
    {
        "filePath": "path/to/file.js",
        "messages": [
            {
                "ruleId": "curly",
                "severity": 2,
                "message": "Expected { after 'if' condition.",
                "line": 2,
                "column": 1,
                "nodeType": "IfStatement",
                "source": "if (err) console.log('failed tests: ' + err);"
            },
            {
                "ruleId": "no-process-exit",
                "severity": 2,
                "message": "Don't use process.exit(); throw an error instead.",
                "line": 3,
                "column": 1,
                "nodeType": "CallExpression",
                "source": "process.exit(1);"
            }
        ],
        "errorCount": 2,
        "warningCount": 0,
        "source": "var err = doStuff();\nif (err) console.log('failed tests: ' + err);\nprocess.exit(1);\n"
    },
    {
        "filePath": "Gruntfile.js",
        "messages": [],
        "errorCount": 0,
        "warningCount": 0
    }
]

    */
  var warningJSON = [];
  var errorJSON = [];
  for(let i = 0; i < results.length; i ++) {
    var item = results[i];
    let warningObj = {};
    let errorObj = {};
    warningObj.filePath = item.filePath;
    errorObj.filePath = item.filePath;
    warningObj.source = item.source;
    errorObj.source = item.source;
    warningObj.messages = [];
    errorObj.messages = [];
    for(let j = 0; j < item.messages.length; j ++) {
      let msg = item.messages[j];
      let severity = msg.severity;
      if(severity === 1) {
        warningObj.messages.push(msg);
      }else if(severity === 2) {
        errorObj.messages.push(msg);
      }
    }
    warningJSON.push(warningObj);
    errorJSON.push(errorObj);
  }

  displayFormatData(errorJSON);
}

function displayFormatData(jsonArray){
  let totalErrorCount = 0;
  for(let i = 0; i < jsonArray.length; i ++) {
    let item = jsonArray[i];
    let filePath = item.filePath;
    console.log('--'.grey + filePath.cyan + '--------------'.grey);
    for(let j = 0; j < item.messages.length; j ++) {
      totalErrorCount ++;
      let msg = item.messages[j];
      let ruleId = msg.ruleId;
      let message = msg.message;
      let line = msg.line;
      let column = msg.column;
      let source = msg.source;
      let type = "";
      if(msg.severity === 1) {
        type = "warn";
      }else if(msg.severity === 2) {
        type = "error";
      }
      let printOutLine11 = `[${line}:${column}]`;
      let printOutLine12 = `${type}`;
      let printOutLine13 = `${message}`;
      let printOutLine14 = `[${ruleId}]`;
      let printOutLine2 = source;
      let printOutLine3 = "";
      for(let k = 1; k < column; k ++) {
        printOutLine3 += " ";
      }
      let printOutLine2Final = "";
      for(var k = 0; k < (column-1); k ++) {
        if(printOutLine2[k] == null){
            break;
        }
        printOutLine2Final += printOutLine2[k].grey;
      }
      if(printOutLine2[k] != null){
        printOutLine2Final += printOutLine2[k].red.bold;
          k ++;
          if(k < printOutLine2.length){
            for(; k < printOutLine2.length; k ++) {
                printOutLine2Final += printOutLine2[k];
              }
          }
      }
      printOutLine3 += "^";
      let printtotalErrorCount = totalErrorCount.toString();
      console.log(printtotalErrorCount.grey + "-".grey + printOutLine11.grey + '\t\t' + printOutLine12[type] + '\t' + printOutLine13 + '\t\t\t' + printOutLine14.grey);
      console.log(printOutLine2Final);
      console.log(printOutLine3);
    }
  }
}