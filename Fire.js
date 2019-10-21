import firebase from "firebase";

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }
  init = () =>
  firebase.initializeApp({
    apiKey: "AIzaSyBPVUyqgqKK1zBPbYbIdT-mOFwlA8o4ZYg",
    authDomain: "chat-44268.firebaseapp.com",
    databaseURL: "https://chat-44268.firebaseio.com",
    projectId: "chat-44268",
    storageBucket: "chat-44268.appspot.com",
    messagingSenderId: "233943840394",
    appId: "1:233943840394:web:a5a183c86c1bca03139f73",
    measurementId: "G-4N1H6GV13C"
  });
  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  onAuthStateChanged = user => {
    if (!user) {
      try {
        // 4.
        firebase.auth().signInAnonymously();
      } catch ({ message }) {
        alert(message);
      }
    }
  };
  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }

  get ref() {
    return firebase.database().ref("messages");
  }
  parse = snapshot => {
    const { timestamp: numberStamp, text, user } = snapshot.val();
    const { key: _id } = snapshot;

    const timestamp = new Date(numberStamp);

    const message = {
      _id,
      timestamp,
      text,
      user
    };
    return message;
  };

  on = callback =>
    this.ref
      .limitToLast(20)
      .on("child_added", snapshot => callback(this.parse(snapshot)));

  // 2.
  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
  // 3.
  send = messages => {
    for (let i = 0; i < messages.length; i++) {
      const { text, user } = messages[i];
      // 4.
      const message = {
        text,
        user,
        timestamp: this.timestamp
      };
      this.append(message);
    }
  };
  // 5.
  append = message => this.ref.push(message);

  off() {
    this.ref.off();
  }



}

Fire.shared = new Fire();
export default Fire;
