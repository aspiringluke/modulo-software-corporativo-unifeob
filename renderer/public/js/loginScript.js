"use strict";

document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    
    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("senha").value;
    
    fetch("http://localhost:4040/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario, senha }),
    });
});