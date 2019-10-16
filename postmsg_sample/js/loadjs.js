function loadJS(attr){
    if (!attr) { return; }

    var scriptElem  = document.createElement('script');//No I18N
    scriptElem.type = 'text/javascript';//No I18N
    if (attr.async) {
        scriptElem.async = attr.async;
    }
    if (attr.defer) {
        scriptElem.defer = attr.defer;
    }
    if (attr.id) {
        scriptElem.id = attr.id;
    }
    if (attr.src) {
        scriptElem.src = attr.src;
    }
    scriptElem.onreadystatechange = function(){// For IE
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            scriptElem.onreadystatechange = null;
            if (typeof attr.callback == 'function') { attr.callback(); attr.callback = null; }
        }
    };
    scriptElem.onload = function(){// For others
        if (typeof attr.callback == 'function') { attr.callback(); attr.callback = null; }
    };
    document.body.appendChild(scriptElem);
};
