import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    /* Helper */

    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.firestore();

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  /* Firebase APIs */

  getTimestamp = () => app.firestore.Timestamp.now();

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () => this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT
    });

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        if (authUser.emailVerified && authUser.uid) {
          this.user(authUser.uid)
            .get()
            .then(snapshot => {
              const dbUser = snapshot.data();

              // default empty roles
              if (!dbUser.roles) {
                dbUser.roles = {};
              }

              // merge auth and db user
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                ...dbUser
              };

              next(authUser);
            })
            .catch(error => {
              console.log(error);
              next(authUser);
            });
        } else {
          next(authUser);
        }
      } else {
        fallback();
      }
    });

  // *** User API ***
  user = uId => this.db.doc(`users/${uId}`);
  users = () => this.db.collection("users");

  // *** Dashboards API ***
  dashboard = uId => this.db.doc(`dashboards/${uId}`);
  dashboards = () => this.db.collection("dashboards");
  userDashboards = uId =>
    this.db.collection("dashboards").where("userId", "==", uId);

  // *** Tabs API ***
  tab = tId => this.db.doc(`tabs/${tId}`);
  tabs = () => this.db.collection("tabs");
  dashboardTabs = dId =>
    this.db.collection("tabs").where("dashboardId", "==", dId);

  // *** Feeds API ***
  feed = fId => this.db.doc(`feeds/${fId}`);
  feeds = () => this.db.collection("feeds");
  tabFeeds = tabId =>
    this.db.collection("feeds").where("tabs", "array-contains", tabId);
  findFeed = url => this.db.collection("feeds").where("url", "==", url);
}

export default Firebase;
