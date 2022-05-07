import firebase from 'firebase/app';
import 'firebase/database'
import "firebase/auth"
import "firebase/firestore";
// var firebaseConfig = {
//   apiKey: "AIzaSyAGyE8BwLDjTQjawe1yPFXuFVOGO3judmc",
//   authDomain: "ttcs-msteams.firebaseapp.com",
//   databaseURL: "https://ttcs-msteams-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "ttcs-msteams",
//   storageBucket: "ttcs-msteams.appspot.com",
//   messagingSenderId: "878552796597",
//   appId: "1:878552796597:web:e936fd4b1684b5adb71dfc",
//   measurementId: "G-19PEG5ZHB2"
// };
const firebaseConfig = {
  apiKey: "AIzaSyCqFbDsEBA4EnGora8o2PRNfToshr8EuUQ",
  authDomain: "server-image-b9408.firebaseapp.com",
  databaseURL: "https://server-image-b9408-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "server-image-b9408",
  storageBucket: "server-image-b9408.appspot.com",
  messagingSenderId: "1069754456737",
  appId: "1:1069754456737:web:9a31b9260131a11165aee0",
  measurementId: "G-MXTDKJ2RB0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase;
export const auth = firebase.auth();
export const storage = firebase.firestore();
var firepadRef = firebase.database().ref();

export default firepadRef;
