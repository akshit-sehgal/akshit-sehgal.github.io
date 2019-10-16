"use strict";

var textout = document.getElementById("output"),
  targetOrigin,
  win = document.getElementById("writer-iframe").contentWindow;
//win = document.getElementById("paste-iframe").contentWindow;
var isRemote =
  document.querySelector("input[name=mode]:checked").value === "Remote";
function closeLeftPanel() {
  document.querySelector("#app-settings").parentNode.style.display = "none";
}
function writeData(msg, data) {
  console.log(msg, data);
  textout.value += "\n" + msg + ": " + JSON.stringify(data);
}
function acceptTC(id) {
  !isRemote &&
    XDC.postMessage({
      message: "ReviewChanges",
      data: { action: "AcceptAll" },
      oncomplete: function(data) {
        writeData("ReviewChanges", data);
      },
      onexception: function(data) {
        writeData(this.message, data);
      }
    });
  return false;
}
function rejectTC(id) {
  !isRemote &&
    XDC.postMessage({
      message: "ReviewChanges",
      data: { action: "RejectAll" },
      oncomplete: function(data) {
        writeData("ReviewChanges", data);
      },
      onexception: function(data) {
        writeData(this.message, data);
      }
    });
  return false;
}
function insertContent() {
  var content = document.querySelector("input[name=insertcontent]").value,
    type = document.querySelector("input[name=inserttype]:checked").value;
  if (isRemote) {
    var msg = {
      func:
        type === "html"
          ? "RemoteEditor.insertHTML"
          : "RemoteEditor.insertContent",
      params: [content]
    };
    win.postMessage(msg, targetOrigin);
  } else {
    var formFieldInfo = {
        type: "fillablefield",
        ffinfo: {
          fftype: "text",
          name: "Car",
          value: "Civic"
        }
      },
      formFieldTextInfo = { cls: "fillablefield" };

    XDC.postMessage({
      message: "InsertContent",
      //data: {content: "<p><span data-fillablefield-info='"+JSON.stringify(formFieldInfo)+"' data-text-info='"+JSON.stringify(formFieldTextInfo)+"'>#</span></p>", contentType: type},
      data: { content: content, contentType: type },
      oncomplete: function(data) {
        writeData(this.message, data);
      },
      onexception: function(data) {
        writeData(this.message, data);
      }
    });
  }
  return false;
}
function insertTextField(isUpdate) {
  if (isRemote) {
    return;
  }

  var id = document.querySelector("input[name=getFieldById]").value;
  var ffInfo = {
    formFieldId: id,
    formFieldName: document.querySelector("input[name=text-field-name]").value,
    formFieldValue: document.querySelector("input[name=text-field-value]").value
  };
  var msg = isUpdate
    ? id
      ? "UpdateFormFieldById"
      : "UpdateFormFieldsByName"
    : "InsertFormField";
  //win.postMessage({execute: [msg, ffInfo], id: Date.now()}, targetOrigin);
  XDC.postMessage({
    message: msg,
    data: ffInfo,
    oncomplete: function(data) {
      writeData(msg, data);
    },
    onexception: function(data) {
      writeData(this.message, data);
    }
  });
}

