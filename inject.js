function loadScriptInject() {
  console.info('loading my-unicode-ime-zawgyi-out ...');
  if (!/\/messages\//.test(location.pathname)) {
    console.info('Not a message panel');
    return;
  }

  console.log('injecting');

  var send_file = document.querySelector('div[data-tooltip-content="Send a file"]');
  if (!send_file) {
    console.warn('Send a file button not found.');
    return;
  }
  var btn = send_file.parentElement.querySelector('button');
  if (btn.textContent != 'Send') {
    console.warn('Send button expected.');
    return;
  }
  var text_el = send_file.parentElement.parentElement.querySelector('textarea');
  if (!text_el) {
    console.warn('TextArea element not found.');
    return;
  }
  function convert() {
    var unicode = text_el.value;
    var zawgyi = Uni_Z1(unicode);
    console.log('convert', unicode, zawgyi);
    text_el.value = zawgyi;
  }
  btn.addEventListener('mousedown', convert, true);
  // text_el.onblur = convert;
  console.info('loaded');
}


setTimeout(loadScriptInject, 3000); // wait because Send button load very late

