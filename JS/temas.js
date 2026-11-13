document.addEventListener("DOMContentLoaded", function () {
    const seletorTema = document.getElementById("seletorTema");
    const videoFundo = document.getElementById("videoFundo");
    const iconePerfil = document.querySelector(".google-profile");

    const estaNaSubpasta = window.location.pathname.includes("/livros/");
    const prefixoOrigem = estaNaSubpasta ? "../" : "";

    const estiloAnimacao = document.createElement("style");
    estiloAnimacao.textContent = `
        @keyframes deslizarDireitaEsquerda {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .gaveta-perfil-animada {
            animation: deslizarDireitaEsquerda 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        body.modo-claro-site {
            background-color: #f0f4f8 !important;
            color: #1c2128 !important;
        }
        body.modo-claro-site .bloco-livro,
        body.modo-claro-site .container-interno-livro,
        body.modo-claro-site .secao-comentarios {
            background: rgba(255, 255, 255, 0.94) !important;
            color: #1c2128 !important;
            border-color: #cbd5e1 !important;
        }
        body.modo-claro-site h2,
        body.modo-claro-site h3,
        body.modo-claro-site h4,
        body.modo-claro-site p {
            color: #1c2128 !important;
        }
        body.fundo-solido-cards .bloco-livro,
        body.fundo-solido-cards .container-interno-livro,
        body.fundo-solido-cards .secao-comentarios {
            background: #0d1117 !important;
            backdrop-filter: none !important;
        }
    `;
    document.head.appendChild(estiloAnimacao);

    function aplicarPreferenciasVisuais() {
        const prefs = JSON.parse(localStorage.getItem("prefsVisuaisBiblioteca")) || {
            modoClaro: false,
            fundoSolido: false,
            escalaFonte: 100
        };
        document.body.classList.toggle("modo-claro-site", !!prefs.modoClaro);
        document.body.classList.toggle("fundo-solido-cards", !!prefs.fundoSolido);
        document.documentElement.style.fontSize = (prefs.escalaFonte || 100) + "%";
    }
    aplicarPreferenciasVisuais();

    const escolasParana = [
        "Colégio Estadual Humberto de Alencar Castelo Branco (Pinhais)",
        "IFPR - Instituto Federal do Paraná (Campus Pinhais)",
        "IFPR - Instituto Federal do Paraná (Campus Curitiba)",
        "Colégio Estadual Daniel Rocha (Pinhais)",
        "Colégio Estadual Arnaldo Jansen (Pinhais)",
        "Colégio Estadual Mathias Jacomel (Pinhais)",
        "Colégio Estadual Semiramis de Barros Braga (Pinhais)",
        "Colégio Estadual Tenente Sprenger (Pinhais)",
        "Colégio Estadual do Paraná - CEP (Curitiba)",
        "UTFPR - Universidade Tecnológica Federal do Paraná (Curitiba)"
    ];

    const configuracaoTemas = {
        galaxia: {
            videos: ["img/espacio.mp4"],
            corDestaque: "#2f81f7",
            corTexto: "#58a6ff",
            fundoCard: "rgba(22, 27, 34, 0.85)",
            bordaCard: "#30363d"
        },
        batman: {
            videos: ["img/gotham.mp4", "img/gotham.mp4", "img/gotham.mp4", "img/gotham.mp4", "img/gotham.mp4"],
            corDestaque: "#f1c40f",
            corTexto: "#ffd700",
            fundoCard: "rgba(18, 18, 18, 0.90)",
            bordaCard: "#f1c40f"
        },
        stranger: {
            videos: ["img/stranger.mp4", "img/Stranger.mp4"],
            corDestaque: "#e50914",
            corTexto: "#ff4d4d",
            fundoCard: "rgba(25, 10, 14, 0.88)",
            bordaCard: "#e50914"
        },
        aranha: {
            videos: ["img/aranha.mp4", "img/Aranha.mp4"],
            corDestaque: "#00d2ff",
            corTexto: "#00f2fe",
            fundoCard: "rgba(10, 20, 40, 0.88)",
            bordaCard: "#e23636"
        },
        hogwarts: {
            videos: ["img/hogwarts.mp4", "img/Hogwarts.mp4"],
            corDestaque: "#d4af37",
            corTexto: "#f3e5ab",
            fundoCard: "rgba(28, 18, 36, 0.88)",
            bordaCard: "#d4af37"
        }
    };

    function carregarVideoComFallback(listaVideos, indice = 0) {
        if (!videoFundo || indice >= listaVideos.length) return;
        const source = videoFundo.querySelector("source");
        if (!source) return;

        source.onerror = function () {
            carregarVideoComFallback(listaVideos, indice + 1);
        };
        videoFundo.onerror = function () {
            carregarVideoComFallback(listaVideos, indice + 1);
        };

        source.src = prefixoOrigem + listaVideos[indice];
        videoFundo.load();
        videoFundo.play().catch(() => { });
    }

    function aplicarTema(nomeTema) {
        const tema = configuracaoTemas[nomeTema] || configuracaoTemas.galaxia;
        carregarVideoComFallback(tema.videos, 0);

        document.documentElement.style.setProperty("--cor-destaque", tema.corDestaque);
        document.documentElement.style.setProperty("--cor-texto-destaque", tema.corTexto);

        document.querySelectorAll(".bloco-livro, .container-interno-livro, .secao-comentarios").forEach(el => {
            el.style.background = tema.fundoCard;
            el.style.borderColor = tema.bordaCard;
        });

        document.querySelectorAll("h2").forEach(h2 => {
            h2.style.borderLeftColor = tema.corDestaque;
        });

        localStorage.setItem("temaBibliotecaXandao", nomeTema);
    }

    const temaSalvo = localStorage.getItem("temaBibliotecaXandao") || "galaxia";
    if (seletorTema) {
        seletorTema.value = temaSalvo;
        seletorTema.addEventListener("change", function () {
            aplicarTema(this.value);
        });
    }
    aplicarTema(temaSalvo);

    function sincronizarBancoGlobal(usuario) {
        if (!usuario || usuario.ehVisitante) return;
        let banco = JSON.parse(localStorage.getItem("bancoUsuariosRegistrados")) || [];
        const index = banco.findIndex(u => u.username === usuario.username);
        if (index !== -1) {
            banco[index] = usuario;
        } else {
            banco.push(usuario);
        }
        localStorage.setItem("bancoUsuariosRegistrados", JSON.stringify(banco));
    }

    function atualizarAvatarTopo() {
        if (!iconePerfil) return;
        const user = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
        iconePerfil.innerHTML = "";
        iconePerfil.style.overflow = "hidden";
        iconePerfil.style.backgroundImage = "none";
        iconePerfil.style.padding = "0px";
        iconePerfil.style.display = "inline-flex";
        iconePerfil.style.alignItems = "center";
        iconePerfil.style.justifyContent = "center";

        if (user && !user.ehVisitante && user.foto) {
            const img = document.createElement("img");
            img.src = user.foto;
            img.alt = "Perfil";
            img.style.cssText = "width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;";
            iconePerfil.appendChild(img);
            iconePerfil.style.borderColor = "#00ff88";
            iconePerfil.title = `${user.nome} (@${user.username}) - Clique para abrir seu Perfil`;
        } else if (user && !user.ehVisitante && user.nome) {
            const span = document.createElement("span");
            span.textContent = user.nome.trim().charAt(0).toUpperCase();
            span.style.cssText = "color:#ffffff; font-weight:bold; font-size:15px;";
            iconePerfil.appendChild(span);
            iconePerfil.style.background = "#238636";
            iconePerfil.style.borderColor = "#00ff88";
            iconePerfil.title = `${user.nome} (@${user.username})`;
        } else {
            const spanVisitante = document.createElement("span");
            spanVisitante.textContent = "👤";
            spanVisitante.style.cssText = "font-size:15px;";
            iconePerfil.appendChild(spanVisitante);
            iconePerfil.style.background = "#161b22";
            iconePerfil.style.borderColor = "#58a6ff";
            iconePerfil.title = "Visitante - Clique para entrar ou criar sua Conta";
        }
    }

    function abrirEditorRecorteFoto(imagemBase64, onSalvarRecorte) {
        const overlayCrop = document.createElement("div");
        overlayCrop.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 2147483647;
            display: flex; justify-content: center; align-items: center; padding: 16px;
        `;

        overlayCrop.innerHTML = `
            <div style="background:#0d1117; border:2px solid #2f81f7; border-radius:16px; padding:22px; width:100%; max-width:380px; text-align:center; color:#fff; font-family:'Segoe UI', sans-serif;">
                <h4 style="margin:0 0 6px 0; color:#58a6ff; font-size:16px;">✂️ Enquadrar Foto de Perfil</h4>
                <p style="margin:0 0 14px 0; color:#8b949e; font-size:12px;">Arraste a foto para centralizar e use o zoom abaixo</p>

                <div id="areaPreviewCrop" style="width:220px; height:220px; margin:0 auto 14px auto; border-radius:50%; overflow:hidden; border:3px solid #00ff88; position:relative; cursor:grab; background:#161b22; touch-action:none;">
                    <canvas id="canvasCropPerfil" width="220" height="220"></canvas>
                </div>

                <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
                    <span style="font-size:12px; color:#8b949e;">➖</span>
                    <input type="range" id="sliderZoomCrop" min="1" max="3" step="0.05" value="1.2" style="flex:1; cursor:pointer;">
                    <span style="font-size:12px; color:#8b949e;">➕</span>
                </div>

                <div style="display:flex; gap:10px;">
                    <button type="button" id="btnCancelarCrop" style="flex:1; padding:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#c9d1d9; font-weight:bold; cursor:pointer;">Cancelar</button>
                    <button type="button" id="btnConfirmarCrop" style="flex:1; padding:10px; border-radius:8px; border:none; background:#238636; color:#fff; font-weight:bold; cursor:pointer;">✅ Aplicar Foto</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlayCrop);

        const canvas = document.getElementById("canvasCropPerfil");
        const ctx = canvas.getContext("2d");
        const sliderZoom = document.getElementById("sliderZoomCrop");
        const img = new Image();
        let zoom = 1.2, posX = 0, posY = 0, arrastando = false, inicioX = 0, inicioY = 0;

        function redesenhar() {
            ctx.clearRect(0, 0, 220, 220);
            const escalaBase = Math.max(220 / img.width, 220 / img.height);
            const w = img.width * escalaBase * zoom;
            const h = img.height * escalaBase * zoom;
            const x = (220 - w) / 2 + posX;
            const y = (220 - h) / 2 + posY;
            ctx.drawImage(img, x, y, w, h);
        }

        img.onload = redesenhar;
        img.src = imagemBase64;

        sliderZoom.oninput = function () {
            zoom = parseFloat(this.value);
            redesenhar();
        };

        const iniciarArraste = (cx, cy) => { arrastando = true; inicioX = cx - posX; inicioY = cy - posY; };
        const moverArraste = (cx, cy) => { if (!arrastando) return; posX = cx - inicioX; posY = cy - inicioY; redesenhar(); };
        const pararArraste = () => { arrastando = false; };

        canvas.onmousedown = e => iniciarArraste(e.clientX, e.clientY);
        window.addEventListener("mousemove", e => moverArraste(e.clientX, e.clientY));
        window.addEventListener("mouseup", pararArraste);

        canvas.ontouchstart = e => { const t = e.touches[0]; iniciarArraste(t.clientX, t.clientY); };
        canvas.ontouchmove = e => { e.preventDefault(); const t = e.touches[0]; moverArraste(t.clientX, t.clientY); };
        canvas.ontouchend = pararArraste;

        document.getElementById("btnCancelarCrop").onclick = () => overlayCrop.remove();
        document.getElementById("btnConfirmarCrop").onclick = () => {
            const resultadoRecortado = canvas.toDataURL("image/jpeg", 0.9);
            overlayCrop.remove();
            onSalvarRecorte(resultadoRecortado);
        };
    }
    const modalOverlay = document.createElement("div");
    modalOverlay.id = "modalRedeBiblioteca";
    modalOverlay.style.cssText = `
        display: none; position: fixed; inset: 0;
        background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px);
        z-index: 2147483647; justify-content: flex-end; align-items: stretch;
    `;

    const modalBox = document.createElement("div");
    modalBox.className = "gaveta-perfil-animada";
    modalBox.style.cssText = `
        background: #0d1117; border-left: 2px solid #2f81f7; width: 100%; max-width: 450px;
        height: 100vh; padding: 24px 22px; color: #f0f6fc; font-family: 'Segoe UI', sans-serif;
        box-shadow: -15px 0 40px rgba(0, 0, 0, 0.95); position: relative;
        overflow-y: auto; overflow-x: hidden;
    `;
    modalOverlay.appendChild(modalBox);
    document.body.appendChild(modalOverlay);

    modalOverlay.addEventListener("click", function (e) {
        if (e.target === modalOverlay) modalOverlay.style.display = "none";
    });

    window.abrirPainelConta = function () {
        const user = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));

        if (!user || user.ehVisitante) {
            const listaEscolasHTML = escolasParana.map(esc => `<option value="${esc}">${esc}</option>`).join("");

            modalBox.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #30363d; padding-bottom:12px; margin-bottom:18px;">
                    <h3 style="color:#58a6ff; font-size:18px; margin:0;">🏛️ Conta Oficial • Biblioteca</h3>
                    <button type="button" id="fecharModalRede" style="background:none; border:none; color:#8b949e; font-size:20px; cursor:pointer;">✖</button>
                </div>

                <div style="display:flex; gap:8px; margin-bottom:18px;">
                    <button type="button" id="tabEntrarConta" style="flex:1; padding:9px; border-radius:8px; border:1px solid #2f81f7; background:#2f81f7; color:#fff; font-weight:bold; cursor:pointer;">🔑 Entrar</button>
                    <button type="button" id="tabCriarConta" style="flex:1; padding:9px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#c9d1d9; font-weight:bold; cursor:pointer;">✨ Criar Conta</button>
                </div>

                <div id="formLoginConta">
                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:5px;">Nome de Usuário (@username) ou E-mail:</label>
                    <input type="text" id="loginIdentificador" placeholder="Ex: pedro.gargantini" style="width:100%; padding:11px; margin-bottom:12px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">

                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:5px;">Senha:</label>
                    <input type="password" id="loginSenhaInput" placeholder="Digite sua senha" style="width:100%; padding:11px; margin-bottom:16px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">

                    <button type="button" id="btnExecutarLogin" style="width:100%; padding:12px; border-radius:8px; border:none; background:#238636; color:#fff; font-weight:bold; font-size:14px; cursor:pointer;">🚀 Acessar Minha Conta</button>
                </div>

                <div id="formRegistroConta" style="display:none;">
                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Nome Completo:</label>
                    <input type="text" id="regNomeCompleto" placeholder="Ex: Pedro Henrique" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">

                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Nome de Usuário (@username):</label>
                    <input type="text" id="regUsername" placeholder="Ex: pedro.dev" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">

                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Instituição / Colégio:</label>
                    <select id="regEscola" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                        ${listaEscolasHTML}
                    </select>

                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Turma / Série:</label>
                    <input type="text" id="regTurma" placeholder="Ex: 2º Técnico S" style="width:100%; padding:10px; margin-bottom:10px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">

                    <label style="font-size:12px; color:#8b949e; display:block; margin-bottom:4px;">Crie uma Senha:</label>
                    <input type="password" id="regSenha" placeholder="Mínimo 4 caracteres" style="width:100%; padding:10px; margin-bottom:14px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">

                    <button type="button" id="btnSalvarPerfilOficial" style="width:100%; padding:12px; border-radius:8px; border:none; background:#2f81f7; color:#fff; font-weight:bold; font-size:14px; cursor:pointer;">✅ Concluir Cadastro</button>
                </div>
            `;

            document.getElementById("tabEntrarConta").onclick = () => {
                document.getElementById("formLoginConta").style.display = "block";
                document.getElementById("formRegistroConta").style.display = "none";
                document.getElementById("tabEntrarConta").style.background = "#2f81f7";
                document.getElementById("tabCriarConta").style.background = "#161b22";
            };

            document.getElementById("tabCriarConta").onclick = () => {
                document.getElementById("formLoginConta").style.display = "none";
                document.getElementById("formRegistroConta").style.display = "block";
                document.getElementById("tabCriarConta").style.background = "#2f81f7";
                document.getElementById("tabEntrarConta").style.background = "#161b22";
            };

            document.getElementById("btnExecutarLogin").onclick = () => {
                const idDigitado = document.getElementById("loginIdentificador").value.trim().toLowerCase();
                const senhaDigitada = document.getElementById("loginSenhaInput").value.trim();
                const banco = JSON.parse(localStorage.getItem("bancoUsuariosRegistrados")) || [];
                const encontrado = banco.find(u => (u.username && u.username.toLowerCase() === idDigitado) || (u.email && u.email.toLowerCase() === idDigitado));

                if (encontrado && encontrado.senha === senhaDigitada) {
                    localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(encontrado));
                    atualizarAvatarTopo();
                    renderizarPerfilLogado(encontrado);
                } else {
                    alert("⚠️ Usuário ou senha incorretos. Se ainda não tem conta, clique em 'Criar Conta'!");
                }
            };

            document.getElementById("btnSalvarPerfilOficial").onclick = () => {
                const nome = document.getElementById("regNomeCompleto").value.trim();
                const username = document.getElementById("regUsername").value.trim().replace(/^@/, "");
                const escola = document.getElementById("regEscola").value;
                const turma = document.getElementById("regTurma").value.trim();
                const senha = document.getElementById("regSenha").value.trim();

                if (!nome || !username || !senha) {
                    alert("⚠️ Preencha Nome, Usuário e Senha para continuar!");
                    return;
                }

                const contaOficial = {
                    nome: nome,
                    username: username,
                    escola: escola,
                    turma: turma || "Estudante",
                    senha: senha,
                    foto: "",
                    ehVisitante: false,
                    emprestimos: []
                };

                sincronizarBancoGlobal(contaOficial);
                localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(contaOficial));
                atualizarAvatarTopo();
                renderizarPerfilLogado(contaOficial);
            };
        } else {
            renderizarPerfilLogado(user);
        }

        document.getElementById("fecharModalRede").onclick = () => { modalOverlay.style.display = "none"; };
        modalOverlay.style.display = "flex";
    };
    function renderizarPerfilLogado(user, abaSelecionada = "perfil") {
        const listaEmprestimos = user.emprestimos || [];
        const listaFavoritos = JSON.parse(localStorage.getItem("favoritosBiblioteca")) || [];
        const prefs = JSON.parse(localStorage.getItem("prefsVisuaisBiblioteca")) || { modoClaro: false, fundoSolido: false, escalaFonte: 100 };
        const inicialAluno = (user.nome || "A").trim().charAt(0).toUpperCase();

        const blocoAvatarHTML = user.foto
            ? `<img src="${user.foto}" alt="Avatar" style="width:72px; height:72px; border-radius:50%; object-fit:cover; border:2px solid #00ff88; display:block; margin:0 auto;">`
            : `<div style="width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg, #238636, #2f81f7); border:2px solid #00ff88; color:#fff; font-size:28px; font-weight:bold; display:flex; align-items:center; justify-content:center; margin:0 auto;">${inicialAluno}</div>`;

        let conteudoAbaPerfil = "";

        if (abaSelecionada === "perfil") {
            conteudoAbaPerfil = `
                <div style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:14px; margin-bottom:14px;">
                    <h4 style="color:#58a6ff; font-size:12px; text-transform:uppercase; margin:0 0 10px 0;">🪪 Carteirinha Digital SEED-PR</h4>
                    <p style="margin:4px 0; font-size:13px; color:#c9d1d9;"><strong>Nome:</strong> ${user.nome}</p>
                    <p style="margin:4px 0; font-size:13px; color:#c9d1d9;"><strong>Usuário:</strong> @${user.username}</p>
                    <p style="margin:4px 0; font-size:13px; color:#c9d1d9;"><strong>Turma / Série:</strong> ${user.turma || "Estudante"}</p>
                    <p style="margin:4px 0; font-size:13px; color:#c9d1d9;"><strong>Contato:</strong> ${user.email || "Não informado"}</p>
                    <p style="margin:4px 0; font-size:13px; color:#c9d1d9;"><strong>Instituição:</strong> ${user.escola || "Colégio Estadual"}</p>
                    <p style="margin:8px 0 0 0; font-size:12px; color:#00ff88;">● Status: Matrícula Ativa • Prazo de 14 dias</p>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px;">
                    <div style="background:#161b22; border:1px solid #30363d; border-radius:10px; padding:12px; text-align:center;">
                        <strong style="font-size:20px; color:#00ff88; display:block;">${listaEmprestimos.length}</strong>
                        <span style="font-size:11px; color:#8b949e;">Livros Retirados</span>
                    </div>
                    <div style="background:#161b22; border:1px solid #30363d; border-radius:10px; padding:12px; text-align:center;">
                        <strong style="font-size:20px; color:#ff6b9d; display:block;">${listaFavoritos.length}</strong>
                        <span style="font-size:11px; color:#8b949e;">Obras Favoritas</span>
                    </div>
                </div>
            `;
        } else if (abaSelecionada === "livros") {
            const htmlEmprestimos = listaEmprestimos.length === 0
                ? `<p style="color:#8b949e; font-size:13px; text-align:center; padding:12px 0;">Nenhum livro retirado no momento.</p>`
                : listaEmprestimos.map((emp, idx) => `
                    <div style="background:#161b22; border-left:3px solid #00ff88; padding:10px 12px; border-radius:6px; margin-bottom:8px; font-size:13px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                        <div>
                            <strong style="color:#fff; display:block;">📖 ${emp.livro}</strong>
                            <span style="color:#8b949e; font-size:11px;">Devolver até: ${emp.dataDevolucao}</span>
                        </div>
                        <button type="button" class="btn-devolver-livro-aluno" data-idx="${idx}" style="background:#21262d; border:1px solid #00ff88; color:#00ff88; padding:5px 10px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">Devolver</button>
                    </div>
                `).join("");

            const htmlFavs = listaFavoritos.length === 0
                ? `<p style="color:#8b949e; font-size:13px; text-align:center; padding:12px 0;">Nenhuma obra favoritada ainda.</p>`
                : listaFavoritos.map((tituloFav, idxFav) => `
                    <div style="background:#161b22; border-left:3px solid #ff0055; padding:10px 12px; border-radius:6px; margin-bottom:8px; font-size:13px; display:flex; justify-content:space-between; align-items:center; gap:8px;">
                        <strong style="color:#fff;">❤️ ${tituloFav}</strong>
                        <button type="button" class="btn-remover-fav-perfil" data-idx-fav="${idxFav}" style="background:#21262d; border:1px solid #da3633; color:#ff6b6b; padding:4px 8px; border-radius:6px; font-size:11px; cursor:pointer;">✖</button>
                    </div>
                `).join("");

            conteudoAbaPerfil = `
                <h4 style="color:#00ff88; font-size:12px; text-transform:uppercase; margin:0 0 8px 0;">📚 Empréstimos Ativos (${listaEmprestimos.length})</h4>
                <div style="max-height:175px; overflow-y:auto; margin-bottom:14px;">${htmlEmprestimos}</div>

                <h4 style="color:#ff6b9d; font-size:12px; text-transform:uppercase; margin:0 0 8px 0;">❤️ Livros Favoritados (${listaFavoritos.length})</h4>
                <div style="max-height:175px; overflow-y:auto; margin-bottom:14px;">${htmlFavs}</div>
            `;
        } else if (abaSelecionada === "ajustes") {
            const opcoesEscolas = escolasParana.map(esc =>
                `<option value="${esc}" ${user.escola === esc ? "selected" : ""}>${esc}</option>`
            ).join("");

            conteudoAbaPerfil = `
                <div style="background:#161b22; border:1px solid #30363d; border-radius:12px; padding:12px; margin-bottom:12px;">
                    <h4 style="color:#58a6ff; font-size:12px; text-transform:uppercase; margin:0 0 10px 0;">🎨 Aparência & Acessibilidade do Site</h4>
                    <label style="display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#c9d1d9; margin-bottom:8px; cursor:pointer;">
                        <span>☀️ Modo Claro (Leitura Diurna)</span>
                        <input type="checkbox" id="chkModoClaroSite" ${prefs.modoClaro ? "checked" : ""}>
                    </label>
                    <label style="display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#c9d1d9; margin-bottom:8px; cursor:pointer;">
                        <span>🧱 Cartões Sólidos (Sem Transparência)</span>
                        <input type="checkbox" id="chkFundoSolidoCards" ${prefs.fundoSolido ? "checked" : ""}>
                    </label>
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:13px; color:#c9d1d9;">
                        <span>🔠 Tamanho do Texto (${prefs.escalaFonte || 100}%)</span>
                        <div style="display:flex; gap:6px;">
                            <button type="button" id="btnFonteSiteMenor" style="padding:3px 9px; border-radius:6px; border:1px solid #30363d; background:#0d1117; color:#fff; cursor:pointer;">A-</button>
                            <button type="button" id="btnFonteSiteMaior" style="padding:3px 9px; border-radius:6px; border:1px solid #30363d; background:#0d1117; color:#fff; cursor:pointer;">A+</button>
                        </div>
                    </div>
                </div>

                <div style="display:grid; gap:9px; margin-bottom:14px;">
                    <div>
                        <label style="font-size:11px; color:#8b949e;">Nome Completo:</label>
                        <input type="text" id="editNomePerfil" value="${user.nome || ""}" style="width:100%; padding:8px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                    </div>
                    <div>
                        <label style="font-size:11px; color:#8b949e;">Turma / Série:</label>
                        <input type="text" id="editTurmaPerfil" value="${user.turma || ""}" style="width:100%; padding:8px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                    </div>
                    <div>
                        <label style="font-size:11px; color:#8b949e;">E-mail / WhatsApp (Avisos de Devolução):</label>
                        <input type="text" id="editContatoPerfil" value="${user.email || ""}" style="width:100%; padding:8px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                    </div>
                    <div>
                        <label style="font-size:11px; color:#8b949e;">Instituição Escolar:</label>
                        <select id="editEscolaPerfil" style="width:100%; padding:8px; border-radius:8px; border:1px solid #30363d; background:#161b22; color:#fff;">
                            ${opcoesEscolas}
                        </select>
                    </div>
                    <button type="button" id="btnSalvarAjustesPerfil" style="padding:10px; border-radius:8px; border:none; background:#238636; color:#fff; font-weight:bold; cursor:pointer;">💾 Salvar Dados</button>
                </div>
            `;
        } else if (abaSelecionada === "novidades") {
            conteudoAbaPerfil = `
                <div style="display:grid; gap:10px; margin-bottom:14px;">
                    <div style="background:#161b22; border-left:3px solid #2f81f7; padding:10px 12px; border-radius:8px;">
                        <strong style="color:#58a6ff; font-size:13px; display:block;">🚀 Feira de Ciências 2026</strong>
                        <span style="color:#c9d1d9; font-size:12px;">Catálogo 100% digitalizado com 50 obras, modo Kindle e QR Code por livro!</span>
                    </div>
                    <div style="background:#161b22; border-left:3px solid #ffd700; padding:10px 12px; border-radius:8px;">
                        <strong style="color:#ffd700; font-size:13px; display:block;">⏰ Regra de Prazos & Multa</strong>
                        <span style="color:#c9d1d9; font-size:12px;">Prazo padrão de 14 dias. Após o vencimento, aplica-se multa simbólica de R$ 0,50 por dia de atraso.</span>
                    </div>
                    <div style="background:#161b22; border-left:3px solid #00ff88; padding:10px 12px; border-radius:8px;">
                        <strong style="color:#00ff88; font-size:13px; display:block;">🏆 Votação da Comunidade</strong>
                        <span style="color:#c9d1d9; font-size:12px;">Participe da aba Votação para escolher os próximos livros do acervo escolar.</span>
                    </div>
                </div>
            `;
        }

        modalBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #30363d; padding-bottom:12px; margin-bottom:14px;">
                <h3 style="color:#58a6ff; font-size:18px; margin:0;">👤 Painel do Estudante</h3>
                <button type="button" id="fecharModalRede" style="background:none; border:none; color:#8b949e; font-size:20px; cursor:pointer;">✖</button>
            </div>

            <div style="display:flex; align-items:center; gap:14px; background:#161b22; border:1px solid #30363d; padding:14px; border-radius:12px; margin-bottom:14px;">
                <div style="text-align:center; flex-shrink:0;">
                    ${blocoAvatarHTML}
                    <label for="inputFotoTopoDireto" style="display:inline-block; margin-top:7px; padding:4px 9px; background:#21262d; border:1px solid #58a6ff; color:#58a6ff; border-radius:8px; font-size:10px; font-weight:bold; cursor:pointer;">📷 Trocar Foto</label>
                    <input type="file" id="inputFotoTopoDireto" accept="image/*" style="display:none;">
                </div>
                <div>
                    <strong style="font-size:16px; color:#fff; display:block;">${user.nome}</strong>
                    <span style="font-size:12px; color:#58a6ff; display:block;">@${user.username} • ${user.turma || "Aluno"}</span>
                    <span style="font-size:11px; color:#8b949e; display:block; margin-top:2px;">🏫 ${user.escola || "Rede Estadual PR"}</span>
                </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; margin-bottom:16px;">
                <button type="button" class="aba-perfil-btn" data-aba="perfil" style="padding:8px 4px; border-radius:8px; border:1px solid #2f81f7; background:${abaSelecionada === 'perfil' ? '#2f81f7' : '#161b22'}; color:#fff; font-size:11px; font-weight:bold; cursor:pointer;">👤 Perfil</button>
                <button type="button" class="aba-perfil-btn" data-aba="livros" style="padding:8px 4px; border-radius:8px; border:1px solid #2f81f7; background:${abaSelecionada === 'livros' ? '#2f81f7' : '#161b22'}; color:#fff; font-size:11px; font-weight:bold; cursor:pointer;">📚 Livros</button>
                <button type="button" class="aba-perfil-btn" data-aba="ajustes" style="padding:8px 4px; border-radius:8px; border:1px solid #2f81f7; background:${abaSelecionada === 'ajustes' ? '#2f81f7' : '#161b22'}; color:#fff; font-size:11px; font-weight:bold; cursor:pointer;">⚙️ Ajustes</button>
                <button type="button" class="aba-perfil-btn" data-aba="novidades" style="padding:8px 4px; border-radius:8px; border:1px solid #2f81f7; background:${abaSelecionada === 'novidades' ? '#2f81f7' : '#161b22'}; color:#fff; font-size:11px; font-weight:bold; cursor:pointer;">📢 Avisos</button>
            </div>

            ${conteudoAbaPerfil}

            <button type="button" id="btnSairContaPerfil" style="width:100%; padding:11px; border-radius:8px; border:1px solid #da3633; background:rgba(218,54,51,0.15); color:#ff6b6b; font-weight:bold; cursor:pointer;">🚪 Sair da Conta</button>
        `;

        document.getElementById("fecharModalRede").onclick = () => { modalOverlay.style.display = "none"; };

        document.getElementById("inputFotoTopoDireto").onchange = function (e) {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function (ev) {
                abrirEditorRecorteFoto(ev.target.result, function (fotoEnquadrada) {
                    user.foto = fotoEnquadrada;
                    sincronizarBancoGlobal(user);
                    localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(user));
                    atualizarAvatarTopo();
                    renderizarPerfilLogado(user, abaSelecionada);
                    alert("✅ Foto de perfil enquadrada e salva!");
                });
            };
            reader.readAsDataURL(file);
        };

        modalBox.querySelectorAll(".aba-perfil-btn").forEach(btn => {
            btn.onclick = () => renderizarPerfilLogado(user, btn.getAttribute("data-aba"));
        });

        const chkClaro = document.getElementById("chkModoClaroSite");
        if (chkClaro) {
            chkClaro.onchange = function () {
                prefs.modoClaro = this.checked;
                localStorage.setItem("prefsVisuaisBiblioteca", JSON.stringify(prefs));
                aplicarPreferenciasVisuais();
            };
        }

        const chkSolido = document.getElementById("chkFundoSolidoCards");
        if (chkSolido) {
            chkSolido.onchange = function () {
                prefs.fundoSolido = this.checked;
                localStorage.setItem("prefsVisuaisBiblioteca", JSON.stringify(prefs));
                aplicarPreferenciasVisuais();
            };
        }

        const btnMenor = document.getElementById("btnFonteSiteMenor");
        if (btnMenor) {
            btnMenor.onclick = () => {
                prefs.escalaFonte = Math.max(85, (prefs.escalaFonte || 100) - 5);
                localStorage.setItem("prefsVisuaisBiblioteca", JSON.stringify(prefs));
                aplicarPreferenciasVisuais();
                renderizarPerfilLogado(user, "ajustes");
            };
        }

        const btnMaior = document.getElementById("btnFonteSiteMaior");
        if (btnMaior) {
            btnMaior.onclick = () => {
                prefs.escalaFonte = Math.min(120, (prefs.escalaFonte || 100) + 5);
                localStorage.setItem("prefsVisuaisBiblioteca", JSON.stringify(prefs));
                aplicarPreferenciasVisuais();
                renderizarPerfilLogado(user, "ajustes");
            };
        }

        const btnSalvarAjustes = document.getElementById("btnSalvarAjustesPerfil");
        if (btnSalvarAjustes) {
            btnSalvarAjustes.onclick = () => {
                user.nome = document.getElementById("editNomePerfil").value.trim() || user.nome;
                user.turma = document.getElementById("editTurmaPerfil").value.trim() || user.turma;
                user.email = document.getElementById("editContatoPerfil").value.trim();
                user.escola = document.getElementById("editEscolaPerfil").value;
                sincronizarBancoGlobal(user);
                localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(user));
                atualizarAvatarTopo();
                alert("✅ Dados do perfil atualizados com sucesso!");
                renderizarPerfilLogado(user, "perfil");
            };
        }

        modalBox.querySelectorAll(".btn-devolver-livro-aluno").forEach(btn => {
            btn.onclick = function () {
                const idx = parseInt(this.getAttribute("data-idx"));
                const itemDevolvido = user.emprestimos[idx];
                if (itemDevolvido) {
                    let est = JSON.parse(localStorage.getItem("estoqueBiblioteca")) || {};
                    est[itemDevolvido.livro] = (est[itemDevolvido.livro] || 0) + 1;
                    localStorage.setItem("estoqueBiblioteca", JSON.stringify(est));
                }
                user.emprestimos.splice(idx, 1);
                sincronizarBancoGlobal(user);
                localStorage.setItem("usuarioRedeBiblioteca", JSON.stringify(user));
                renderizarPerfilLogado(user, "livros");
            };
        });

        modalBox.querySelectorAll(".btn-remover-fav-perfil").forEach(btn => {
            btn.onclick = function () {
                const idxFav = parseInt(this.getAttribute("data-idx-fav"));
                const favsAtuais = JSON.parse(localStorage.getItem("favoritosBiblioteca")) || [];
                favsAtuais.splice(idxFav, 1);
                localStorage.setItem("favoritosBiblioteca", JSON.stringify(favsAtuais));
                renderizarPerfilLogado(user, "livros");
            };
        });

        document.getElementById("btnSairContaPerfil").onclick = () => {
            localStorage.removeItem("usuarioRedeBiblioteca");
            atualizarAvatarTopo();
            window.abrirPainelConta();
        };
    }

    if (iconePerfil) {
        iconePerfil.style.cursor = "pointer";
        iconePerfil.style.position = "relative";
        iconePerfil.style.zIndex = "99999";
        iconePerfil.addEventListener("click", function (e) {
            e.preventDefault();
            window.abrirPainelConta();
        });
    }

    atualizarAvatarTopo();
});
document.addEventListener("DOMContentLoaded", function () {
    const menuLinks = document.querySelector(".menu-links");
    if (menuLinks) {
        const linkGibis = menuLinks.querySelector('a[href*="gibis.html"]');
        const linkCadastro = menuLinks.querySelector('a[href*="cadastro.html"]');
        if (linkGibis && linkCadastro && !menuLinks.querySelector(".separador-gibis-cadastro")) {
            const risquinho = document.createElement("span");
            risquinho.className = "separador-gibis-cadastro";
            risquinho.style.cssText = "display:inline-block; width:1.5px; height:22px; background:rgba(88, 166, 255, 0.55); margin:0 6px; vertical-align:middle;";
            menuLinks.insertBefore(risquinho, linkCadastro);
        }
    }
});

document.addEventListener("pointerdown", function (e) {
    const coresEstrelas = ["#ffd700", "#ffea00", "#00f2fe", "#58a6ff", "#ffffff"];
    for (let i = 0; i < 12; i++) {
        const estrela = document.createElement("span");
        const cor = coresEstrelas[Math.floor(Math.random() * coresEstrelas.length)];
        const tamanho = Math.random() * 6 + 4;
        const angulo = (Math.PI * 2 * i) / 12 + (Math.random() * 0.4);
        const distancia = Math.random() * 50 + 22;

        estrela.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${cor};
            border-radius: 50%;
            box-shadow: 0 0 10px ${cor}, 0 0 18px ${cor};
            pointer-events: none;
            z-index: 2147483647;
            transform: translate(-50%, -50%);
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
        `;

        document.body.appendChild(estrela);

        requestAnimationFrame(() => {
            const destX = Math.cos(angulo) * distancia;
            const destY = Math.sin(angulo) * distancia;
            estrela.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0.15)`;
            estrela.style.opacity = "0";
        });

        setTimeout(() => estrela.remove(), 650);
    }
}, true);
