document.addEventListener("DOMContentLoaded", function () {
    const tituloEl = document.querySelector(".container-interno-livro h2");
    if (!tituloEl) return;

    const tituloObra = tituloEl.textContent.trim();
    const gavetaKindle = document.getElementById("gavetaLeitorKindle");
    const textoKindle = document.getElementById("textoPaginaKindle");
    const btnFav = document.getElementById("btnFavoritarDireto");
    let tamanhoFonte = 16;

    let favs = JSON.parse(localStorage.getItem("favoritosBiblioteca")) || [];
    if (btnFav && favs.includes(tituloObra)) btnFav.textContent = "❤️ Salvo nos Favoritos";

    document.addEventListener("click", function (e) {
        if (e.target.id === "btnAbrirDegustacaoDireta" && gavetaKindle) {
            gavetaKindle.style.display = gavetaKindle.style.display === "none" ? "block" : "none";
        }
        if (e.target.id === "btnFecharGavetaKindle" && gavetaKindle) gavetaKindle.style.display = "none";
        if (e.target.id === "btnKindleTemaPapel" && gavetaKindle) {
            gavetaKindle.style.background = "#f4ecd8";
            gavetaKindle.style.color = "#2c221e";
        }
        if (e.target.id === "btnKindleTemaEscuro" && gavetaKindle) {
            gavetaKindle.style.background = "#0d1117";
            gavetaKindle.style.color = "#e6edf3";
        }
        if (e.target.id === "btnKindleAumentarFonte" && textoKindle) {
            tamanhoFonte = tamanhoFonte >= 22 ? 16 : tamanhoFonte + 2;
            textoKindle.style.setProperty("font-size", tamanhoFonte + "px", "important");
        }
        if (e.target.id === "btnFavoritarDireto" && btnFav) {
            favs = JSON.parse(localStorage.getItem("favoritosBiblioteca")) || [];
            if (favs.includes(tituloObra)) {
                favs = favs.filter(f => f !== tituloObra);
                btnFav.textContent = "🤍 Favoritar Obra";
            } else {
                favs.push(tituloObra);
                btnFav.textContent = "❤️ Salvo nos Favoritos";
            }
            localStorage.setItem("favoritosBiblioteca", JSON.stringify(favs));
        }
        if (e.target.id === "btnCompartilharDireto") {
            navigator.clipboard.writeText(window.location.href).then(() => alert(`🔗 Link de "${tituloObra}" copiado!`)).catch(() => alert("🔗 Link: " + window.location.href));
        }
    });

    let estoqueGlobal = JSON.parse(localStorage.getItem("estoqueBiblioteca")) || {};
    if (estoqueGlobal[tituloObra] === undefined) {
        estoqueGlobal[tituloObra] = 4;
        localStorage.setItem("estoqueBiblioteca", JSON.stringify(estoqueGlobal));
    }

    function atualizarEstoque() {
        const qtd = estoqueGlobal[tituloObra];
        const statusEl = document.getElementById("statusEstoqueLivro");
        if (statusEl) {
            statusEl.innerHTML = qtd > 0
                ? `📦 Estoque Físico Local: <strong style="color:#00ff88;">${qtd} exemplar(es) disponível(is)</strong>`
                : `📦 Estoque Físico Local: <strong style="color:#ff6b6b;">Esgotado no momento</strong>`;
        }
    }
    atualizarEstoque();

    const userLogado = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
    const inputNome = document.getElementById("alunoNomeLivro");
    const inputTurma = document.getElementById("alunoTurmaLivro");
    if (userLogado && !userLogado.ehVisitante) {
        if (inputNome) inputNome.value = userLogado.nome;
        if (inputTurma && userLogado.turma) inputTurma.value = userLogado.turma;
    }

    const formRetirada = document.getElementById("formRetiradaLivro");
    if (formRetirada) {
        formRetirada.addEventListener("submit", function (e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
            if (!user || user.ehVisitante) {
                alert("🔒 Entre na sua Conta Oficial para retirar livros!");
                if (window.abrirPainelConta) window.abrirPainelConta();
                return;
            }
            if (estoqueGlobal[tituloObra] <= 0) {
                alert("⚠️ Exemplares esgotados no momento!");
                return;
            }
            const prazo = new Date(Date.now() + 14 * 86400000).toLocaleDateString("pt-BR");
            estoqueGlobal[tituloObra] -= 1;
            localStorage.setItem("estoqueBiblioteca", JSON.stringify(estoqueGlobal));

            if (!user.emprestimos) user.emprestimos = [];
            user.emprestimos.push({ livro: tituloObra, dataRetirada: new Date().toLocaleDateString("pt-BR"), dataDevolucao: prazo });
            localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(user));

            const banco = JSON.parse(localStorage.getItem("bancoUsuariosRegistrados")) || [];
            const idx = banco.findIndex(u => u.username === user.username);
            if (idx !== -1) { banco[idx] = user; localStorage.setItem("bancoUsuariosRegistrados", JSON.stringify(banco)); }

            atualizarEstoque();
            alert(`🎉 EMPRÉSTIMO CONFIRMADO!\n\n📖 ${tituloObra}\n👤 ${user.nome}\n📅 Devolver até: ${prazo}`);
        });
    }

    const formComentario = document.getElementById("formNovoComentario");
    if (formComentario) {
        formComentario.addEventListener("submit", function (e) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
            const nomeAutor = (user && !user.ehVisitante) ? `${user.nome} (@${user.username})` : "Leitor Visitante";
            const texto = document.getElementById("textoNovoComentario").value.trim();
            const notaSel = document.getElementById("notaComentarioLivro");
            if (!texto) return;

            const novoDiv = document.createElement("div");
            novoDiv.className = "comentario-item";
            novoDiv.style.cssText = "margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08);";
            novoDiv.innerHTML = `<div style="display:flex; justify-content:space-between; margin-bottom:6px;"><strong style="color:#00ff88; font-size:14px;">👤 ${nomeAutor}</strong><span style="color:#ffd700; font-size:13px; font-weight:bold;">${notaSel.options[notaSel.selectedIndex].text}</span></div><p style="color:#d0d7de; font-size:14px;">${texto}</p>`;
            document.getElementById("listaComentarios").appendChild(novoDiv);
            document.getElementById("textoNovoComentario").value = "";
        });
    }
});
