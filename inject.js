'use strict';

function insertLinkByPhotoHash(img) {
  var re_photo_hash = /\_([^\/]+)_[\w]{1,3}\.jpg/;
  var src = img.src;
  if (!src || src.substr(src.length - 4) == '.gif') {
    return;
  }
  var m = img.src.match(re_photo_hash);
  if (m) {
    var photo_hash = m[1];
    console.log(photo_hash);
    fetch('https://api.unitedtaxi.co/api/photo_hash/' + photo_hash).then(function(res) {
      return res.json();
    }).then(function(profile) {
      console.log(profile);
    });
  } else {
    console.warn('Invalid photo url: ' + src);
  }
}

function linkToDriver(root, type, id) {
  var span = document.createElement('span');
  span.className = 'ut-link';
  var a = document.createElement('A');
  a.textContent = type;
  var url = 'https://beta.unitedtaxi.co/admin.html?' + type.toLowerCase() + '=' + id;
  a.href = url;
  a.setAttribute('target', url);
  span.appendChild(a);
  root.firstElementChild.appendChild(span);
}

function linkToPassenger(root, profile) {

}

function insertLinkByFeature(img) {
  var re_photo_hash = /\_([^\/]+)_[\w]{1,3}\.jpg/;
  var src = img.src;
  if (!src || src.substr(src.length - 4) == '.gif') {
    return;
  }
  var root = img.parentElement;
  var ts_el = root.querySelector('abbr.timestamp');
  if (!ts_el) {
    return;
  }
  var ts = parseFloat(ts_el.getAttribute('data-utime')) * 1000;
  var el = root.lastElementChild.firstElementChild;
  var name = el.firstElementChild.textContent;
  var msg = el.firstElementChild.nextElementSibling.textContent;
  var q = 'ts=' + ts + '&name=' + name + '&msg=' + msg;
  console.log(q);
  fetch('https://api.unitedtaxi.co/api/user_info/?' + q).then(function(res) {
    return res.json();
  }).then(function(profile) {
    console.log(profile);
    if (profile.driver) {
      linkToDriver(el, 'Driver', profile.driver.id);
    }
    if (profile.passenger) {
      linkToPassenger(el, 'User', profile.passenger.id);
    }
  });
}

function injectLinks() {
  var imgs = document.querySelectorAll('.uiList  img.img');
  for (var i = 0; i < imgs.length; i++) {
    insertLinkByFeature(imgs[i]);
  }
}

function loadScriptInject() {
  console.info('loading my-unicode-ime-zawgyi-out ...');
  if (!/\/messages\//.test(location.pathname)) {
    console.info('Not a message panel');
    return;
  }

  console.log('injecting');
  setTimeout(injectLinks, 5000); // photo are load very late

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