/*function getFormFieldById(){
    if (isRemote) { return; }

    !isRemote && XDC.postMessage({
        message: "GetFormField",
        data: {id: document.querySelector("input[name=getFieldById]").value},
        oncomplete: function(data){
            writeData("GetFormField", data);
        }
    });
};*/
function getAllFormFields() {
  if (isRemote) {
    return;
  }

  !isRemote &&
    XDC.postMessage({
      message: "GetAllFormFields",
      oncomplete: function(data) {
        writeData("GetAllFormFields", data);
      },
      onexception: function(data) {
        writeData(this.message, data);
      }
    });
}
function removeFormFieldById() {
  if (isRemote) {
    return;
  }

  !isRemote &&
    XDC.postMessage({
      message: "RemoveFormField",
      data: { id: document.querySelector("input[name=getFieldById]").value },
      oncomplete: function(data) {
        writeData("RemoveFormField", data);
      },
      onexception: function(data) {
        writeData(this.message, data);
      }
    });
}
function removeAllFormFields() {
  if (isRemote) {
    return;
  }

  !isRemote &&
    XDC.postMessage({
      message: "RemoveAllFormFields"
    });
}
function setFormat() {
  !isRemote &&
    XDC.postMessage({
      message: "SetFormat",
      data: {
        format: JSON.parse(document.querySelector("input[name=format]").value)
      },
      oncomplete: function(data) {
        writeData("SetFormat", data);
      },
      onexception: function(data) {
        writeData(this.message, data);
      }
    });
}
/*function insertNote(){
    var content = document.querySelector("input[name=note-text]").value, type = document.querySelector("input[name=notetype]:checked").value;
    if (isRemote) {
        var msg = {func: type==="Endnote"?"RemoteEditor.insertEndNote":"RemoteEditor.insertFootNote", params:[content, {startNumber: document.querySelector("input[name=note-start-number]").value, format: document.querySelector("input[name=note-format]").value}]};
        win.postMessage(msg, targetOrigin);
    } else {
        XDC.postMessage({
            message: "InsertNote",
            data: {startNumber: document.querySelector("input[name=note-start-number]").value, format: document.querySelector("input[name=note-format]").value, content: content, type: type},
            oncomplete: function(data){
                writeData("InsertNote", data);
            },
            onexception: function(data){
                writeData(this.message, data);
            }
        });
    }
    return false;
};
function findAndReplace(){
    if (isRemote) {
        var msg = {func: type==="HTML"?"RemoteEditor.findnreplaceHTML":"RemoteEditor.findnreplace", params: [document.querySelector("input[name=find]").value, document.querySelector("input[name=replace]").value, document.querySelector("input[name=replaceall]:checked").value==="on"]};
        win.postMessage(msg, targetOrigin);
    } else {
        var findArgs = {findText: document.querySelector("input[name=find]").value, replaceText: document.querySelector("input[name=replace]").value};
        //findArgs.replaceStyle = {'background-color': 'blue'};
        findArgs.findOptions = {replaceAll: document.querySelector("input[name=replaceall]:checked").value==="on"};
        findArgs.matchCase = document.querySelector("input[name=matchcase]:checked").value==="on";
        !isRemote && XDC.postMessage({
            message: "FindAndReplace",
            data: findArgs,
            oncomplete: function(data){
                writeData("FindAndReplace", data);
            },
            onexception: function(data){
                writeData(this.message, data);
            }
        });
    }
    return false;
};*/
function createDocument() {
  var targetDomain =
    document.querySelector("#target-domain").value ||
    //"https://writerz.localzoho.com" ||
    //"https://prewriter1.zoho.com" ||
    "https://writer.zoho.com";
  loadJS({
    src: "https://writer.zoho.com" + "/writer/js/common/xdc-1.0.min.js",
    callback: function() {
      // document.querySelector("input[name=saveurl]").value = /* document.querySelector("input[name=saveasurl]").value =  */targetDomain+"/save.jsp";
      targetOrigin = targetDomain + "/writer";
      !isRemote && XDC.setTrustedOrigins([targetDomain]); //  XDC.setTarget({window: win, origin: targetDomain});

      //Bind Messages
      XDC.receiveMessage("DocumentModified", function(data) {
        writeData("DocumentModified", data);
      });
      XDC.receiveMessage({
        DocumentLoadInProgress: function(data) {
          writeData("DocumentLoadInProgress", data);
        },
        DocumentLoadComplete: function(data) {
          writeData("DocumentLoadComplete", data);
        },
        SelectionChanged: function(data) {
          writeData("SelectionChanged", data);
        },
        PageChanged: function(data) {
          writeData("PageChanged", data);
        }
      });
      XDC.receiveMessage({
        FillableFieldInserted: function(data) {
          writeData("FillableFieldInserted", data);
        },
        FillableFieldUpdated: function(data) {
          writeData("FillableFieldUpdated", data);
        },
        FillableFieldDeleted: function(data) {
          writeData("FillableFieldDeleted", data);
        }
      });
      XDC.setTarget({
        origin: targetDomain,
        window: document.getElementById("writer-iframe").contentWindow
      });

      var docLoader = document.forms[0];
      docLoader.action = targetOrigin + "/officeapi/v1/document";
      //docLoader.submit();
    }
  });
}

createDocument();

/*function saveDocument(){
    var msg = {func: "RemoteEditor.remoteSave", params: [1]};
    win.postMessage(msg, targetOrigin);
};
function isDocumentModified(){
    var msg = {func: "RemoteEditor.isDocumentModified"};
    win.postMessage(msg, targetOrigin);
};
function listener(event){
    delete event.data.doc;
    writeData(event.data);
}
if (window.addEventListener) {
    addEventListener("message", listener, false);
} else {
    attachEvent("onmessage", listener);
}
//window.addEventListener("message", function(e) { console.log("P1"); }, false);
//After frame loaded 
var jQElem = document.querySelector("#writer-iframe");
jQElem.droppable({
    drop: function(event, ui) {
        //ACTION ON DROP HERE 
        var msg = {func: "RemoteEditor.insertContent", params:["Hello World!"]};
        jQElem[0].contentWindow.postMessage(msg, '*');
    }
});
         
//Activate draggable zones 
document.querySelector('h1').draggable({
    iframeFix: true,    //Core jquery ui params needs for fix iframe bug 
    iframeScroll: true  //This param needs for activate iframeScroll 
});
window.onload = window.onresize = function(){
    document.querySelector("#editor").add("#app-settings").add("#actions").height(window.innerHeight-20);
};
document.querySelector('input[name=mode]').off('change').on('change', function(ev){
    isRemote = ev.originalEvent.srcElement.value==="Remote";
});*/
