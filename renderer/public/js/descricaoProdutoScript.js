let cards = [];

document.getElementById("erro").style.display = "none";
const campo = document.getElementById("campoFiltro");
const op = document.getElementById("operadorFiltro");
const valor = document.getElementById("valorFiltro");

valor.addEventListener("input", filtrar);
op.onchange = filtrar;
campo.onchange = (e)=>{
    if(e.target.value !== "idAvaliacao" && e.target.value !== "nota")
        op.style.display = "none";
    else
        op.style.display = "";
}

function filtrar()
{
    // ler a expressão de filtragem
    const selectedCampo = campo.options[campo.selectedIndex].value;
    const selectedOp = op.options[op.selectedIndex].value;

    // não filtra se o valor estiver vazio
    if(valor.value === "")
    {
        restoreDisplay();
        return;
    }
    if(selectedCampo === "idAvaliacao" || selectedCampo === "nota")
    {
        // iterar sobre os cards
        for(const card of cards)
        {
            let selCam = card.getAttribute(selectedCampo);
            let val = valor.value.toString();
            const result = eval(`${selCam} ${selectedOp} "${val}"`);
            if(!result)
                // esconder os que não se encaixarem
                card.style.display = "none";
            else
                // mostrar os que estiverem escondidos e se encaixarem na expressão
                card.style.display = "";
        }
    }
    else
    {
        for(const card of cards)
        {
            const result = card.getAttribute(selectedCampo).includes(valor.value.toUpperCase());
            if(!result)
                // esconder os que não se encaixarem
                card.style.display = "none";
            else
                // mostrar os que estiverem escondidos e se encaixarem na expressão
                card.style.display = "";
        }
    }
}

function restoreDisplay()
{
    for(const card of cards)
    {
        card.style.display = "";
    }
}


function classificarNota(nota) {
    if (nota >= 8) return "nota-alta";
    if (nota >= 5) return "nota-media";
    return "nota-baixa";
}

function getIniciais(nome) {
    if (!nome) return "?";
    const partes = nome.split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

async function carregarAvaliacoes() {
    const loadingEl = document.getElementById("avaliacoes");
    loadingEl.innerHTML = '<p style="color:#666;">Carregando avaliações...</p>';

    try {
        const response = await fetch("http://localhost:4040/relatorios/avaliacaoclientes/produtos?contexto=descricoes");
        const data = await response.json();
        
        loadingEl.innerHTML = '';

        if (!data || !data.idAvaliacao) {
            document.getElementById("erro").textContent = "Nenhuma avaliação encontrada.";
            return;
        }

        const container = document.getElementById("avaliacoes");

        data.idAvaliacao.forEach((id, index) => {
            const idAvaliacao = id;
            const nota = data.nota[index];
            const nomeProduto = data.nomeProduto[index] || "Produto sem nome";
            const descricao = data.descricao[index] || "Sem descrição.";
            const nomeCliente = data.nomeCliente[index] || "Anônimo";
            
            const rawDate = data.data[index];
            const dataFormatada = rawDate ? new Date(rawDate).toLocaleDateString('pt-BR') : '--/--/----';

            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("idAvaliacao", idAvaliacao);
            card.setAttribute("nota", nota);
            card.setAttribute("nomeProduto", nomeProduto);
            card.setAttribute("descricao", descricao);
            card.setAttribute("nomeCliente", nomeCliente);
            card.innerHTML = `
                <div class="id-badge" id="idAvaliacao">#${idAvaliacao}</div>
                
                <div class="card-header">
                    <div class="nomeProduto">${nomeProduto}</div>
                    <div class="nota ${classificarNota(nota)}">
                        ${nota.toFixed(1)} ★
                    </div>
                </div>

                <div class="descricao">
                    "${descricao}"
                </div>

                <div class="card-footer">
                    <div class="cliente-info">
                        <div class="avatar-circle">${getIniciais(nomeCliente)}</div>
                        <div class="nomeCliente">${nomeCliente}</div>
                    </div>
                    <div class="data">${dataFormatada}</div>
                </div>
            `;

            container.appendChild(card);
            cards.push(card);
        });

    } catch (error) {
        document.getElementById("avaliacoes").innerHTML = '';
        document.getElementById("erro").style.display = "";
        document.getElementById("erro").textContent = `Erro de conexão ao carregar avaliações: ${error}`;
    }
}

carregarAvaliacoes();