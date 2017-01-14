/**
 * @fileOverview convert unicode to zawgyi encoding upopn http request
 */


chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      // convert from unicode to zawgyi
      console.log("intercepted: " + details.url);
      console.log(details);
      var postedString = String.fromCharCode.apply(null,
          new Uint8Array(details.requestBody.raw[0].bytes));
      console.log(postedString);
      var parts = postedString.split('&');
      var data = new FormData();
      for (var i = 0; i < parts.length; i++) {
        var sp = parts[i].indexOf('=');
        var name = parts[i].substr(0, sp);
        var value = parts[i].substr(sp + 1);
        if (name == 'body') {
          value = decodeURIComponent(value);
          value = Uni_Z1(value);
          value = encodeURIComponent(value);
        }
        data.append(name, value);
      }
      var xhr = new XMLHttpRequest();
      xhr.open('POST', details.url, false);
      xhr.withCredentials = true;
      xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
      xhr.send(data);
      return {cancel: true};
    },
    {
      urls: [
        "https://www.facebook.com/messaging/send/*"
      ]
    },
    // extraInfoSpec
    ["blocking", "requestBody"]);