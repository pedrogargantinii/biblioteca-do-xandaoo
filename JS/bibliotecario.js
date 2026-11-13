window.mostrarAvisoModerno = function (mensagem, tipo = "sucesso") {
    let containerToasts = document.getElementById("containerToastsBiblioteca");
    if (!containerToasts) {
        containerToasts = document.createElement("div");
        containerToasts.id = "containerToastsBiblioteca";
        containerToasts.style.cssText = `
            position: fixed; bottom: 24px; right: 24px; z-index: 2147483647;
            display: flex; flex-direction: column; gap: 10px; max-width: 360px;
            pointer-events: none;
        `;
        document.body.appendChild(containerToasts);
    }

    const cores = {
        sucesso: { borda: "#00ff88", icone: "✅", titulo: "Concluído" },
        aviso: { borda: "#ffd700", icone: "⚠️", titulo: "Atenção" },
        erro: { borda: "#ff4d4d", icone: "🔒", titulo: "Acesso / Erro" },
        info: { borda: "#2f81f7", icone: "ℹ️", titulo: "Informação" }
    };
    const cfg = cores[tipo] || cores.info;

    const toast = document.createElement("div");
    toast.style.cssText = `
        background: rgba(13, 17, 23, 0.96); color: #f0f6fc;
        border: 1px solid #30363d; border-left: 4px solid ${cfg.borda};
        border-radius: 12px; padding: 14px 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.75);
        font-family: 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.45;
        backdrop-filter: blur(10px); pointer-events: auto;
        transform: translateX(120%); transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    `;
    toast.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
            <strong style="color:${cfg.borda}; font-size:13px;">${cfg.icone} ${cfg.titulo}</strong>
            <span style="cursor:pointer; color:#8b949e; font-size:14px;" onclick="this.parentElement.parentElement.remove()">✖</span>
        </div>
        <div style="color:#e6edf3; white-space:pre-line;">${mensagem}</div>
    `;

    containerToasts.appendChild(toast);
    requestAnimationFrame(() => { toast.style.transform = "translateX(0)"; });

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(120%)";
        setTimeout(() => toast.remove(), 350);
    }, 4800);
};

window.alert = function (msg) {
    const texto = String(msg);
    if (texto.includes("🔒") || texto.includes("❌") || texto.includes("incorretos")) {
        window.mostrarAvisoModerno(texto.replace(/^[🔒❌⚠️🎉🔗✅]+\s*/, ""), "erro");
    } else if (texto.includes("⚠️") || texto.includes("esgotados")) {
        window.mostrarAvisoModerno(texto.replace(/^[🔒❌⚠️🎉🔗✅]+\s*/, ""), "aviso");
    } else {
        window.mostrarAvisoModerno(texto.replace(/^[🔒❌⚠️🎉🔗✅]+\s*/, ""), "sucesso");
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const SENHA_BIBLIOTECARIO = "seed2026";
    const estaNaSubpasta = window.location.pathname.includes("/livros/");
    const prefixoOrigem = estaNaSubpasta ? "../" : "";

    function parseDataBR(str) {
        if (!str) return new Date();
        const partes = str.split("/");
        if (partes.length !== 3) return new Date();
        return new Date(parseInt(partes[2]), parseInt(partes[1]) - 1, parseInt(partes[0]));
    }

    function calcularSituacaoPrazo(dataDevolucaoStr) {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const dataDev = parseDataBR(dataDevolucaoStr);
        dataDev.setHours(0, 0, 0, 0);

        const diffMs = dataDev - hoje;
        const diasRestantes = Math.ceil(diffMs / 86400000);

        if (diasRestantes < 0) {
            const diasAtraso = Math.abs(diasRestantes);
            const multa = (diasAtraso * 0.50).toFixed(2).replace(".", ",");
            return {
                status: "atrasado",
                dias: diasAtraso,
                multa: multa,
                badge: `<span style="background:rgba(255,77,77,0.18); border:1px solid #ff4d4d; color:#ff6b6b; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:bold;">🔴 Atrasado (${diasAtraso}d) • Multa: R$ ${multa}</span>`
            };
        } else if (diasRestantes <= 3) {
            return {
                status: "vencendo",
                dias: diasRestantes,
                multa: "0,00",
                badge: `<span style="background:rgba(255,215,0,0.18); border:1px solid #ffd700; color:#ffd700; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:bold;">🟡 Vence em ${diasRestantes} dia(s)</span>`
            };
        } else {
            return {
                status: "noprazo",
                dias: diasRestantes,
                multa: "0,00",
                badge: `<span style="background:rgba(0,255,136,0.15); border:1px solid #00ff88; color:#00ff88; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:bold;">🟢 No Prazo (${diasRestantes}d restantes)</span>`
            };
        }
    }

    function renderizarLivrosExtrasCatalogo() {
        if (estaNaSubpasta) return;
        const extras = JSON.parse(localStorage.getItem("livrosExtrasBiblioteca")) || [];
        if (extras.length === 0) return;

        const primeiraGrade = document.querySelector(".grade-livros");
        if (!primeiraGrade) return;

        extras.forEach(livro => {
            if (document.getElementById("extra-" + livro.id)) return;
            const card = document.createElement("div");
            card.className = "bloco-livro";
            card.id = "extra-" + livro.id;
            card.innerHTML = `
                <div style="text-decoration:none; color:inherit; cursor:pointer;">
                    <img src="${livro.capa}" alt="${livro.titulo}">
                    <h4>${livro.titulo}</h4>
                    <p>Disponíveis: ${livro.estoque} unidade(s)</p>
                    <button class="botao-detalhes" type="button">Saber mais informações</button>
                </div>
            `;
            card.addEventListener("click", () => {
                window.mostrarAvisoModerno(`📖 ${livro.titulo}\n✍️ Autor: ${livro.autor}\n🏷️ Gênero: ${livro.genero}\n📦 Estoque: ${livro.estoque} exemplar(es)`, "info");
            });
            primeiraGrade.prepend(card);
        });
    }
    renderizarLivrosExtrasCatalogo();
    const modalAdmin = document.createElement("div");
    modalAdmin.id = "modalPainelBibliotecario";
    modalAdmin.style.cssText = `
        display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.88);
        backdrop-filter: blur(8px); z-index: 2147483646; justify-content: center;
        align-items: center; padding: 16px;
    `;

    const boxAdmin = document.createElement("div");
    boxAdmin.style.cssText = `
        background: #0d1117; border: 2px solid #2f81f7; border-radius: 18px;
        width: 100%; max-width: 920px; max-height: 90vh; overflow-y: auto;
        padding: 26px; color: #f0f6fc; font-family: 'Segoe UI', sans-serif;
        box-shadow: 0 20px 60px rgba(0,0,0,0.95);
    `;
    modalAdmin.appendChild(boxAdmin);
    document.body.appendChild(modalAdmin);

    modalAdmin.addEventListener("click", (e) => {
        if (e.target === modalAdmin) modalAdmin.style.display = "none";
    });

    window.abrirPainelBibliotecario = function () {
        const autenticado = sessionStorage.getItem("bibliotecarioLogado") === "true";

        if (!autenticado) {
            boxAdmin.style.maxWidth = "420px";
            boxAdmin.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #30363d; padding-bottom:12px; margin-bottom:18px;">
                    <h3 style="color:#58a6ff; margin:0; font-size:18px;">🔒 Acesso Restrito • Bibliotecário</h3>
                    <button type="button" id="fecharAdminModal" style="background:none; border:none; color:#8b949e; font-size:20px; cursor:pointer;">✖</button>
                </div>
                <p style="color:#8b949e; font-size:13px; margin-bottom:14px;">Área exclusiva da equipe escolar para gestão de prazos, multas (R$ 0,50/dia), alunos e novos livros.</p>
                <label style="font-size:12px; color:#c9d1d9; display:block; margin-bottom:6px;">Chave de Acesso Institucional:</label>
                <input type="password" id="inputSenhaBibliotecario" placeholder="Digite a senha (ex: seed2026)" style="width:100%; padding:11px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff; margin-bottom:16px;">
                <button type="button" id="btnEntrarBibliotecario" style="width:100%; padding:12px; border-radius:8px; border:none; background:#238636; color:#fff; font-weight:bold; cursor:pointer;">🔓 Desbloquear Painel</button>
            `;
            document.getElementById("fecharAdminModal").onclick = () => modalAdmin.style.display = "none";
            document.getElementById("btnEntrarBibliotecario").onclick = () => {
                const digitada = document.getElementById("inputSenhaBibliotecario").value.trim();
                if (digitada === SENHA_BIBLIOTECARIO) {
                    sessionStorage.setItem("bibliotecarioLogado", "true");
                    window.mostrarAvisoModerno("Acesso administrativo liberado com sucesso!", "sucesso");
                    renderizarDashboardAdmin("emprestimos");
                } else {
                    window.mostrarAvisoModerno("Chave de acesso incorreta! Tente novamente.", "erro");
                }
            };
        } else {
            renderizarDashboardAdmin("emprestimos");
        }
        modalAdmin.style.display = "flex";
    };

    function renderizarDashboardAdmin(abaAtiva = "emprestimos", filtroPrazo = "todos") {
        boxAdmin.style.maxWidth = "920px";
        const banco = JSON.parse(localStorage.getItem("bancoUsuariosRegistrados")) || [];
        const userAtual = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
        if (userAtual && !userAtual.ehVisitante && !banco.some(u => u.username === userAtual.username)) {
            banco.push(userAtual);
        }

        let todosEmprestimos = [];
        banco.forEach((aluno, uIdx) => {
            (aluno.emprestimos || []).forEach((emp, eIdx) => {
                const sit = calcularSituacaoPrazo(emp.dataDevolucao);
                todosEmprestimos.push({
                    alunoNome: aluno.nome,
                    alunoUser: aluno.username,
                    alunoTurma: aluno.turma || "Sem turma",
                    alunoFone: aluno.telefone || "",
                    alunoEmail: aluno.email || "",
                    livro: emp.livro,
                    dataRetirada: emp.dataRetirada,
                    dataDevolucao: emp.dataDevolucao,
                    situacao: sit,
                    uIdx: uIdx,
                    eIdx: eIdx
                });
            });
        });

        const filtrados = filtroPrazo === "todos"
            ? todosEmprestimos
            : todosEmprestimos.filter(item => item.situacao.status === filtroPrazo);

        let conteudoAba = "";

        if (abaAtiva === "emprestimos") {
            const cardsHtml = filtrados.length === 0
                ? `<p style="color:#8b949e; text-align:center; padding:24px;">Nenhum empréstimo encontrado neste filtro.</p>`
                : filtrados.map(item => {
                    const msgCobranca = item.situacao.status === "atrasado"
                        ? `Olá ${item.alunoNome}! O livro "${item.livro}" da Biblioteca Escolar venceu em ${item.dataDevolucao} (${item.situacao.dias} dia(s) de atraso). Multa atual: R$ ${item.situacao.multa} (R$ 0,50/dia). Por favor, regularize na biblioteca.`
                        : `Olá ${item.alunoNome}! Lembrete da Biblioteca Escolar: o prazo de devolução do livro "${item.livro}" vence em ${item.dataDevolucao}.`;
                    const linkZap = `https://wa.me{encodeURIComponent(msgCobranca)}`;
                    const linkMail = `mailto:${item.alunoEmail}?subject=${encodeURIComponent("Aviso Biblioteca Escolar - " + item.livro)}&body=${encodeURIComponent(msgCobranca)}`;

                    return `
                        <div style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:14px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                            <div>
                                <div style="margin-bottom:4px;">${item.situacao.badge}</div>
                                <strong style="color:#fff; font-size:15px; display:block;">📖 ${item.livro}</strong>
                                <span style="color:#c9d1d9; font-size:12px;">👤 ${item.alunoNome} (@${item.alunoUser}) • Turma: ${item.alunoTurma}</span><br>
                                <span style="color:#8b949e; font-size:11px;">📅 Retirado: ${item.dataRetirada} | Devolução: <strong>${item.dataDevolucao}</strong></span>
                            </div>
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                                <a href="${linkZap}" target="_blank" style="background:#238636; color:#fff; text-decoration:none; padding:7px 11px; border-radius:8px; font-size:12px; font-weight:bold;">📲 WhatsApp</a>
                                <a href="${linkMail}" style="background:#1f6feb; color:#fff; text-decoration:none; padding:7px 11px; border-radius:8px; font-size:12px; font-weight:bold;">📧 E-mail</a>
                                <button type="button" class="btn-baixa-admin" data-user="${item.alunoUser}" data-eidx="${item.eIdx}" style="background:#21262d; border:1px solid #00ff88; color:#00ff88; padding:7px 11px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer;">✅ Dar Baixa</button>
                            </div>
                        </div>
                    `;
                }).join("");

            conteudoAba = `
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:16px;">
                    <button type="button" class="filtro-prazo-btn" data-filtro="todos" style="padding:7px 12px; border-radius:8px; border:1px solid #2f81f7; background:${filtroPrazo === 'todos' ? '#2f81f7' : '#161b22'}; color:#fff; font-size:12px; font-weight:bold; cursor:pointer;">📋 Todos (${todosEmprestimos.length})</button>
                    <button type="button" class="filtro-prazo-btn" data-filtro="noprazo" style="padding:7px 12px; border-radius:8px; border:1px solid #00ff88; background:${filtroPrazo === 'noprazo' ? '#238636' : '#161b22'}; color:#fff; font-size:12px; font-weight:bold; cursor:pointer;">🟢 No Prazo</button>
                    <button type="button" class="filtro-prazo-btn" data-filtro="vencendo" style="padding:7px 12px; border-radius:8px; border:1px solid #ffd700; background:${filtroPrazo === 'vencendo' ? '#9e6a03' : '#161b22'}; color:#fff; font-size:12px; font-weight:bold; cursor:pointer;">🟡 Perto de Vencer</button>
                    <button type="button" class="filtro-prazo-btn" data-filtro="atrasado" style="padding:7px 12px; border-radius:8px; border:1px solid #ff4d4d; background:${filtroPrazo === 'atrasado' ? '#da3633' : '#161b22'}; color:#fff; font-size:12px; font-weight:bold; cursor:pointer;">🔴 Atrasados (Multa R$ 0,50/dia)</button>
                </div>
                <div style="max-height:52vh; overflow-y:auto;">${cardsHtml}</div>
            `;
        } else if (abaAtiva === "alunos") {
            const listaAlunosHtml = banco.length === 0
                ? `<p style="color:#8b949e; text-align:center; padding:20px;">Nenhum aluno cadastrado ainda.</p>`
                : banco.map(al => `
                    <div style="background:#161b22; border:1px solid #30363d; border-radius:10px; padding:12px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <strong style="color:#fff; font-size:14px;">👤 ${al.nome}</strong> <span style="color:#58a6ff; font-size:12px;">(@${al.username})</span>
                            <div style="color:#8b949e; font-size:12px;">🏫 ${al.escola || "Colégio Estadual"} • Turma: ${al.turma || "-"}</div>
                        </div>
                        <span style="background:rgba(47,129,247,0.15); border:1px solid #2f81f7; color:#58a6ff; padding:4px 10px; border-radius:10px; font-size:11px; font-weight:bold;">${(al.emprestimos || []).length} livro(s) ativo(s)</span>
                    </div>
                `).join("");
            conteudoAba = `<div style="max-height:55vh; overflow-y:auto;">${listaAlunosHtml}</div>`;
        } else if (abaAtiva === "novolivro") {
            conteudoAba = `
                <form id="formCadastroNovoLivroAdmin" style="display:grid; gap:12px;">
                    <div>
                        <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Título do Livro / HQ:</label>
                        <input type="text" id="adminNovoTitulo" placeholder="Ex: O Pequeno Príncipe" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Autor(a):</label>
                            <input type="text" id="adminNovoAutor" placeholder="Ex: Antoine de Saint-Exupéry" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                        </div>
                        <div>
                            <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Gênero / Categoria:</label>
                            <input type="text" id="adminNovoGenero" placeholder="Ex: Literatura Clássica" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                        </div>
                    </div>
                    <div style="display:grid; grid-template-columns:1fr 2fr; gap:10px;">
                        <div>
                            <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Qtd. Exemplares:</label>
                            <input type="number" id="adminNovoEstoque" value="4" min="1" max="50" required style="width:100%; padding:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                        </div>
                        <div>
                            <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">📷 Foto da Capa do Livro:</label>
                            <input type="file" id="adminNovaCapaFile" accept="image/*" required style="width:100%; padding:8px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#c9d1d9; font-size:12px;">
                        </div>
                    </div>
                    <button type="submit" style="padding:12px; border-radius:8px; border:none; background:#238636; color:#fff; font-weight:bold; font-size:14px; cursor:pointer;">➕ Publicar Livro no Catálogo</button>
                </form>
            `;
        }

        boxAdmin.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #30363d; padding-bottom:12px; margin-bottom:16px;">
                <div>
                    <h3 style="color:#58a6ff; margin:0; font-size:19px;">🏛️ Central do Bibliotecário • Gestão Escolar</h3>
                    <span style="color:#8b949e; font-size:12px;">Controle de prazos, cobrança automática e cadastro de acervo</span>
                </div>
                <button type="button" id="fecharAdminModal" style="background:none; border:none; color:#8b949e; font-size:20px; cursor:pointer;">✖</button>
            </div>

            <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; border-bottom:1px solid #30363d; padding-bottom:12px;">
                <button type="button" class="aba-admin-btn" data-aba="emprestimos" style="padding:9px 14px; border-radius:8px; border:1px solid #2f81f7; background:${abaAtiva === 'emprestimos' ? '#2f81f7' : '#161b22'}; color:#fff; font-weight:bold; font-size:13px; cursor:pointer;">📅 Prazos & Multas</button>
                <button type="button" class="aba-admin-btn" data-aba="alunos" style="padding:9px 14px; border-radius:8px; border:1px solid #2f81f7; background:${abaAtiva === 'alunos' ? '#2f81f7' : '#161b22'}; color:#fff; font-weight:bold; font-size:13px; cursor:pointer;">👥 Alunos Cadastrados (${banco.length})</button>
                <button type="button" class="aba-admin-btn" data-aba="novolivro" style="padding:9px 14px; border-radius:8px; border:1px solid #00ff88; background:${abaAtiva === 'novolivro' ? '#238636' : '#161b22'}; color:#fff; font-weight:bold; font-size:13px; cursor:pointer;">➕ Adicionar Novo Livro</button>
            </div>

            ${conteudoAba}
        `;

        document.getElementById("fecharAdminModal").onclick = () => modalAdmin.style.display = "none";

        boxAdmin.querySelectorAll(".aba-admin-btn").forEach(btn => {
            btn.onclick = () => renderizarDashboardAdmin(btn.getAttribute("data-aba"));
        });

        boxAdmin.querySelectorAll(".filtro-prazo-btn").forEach(btn => {
            btn.onclick = () => renderizarDashboardAdmin("emprestimos", btn.getAttribute("data-filtro"));
        });

        boxAdmin.querySelectorAll(".btn-baixa-admin").forEach(btn => {
            btn.onclick = () => {
                const uName = btn.getAttribute("data-user");
                const eIdx = parseInt(btn.getAttribute("data-eidx"));
                let db = JSON.parse(localStorage.getItem("bancoUsuariosRegistrados")) || [];
                const uObj = db.find(u => u.username === uName);
                if (uObj && uObj.emprestimos[eIdx]) {
                    const livroDev = uObj.emprestimos[eIdx].livro;
                    uObj.emprestimos.splice(eIdx, 1);
                    localStorage.setItem("bancoUsuariosRegistrados", JSON.stringify(db));

                    const logado = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
                    if (logado && logado.username === uName) {
                        localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(uObj));
                    }

                    let est = JSON.parse(localStorage.getItem("estoqueBiblioteca")) || {};
                    est[livroDev] = (est[livroDev] || 0) + 1;
                    localStorage.setItem("estoqueBiblioteca", JSON.stringify(est));

                    window.mostrarAvisoModerno(`Baixa registrada! "${livroDev}" devolvido ao estoque.`, "sucesso");
                    renderizarDashboardAdmin("emprestimos", filtroPrazo);
                }
            };
        });

        const formNovoLivro = document.getElementById("formCadastroNovoLivroAdmin");
        if (formNovoLivro) {
            formNovoLivro.onsubmit = (e) => {
                e.preventDefault();
                const titulo = document.getElementById("adminNovoTitulo").value.trim();
                const autor = document.getElementById("adminNovoAutor").value.trim();
                const genero = document.getElementById("adminNovoGenero").value.trim();
                const estoque = parseInt(document.getElementById("adminNovoEstoque").value) || 4;
                const file = document.getElementById("adminNovaCapaFile").files[0];

                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const extras = JSON.parse(localStorage.getItem("livrosExtrasBiblioteca")) || [];
                    extras.push({ id: Date.now(), titulo, autor, genero, estoque, capa: ev.target.result });
                    localStorage.setItem("livrosExtrasBiblioteca", JSON.stringify(extras));

                    let est = JSON.parse(localStorage.getItem("estoqueBiblioteca")) || {};
                    est[titulo] = estoque;
                    localStorage.setItem("estoqueBiblioteca", JSON.stringify(est));

                    window.mostrarAvisoModerno(`"${titulo}" foi cadastrado e publicado no catálogo!`, "sucesso");
                    renderizarLivrosExtrasCatalogo();
                    renderizarDashboardAdmin("emprestimos");
                };
                reader.readAsDataURL(file);
            };
        }
    }

    const rodape = document.querySelector(".rodape-conteudo");
    if (rodape && !document.getElementById("btnAbrirPainelBibliotecarioRodape")) {
        const blocoGestao = document.createElement("div");
        blocoGestao.className = "rodape-bloco";
        blocoGestao.innerHTML = `
            <h5>Gestão Bibliotecária</h5>
            <p>Controle de prazos, multas e acervo</p>
            <button type="button" id="btnAbrirPainelBibliotecarioRodape" style="margin-top:8px; background:rgba(47,129,247,0.18); border:1px solid #2f81f7; color:#58a6ff; padding:7px 14px; border-radius:8px; font-size:12px; font-weight:bold; cursor:pointer;">🔒 Painel do Bibliotecário</button>
        `;
        rodape.appendChild(blocoGestao);
        document.getElementById("btnAbrirPainelBibliotecarioRodape").onclick = window.abrirPainelBibliotecario;
    }
});
