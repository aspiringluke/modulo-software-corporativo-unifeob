let listaProdutos;
let listaVendedores;

async function get()
{
    listaProdutos = await fetch("http://localhost:4040/produtos");
    listaVendedores = await fetch("http://localhost:4040/vendedores");
    listaProdutos = await listaProdutos.json();
    listaVendedores = await listaVendedores.json();

    return { listaProdutos, listaVendedores };
}

const produto = document.getElementById("escolherProduto");
const vendedor = document.getElementById("escolherVendedor");
const selectProduto = document.getElementById("produto");
const selectVendedor = document.getElementById("vendedor");

get().then(data => {
    let i=1;
    for(const p of data.listaProdutos)
    {
        let option = document.createElement('option');
        option.textContent = p.descricao;
        option.value = i;
        i++;
        selectProduto.appendChild(option);
    }

    i=0;
    for(const v of data.listaVendedores)
    {
        let option = document.createElement('option');
        option.textContent = v.nome;
        option.value = i;
        i++;
        selectVendedor.appendChild(option);
    }
});

const tag = document.getElementById("tag");

produto.style.display = "none";
vendedor.style.display = "none";

tag.onchange = () => {
    const idx = tag.selectedIndex;
    if(idx === 1)
    {
        vendedor.style.display = "";
        produto.style.display = "none";
    }
    else if(idx === 2)
    {
        vendedor.style.display = "none";
        produto.style.display = "";
    }
    else
    {
        vendedor.style.display = "none";
        produto.style.display = "none";
    }
}