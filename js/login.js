
let signupBtn = document.getElementById("signupBtn");
let signinBtn = document.getElementById("signinBtn");
let title = document.getElementById("title");

signinBtn.onclick = function() {
    title.innerHTML = "Sign In";
}

signupBtn.onclick = function() {
    title.innerHTML = "Sign Up";
}

let  userArray = JSON.parse(localStorage.getItem('userArray'));
    if(userArray === null){
        userArray = [];
        localStorage.setItem("userArray",JSON.stringify(userArray));
    }

document.getElementById("signupForm").addEventListener('submit', function(event){
    event.preventDefault();
    
    const name = document.getElementById("nameInput").value.trim();
    document.getElementById("nameError").textContent = "";
    const email = document.getElementById("emailInput").value.trim();
    document.getElementById("emailError").textContent = "";
    const password = document.getElementById("passwordInput").value.trim();
    document.getElementById("passwordError").textContent = "";
    if (name === "") {
        document.getElementById("nameError").textContent = "Please enter your name.";
        return;
    }
    if (email === "") {
        document.getElementById("emailError").textContent = "Please enter your email.";
        return;
    }
    if (password === "") {
        document.getElementById("passwordError").textContent = "Please enter your password.";
        return;
    }
    if (password.length < 6) {
        document.getElementById("passwordError").textContent = "Password must have 6 chars.";
        return;
    }
    let user = {user:name,
        email:email,
        password:password
    };
    userArray.push(user);
    localStorage.setItem("userArray",JSON.stringify(userArray));
    window.alert("Sign Up successful");
    window.location.href = 'index.html';
});
