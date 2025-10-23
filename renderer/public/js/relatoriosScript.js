"use strict";

const avalButton = document.getElementById("avaliacoes");

avalButton.onclick = async () => {
    const preElem = document.getElementById("teste");

    const result = await fetch("http://localhost:4040/relatorios/avaliacaoclientes");
    const data = JSON.parse(result);
    
    preElem.innerHTML = data;
}