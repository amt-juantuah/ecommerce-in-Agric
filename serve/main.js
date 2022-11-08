import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";

import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

import { getFirestore, doc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAZRGe5NiePPLcPhOVNJnJBVPlv4J2p4uI",
    authDomain: "samshea-4c2c3.firebaseapp.com",
    projectId: "samshea-4c2c3",
    storageBucket: "samshea-4c2c3.appspot.com",
    messagingSenderId: "433398510115",
    appId: "1:433398510115:web:21db4ea73ac33928683796"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Frebase Auth
const auth = getAuth(app);

const db = getFirestore();


// function to send order
export const sendOrder = async function(customerName, customerNumber, customerEmail, customerCountry, customerAddress, delivery, product, quantity, price, totalAmount, specifications="") {
    try {
        await addDoc(collection(db, 'orders'), {
            customerName: customerName, 
            customerNumber: customerNumber, 
            customerEmail: customerEmail, 
            customerCountry: customerCountry, 
            customerAddress: customerAddress, 
            delivery: delivery, 
            product: product, 
            quantity: quantity, 
            price: price, 
            totalAmount: totalAmount, 
            specifications: specifications
        });
    } catch (error) {
        console.log(error)
        return false;
    }
    return true
    
}



// function to handle authentication
const handleAuth = (function() {

    // auth DOM strings
    const authDom = {
        // signup DOM strings
        signupForm: 'signup-box',
        fullName: 'fullName',
        phone: 'phone',
        email: 'email',
        password: 'password',
        passwordConfirm: 'passwordConfirm',
        signupError: 'signupError',

        // login DOM strings
        loginForm: 'login-box',
        loginEmail: "loginEmail",
        loginPassword: "loginPassword",
        loginError: 'loginError'
    }

    return {
        // get signup form input values
        getSignupInputs: function() {
            return {
                fullName: document.getElementById(authDom.fullName).value,
                phone: document.getElementById(authDom.email).value,
                email: document.getElementById(authDom.email).value,
                password: document.getElementById(authDom.password).value,
                confirmPassword: document.getElementById(authDom.passwordConfirm).value
            }
        },

        // get login form input values
        getLoginInputs: function() {
            return {
                loginEmail: document.getElementById(authDom.loginEmail).value,
                loginPassword: document.getElementById(authDom.loginPassword).value
            }
        },

        // clear form after submit
        clearField: function(form) {
            form.reset();
        },

        // function to return authDom to outside access
        getAuthDom: function() {
            return authDom;
        }
    }
})()


// function to control interface clicking name redirection 
const uiControl = (function() {
    const buyButtons = document.querySelectorAll('.logo');

    return {
        buys: function() {
            if (buyButtons) {
                buyButtons.forEach(each => each.addEventListener('click', (e) => {
                    if (localStorage.getItem("iox")) {
                        localStorage.setItem("product", each.parentNode.id);

                        window.location.href = "buy.html";
                    } else {
                        window.location.href = "login.html";
                    }
                }))
            }
        }
    }
})()


// controller for all parts of the app

const appController = (function(au, ui) {

    // get auth DOM strings to access login and signup forms
    const authStrings = au.getAuthDom()

    // get signup form
    const signMeUp = document.getElementById(authStrings.signupForm);

    // get login form
    const logMeIn = document.getElementById(authStrings.loginForm);


    // controller function that controls auth
    const allAuth = function() {
        // if on signup page
        if (signMeUp) {
            signMeUp.addEventListener('submit', (e) => {
                e.preventDefault();

                const signupAnswers = au.getSignupInputs();

                const actualAnswersSignup = Object.values(signupAnswers).filter(element => {
                    return (element.trim() != '' && element !== null && typeof element !== 'object')
                })

                if (actualAnswersSignup.length === 5) {
                    // no error
                    document.getElementById(authStrings.signupError).style.display = "none";

                    // clear form
                    au.clearField(e.target);

                    
                    // add user to firebase auth
                    createUserWithEmailAndPassword(auth, signupAnswers.email, signupAnswers.password)
                        .then((userCredentials) => {
                            // success
                            const user = userCredentials.user;

                            // set user information to localstorage
                            localStorage.setItem("iox", user.uid);
                            localStorage.setItem("ioxmail", user.email);

                            localStorage.setItem("ioxname", user.email.split("@")[0]);

                            window.location.reload();
                        })
                        .catch((error) => {
                            document.getElementById(authStrings.signupError).style.display = "block";
                            console.log(error.message);
                            console.log(error.code);
                        })
                }
            })
        }

        // if on a login screen
        if (logMeIn) {
            logMeIn.addEventListener('submit', (e) => {
                e.preventDefault();

                // get login answers
                const loginAnswers = au.getLoginInputs();
                au.clearField(e.target);

                // check with firebase login auth
                signInWithEmailAndPassword(auth, loginAnswers.loginEmail, loginAnswers.loginPassword)
                    .then((userCredentials) => {
                        // success
                        console.log(userCredentials)
                        document.getElementById(authStrings.loginError).style.display = 'none';

                        const user = userCredentials.user;
                        console.log(user);
                        // set user information to localstorage
                        localStorage.setItem("iox", user.uid);
                        localStorage.setItem("ioxmail", user.email);
                        localStorage.setItem("ioxname", user.email.split("@")[0]);
                        window.location.href = "index.html";
                    })
                    .catch((error) => {
                        document.getElementById(authStrings
                            .loginError).style.display = "block";
                            console.log(error.message)
                    })
            })
        }
    }

    return {
        init: function() {
            allAuth();
            ui.buys();
        }
    }

})(handleAuth, uiControl)

appController.init();