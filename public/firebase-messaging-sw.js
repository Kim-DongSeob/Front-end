importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js',
);

firebase.initializeApp({
  messagingSenderId: '128639882477',
});

messaging.setBackgroundMessageHandler(function (payload) {
  const title = 'boilerPlate';
  const options = {
    body: payload.data.status,
  };
  return self.registration.showNotification(title, options);
});
