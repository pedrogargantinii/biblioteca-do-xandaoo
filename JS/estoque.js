document.addEventListener("DOMContentLoaded", function () {
    let estoqueGlobal = JSON.parse(localStorage.getItem("estoqueBiblioteca")) || {};

    const catalogoCompleto48 = [
        { titulo: "O Guia do Mochileiro das Galáxias", categoria: "Ficção Científica", link: "livros/livro-mochileiro.html" },
        { titulo: "Duna", categoria: "Ficção Científica", link: "livros/livro-duna.html" },
        { titulo: "Neuromancer", categoria: "Ficção Científica", link: "livros/livro-neuromancer.html" },
        { titulo: "Fundação", categoria: "Ficção Científica", link: "livros/livro-fundacao.html" },
        { titulo: "1984", categoria: "Ficção Científica", link: "livros/livro-1984.html" },
        { titulo: "Admirável Mundo Novo", categoria: "Ficção Científica", link: "livros/livro-admiravel.html" },
        { titulo: "Fahrenheit 451", categoria: "Ficção Científica", link: "livros/livro-fahrenheit.html" },
        { titulo: "Eu, Robô", categoria: "Ficção Científica", link: "livros/livro-eurobo.html" },
        { titulo: "Frankenstein", categoria: "Ficção Científica", link: "livros/livro-frankenstein.html" },
        { titulo: "Cosmos", categoria: "Ciências & Universo", link: "livros/livro-cosmos.html" },
        { titulo: "Uma Breve História do Tempo", categoria: "Ciências & Universo", link: "livros/livro-tempo.html" },
        { titulo: "A Origem das Espécies", categoria: "Ciências & Universo", link: "livros/livro-especies.html" },
        { titulo: "O Gene", categoria: "Ciências & Universo", link: "livros/livro-gene.html" },
        { titulo: "Bilionários por Acaso", categoria: "Ciências & Tecnologia", link: "livros/livro-bilionarios.html" },
        { titulo: "O Capataz da Ciência", categoria: "Ciências & Universo", link: "livros/livro-capataz.html" },
        { titulo: "O Universo numa Casca de Noz", categoria: "Ciências & Universo", link: "livros/livro-noz.html" },
        { titulo: "O Mundo Assombrado pelos Demônios", categoria: "Ciências & Universo", link: "livros/livro-demonios.html" },
        { titulo: "Armas, Germes e Aço", categoria: "Ciências & História", link: "livros/livro-armas.html" },
        { titulo: "O Homem que Calculava", categoria: "Matemática & Lógica", link: "livros/livro-homem-calculava.html" },
        { titulo: "O Último Teorema de Fermat", categoria: "Matemática & Lógica", link: "livros/livro-fermat.html" },
        { titulo: "Algarismos: A História dos Números", categoria: "Matemática & Lógica", link: "livros/livro-algarismos.html" },
        { titulo: "Incríveis Desafios Matemáticos", categoria: "Matemática & Lógica", link: "livros/livro-desafios.html" },
        { titulo: "A Lógica da Pesquisa Científica", categoria: "Matemática & Lógica", link: "livros/livro-logica.html" },
        { titulo: "Os Elementos de Euclides", categoria: "Matemática & Lógica", link: "livros/livro-euclides.html" },
        { titulo: "Sapiens: Uma Breve História da Humanidade", categoria: "História & Humanas", link: "livros/livro-sapiens.html" },
        { titulo: "1822", categoria: "História & Humanas", link: "livros/livro-1822.html" },
        { titulo: "A Longa Viagem", categoria: "História & Humanas", link: "livros/livro-longa-viagem.html" },
        { titulo: "A Era das Revoluções", categoria: "História & Humanas", link: "livros/livro-revolucoes.html" },
        { titulo: "O Diário de Anne Frank", categoria: "História & Humanas", link: "livros/livro-anne-frank.html" },
        { titulo: "História da Riqueza do Homem", categoria: "História & Humanas", link: "livros/livro-riqueza.html" },
        { titulo: "Turma da Mônica: Coleção Clássica", categoria: "Gibis & Quadrinhos", link: "livros/gibi-monica-classica.html" },
        { titulo: "Tio Patinhas: O Dragão de Glasgow", categoria: "Gibis & Quadrinhos", link: "livros/gibi-tio-patinhas.html" },
        { titulo: "Pato Donald e Seus Sobrinhos", categoria: "Gibis & Quadrinhos", link: "livros/gibi-pato-donald.html" },
        { titulo: "Chico Bento em Quadrinhos", categoria: "Gibis & Quadrinhos", link: "livros/gibi-chico-bento.html" },
        { titulo: "Zé Carioca no Rio", categoria: "Gibis & Quadrinhos", link: "livros/gibi-ze-carioca.html" },
        { titulo: "Cascão Contra a Sujeira", categoria: "Gibis & Quadrinhos", link: "livros/gibi-cascao.html" },
        { titulo: "Mônica: Laços", categoria: "Gibis & Quadrinhos", link: "livros/gibi-monica-lacos.html" },
        { titulo: "Cebolinha: Recuperação", categoria: "Gibis & Quadrinhos", link: "livros/gibi-cebolinha.html" },
        { titulo: "Magali: Melancia", categoria: "Gibis & Quadrinhos", link: "livros/gibi-magali.html" },
        { titulo: "Batman: O Cavaleiro das Trevas", categoria: "Super-Heróis & HQs", link: "livros/livro-batman-cavaleiro.html" },
        { titulo: "Homem-Aranha: De Volta ao Lar", categoria: "Super-Heróis & HQs", link: "livros/livro-aranha-lar.html" },
        { titulo: "Liga da Justiça: Torre de Babel", categoria: "Super-Heróis & HQs", link: "livros/livro-liga-babel.html" },
        { titulo: "Liga da Justiça: Origem", categoria: "Super-Heróis & HQs", link: "livros/livro-liga-origem.html" },
        { titulo: "Liga da Justiça: Trono de Atlântida", categoria: "Super-Heróis & HQs", link: "livros/livro-liga-atlantida.html" },
        { titulo: "Liga da Justiça: O Prego", categoria: "Super-Heróis & HQs", link: "livros/livro-liga-prego.html" },
        { titulo: "Batman Absoluto", categoria: "Super-Heróis & HQs", link: "livros/livro-batman-absoluto.html" },
        { titulo: "Homem-Aranha Contra Venom", categoria: "Super-Heróis & HQs", link: "livros/livro-aranha-venom.html" },
        { titulo: "Guerra Civil: O Evento Marvel", categoria: "Super-Heróis & HQs", link: "livros/livro-guerra-civil.html" }
    ];

    const livrosEmAlta = [
        "Duna", "1984", "O Guia do Mochileiro das Galáxias", "Cosmos",
        "O Homem que Calculava", "Sapiens: Uma Breve História da Humanidade",
        "Batman: O Cavaleiro das Trevas", "Homem-Aranha: De Volta ao Lar", "Turma da Mônica: Coleção Clássica"
    ];

    const notasVariadas = ["4.6", "4.7", "4.8", "4.9", "5.0"];
    const blocosLivros = document.querySelectorAll(".bloco-livro");

    blocosLivros.forEach((bloco, indexBloco) => {
        bloco.style.position = "relative";
        const tituloEl = bloco.querySelector("h4");
        const paragrafoEstoque = bloco.querySelector("p");

        if (tituloEl && paragrafoEstoque) {
            const titulo = tituloEl.textContent.trim();
            if (estoqueGlobal[titulo] === undefined) {
                estoqueGlobal[titulo] = (indexBloco % 5) + 2;
            }

            const qtd = estoqueGlobal[titulo];
            bloco.dataset.disponivel = qtd > 0 ? "sim" : "nao";
            bloco.dataset.emAlta = livrosEmAlta.includes(titulo) ? "sim" : "nao";

            const seloAntigo = bloco.querySelector(".selo-destaque-livro");
            if (seloAntigo) seloAntigo.remove();

            const selo = document.createElement("span");
            selo.className = "selo-destaque-livro";
            const notaCalculada = notasVariadas[(titulo.length + indexBloco) % notasVariadas.length];

            if (qtd === 0) {
                selo.textContent = "🚫 Esgotado";
                selo.style.cssText = "position:absolute; top:8px; right:8px; background:rgba(218,54,51,0.92); color:#fff; font-size:10px; font-weight:bold; padding:3px 8px; border-radius:12px; z-index:5;";
            } else if (livrosEmAlta.includes(titulo)) {
                selo.textContent = `🔥 Em Alta • ★ ${notaCalculada}`;
                selo.style.cssText = "position:absolute; top:8px; right:8px; background:linear-gradient(135deg, #ff6b00, #ff0055); color:#fff; font-size:10px; font-weight:bold; padding:3px 8px; border-radius:12px; z-index:5; box-shadow:0 2px 8px rgba(255,0,85,0.5);";
            } else {
                selo.textContent = `★ ${notaCalculada}`;
                selo.style.cssText = "position:absolute; top:8px; right:8px; background:rgba(13,17,23,0.9); border:1px solid #ffd700; color:#ffd700; font-size:10px; font-weight:bold; padding:2px 8px; border-radius:12px; z-index:5;";
            }
            bloco.appendChild(selo);

            if (qtd > 0) {
                paragrafoEstoque.textContent = `Disponíveis: ${qtd} un.`;
                paragrafoEstoque.style.color = "#00ff88";
            } else {
                paragrafoEstoque.textContent = "Esgotado no momento";
                paragrafoEstoque.style.color = "#ff4444";
            }
        }
    });

    localStorage.setItem("estoqueBiblioteca", JSON.stringify(estoqueGlobal));
    const containerBusca = document.querySelector(".container-busca");
    if (containerBusca && !document.getElementById("heroDestaqueTopo")) {
        const paginaUrl = window.location.pathname;
        let destaqueInfo = {
            selo: "🏆 DESTAQUE DA SEMANA • FICÇÃO & CIÊNCIAS",
            tituloAlvo: "Duna",
            tituloExibicao: "Duna — Frank Herbert",
            desc: "A obra-prima absoluta da ficção científica moderna. Explore o planeta desértico de Arrakis em uma edição especial disponível no acervo da escola."
        };

        if (paginaUrl.includes("exatas_humanas.html")) {
            destaqueInfo = {
                selo: "🏆 DESTAQUE DA SEMANA • EXATAS & HUMANAS",
                tituloAlvo: "O Homem que Calculava",
                tituloExibicao: "O Homem que Calculava — Malba Tahan",
                desc: "Aventuras matemáticas fascinantes no Oriente Médio que transformam enigmas numéricos em histórias inesquecíveis."
            };
        } else if (paginaUrl.includes("gibis.html")) {
            destaqueInfo = {
                selo: "🏆 DESTAQUE DA SEMANA • QUADRINHOS & HQs",
                tituloAlvo: "Batman",
                tituloExibicao: "Batman: O Cavaleiro das Trevas — Frank Miller",
                desc: "A graphic novel revolucionária que redefiniu o Homem-Morcego em Gotham City. Um dos itens mais disputados pelos alunos."
            };
        }

        let capaRealHero = "img/logo professor.png";
        let linkRealHero = "livros/livro-duna.html";
        blocosLivros.forEach(b => {
            const h4 = b.querySelector("h4");
            const img = b.querySelector("img");
            const a = b.querySelector("a");
            if (h4 && h4.textContent.toLowerCase().includes(destaqueInfo.tituloAlvo.toLowerCase())) {
                if (img) capaRealHero = img.getAttribute("src");
                if (a) linkRealHero = a.getAttribute("href");
            }
        });

        const heroEl = document.createElement("div");
        heroEl.id = "heroDestaqueTopo";
        heroEl.className = "hero-destaque-plataforma";
        heroEl.innerHTML = `
            <div class="hero-destaque-info">
                <span class="selo-hero-topo">${destaqueInfo.selo}</span>
                <h1>${destaqueInfo.tituloExibicao}</h1>
                <p>${destaqueInfo.desc}</p>
                <div class="hero-botoes-acao">
                    <a href="${linkRealHero}" class="btn-hero-principal">📖 Ver Detalhes & Reservar</a>
                    <button type="button" id="btnLivroSurpresaHero" class="btn-hero-surpresa">🎲 Me Indique um Livro</button>
                </div>
            </div>
            <img src="${capaRealHero}" alt="${destaqueInfo.tituloExibicao}" class="hero-capa-3d">
        `;

        const faixaMetricas = document.createElement("div");
        faixaMetricas.className = "faixa-metricas-escola";
        faixaMetricas.innerHTML = `
            <div class="item-metrica"><strong>48 Obras</strong><span>Catalogadas em 6 Gêneros</span></div>
            <div class="item-metrica"><strong>1.748 Votos</strong><span>Participação Ativa dos Alunos</span></div>
            <div class="item-metrica"><strong>100% Digital</strong><span>Reserva via QR Code & Carteirinha</span></div>
            <div class="item-metrica"><strong>Pinhais - PR</strong><span>Colégio Humberto Castelo Branco</span></div>
        `;

        containerBusca.parentNode.insertBefore(heroEl, containerBusca);
        containerBusca.parentNode.insertBefore(faixaMetricas, containerBusca);

        document.getElementById("btnLivroSurpresaHero").addEventListener("click", function () {
            const sorteado = catalogoCompleto48[Math.floor(Math.random() * catalogoCompleto48.length)];
            alert(`🎲 ROLETA DA BIBLIOTECA!\n\nO livro sorteado para você hoje entre as 48 obras é:\n📖 "${sorteado.titulo}" (${sorteado.categoria})\n\nAbrindo a página do livro agora...`);
            window.location.href = sorteado.link;
        });

        containerBusca.style.position = "relative";
        containerBusca.style.maxWidth = "780px";
        containerBusca.style.margin = "0 auto 28px auto";
        containerBusca.classList.add("barra-busca-futurista-box");

        const inputPesquisa = containerBusca.querySelector(".input-busca");
        if (inputPesquisa) {
            inputPesquisa.placeholder = "✨ Busque por título, autor ou tema nas 48 obras (Ex: Duna, Batman, Fermat...)";
            inputPesquisa.style.cssText = "width:100%; padding:14px 44px 14px 20px; border-radius:14px; border:1px solid rgba(255,255,255,0.18); background:rgba(22,27,34,0.95); color:#ffffff; font-size:15px; outline:none; box-sizing:border-box; transition:border-color 0.2s;";

            const btnLimparBusca = document.createElement("button");
            btnLimparBusca.type = "button";
            btnLimparBusca.innerHTML = "✖";
            btnLimparBusca.title = "Limpar pesquisa";
            btnLimparBusca.style.cssText = "display:none; position:absolute; right:28px; top:26px; background:#30363d; border:none; color:#fff; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:12px; font-weight:bold;";
            containerBusca.appendChild(btnLimparBusca);

            const tagsRapidasDiv = document.createElement("div");
            tagsRapidasDiv.style.cssText = "display:flex; align-items:center; justify-content:center; gap:8px; flex-wrap:wrap; margin-top:10px; font-size:11px; color:#8b949e;";
            tagsRapidasDiv.innerHTML = `<span>Buscas rápidas:</span>`;

            ["Duna", "Batman", "Mônica", "Matemática", "História", "Cosmos"].forEach(tag => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.textContent = "#" + tag;
                chip.style.cssText = "background:rgba(47,129,247,0.15); border:1px solid rgba(47,129,247,0.4); color:#58a6ff; padding:3px 10px; border-radius:12px; font-size:11px; cursor:pointer; font-weight:600;";
                chip.addEventListener("click", () => {
                    inputPesquisa.value = tag;
                    inputPesquisa.dispatchEvent(new Event("input"));
                });
                tagsRapidasDiv.appendChild(chip);
            });
            containerBusca.appendChild(tagsRapidasDiv);
            const painelResultadosGlobais = document.createElement("div");
            painelResultadosGlobais.id = "painelResultadosGlobais";
            painelResultadosGlobais.style.cssText = "display:none; position:absolute; top:72px; left:14px; right:14px; background:#0d1117; border:2px solid #00ff88; border-radius:16px; max-height:340px; overflow-y:auto; z-index:999999; box-shadow:0 18px 45px rgba(0,0,0,0.96); padding:10px; text-align:left;";
            containerBusca.appendChild(painelResultadosGlobais);

            btnLimparBusca.addEventListener("click", () => {
                inputPesquisa.value = "";
                inputPesquisa.dispatchEvent(new Event("input"));
                inputPesquisa.focus();
            });

            inputPesquisa.addEventListener("input", function () {
                const termo = this.value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                btnLimparBusca.style.display = termo.length > 0 ? "block" : "none";

                blocosLivros.forEach(bloco => {
                    const titulo = bloco.querySelector("h4").textContent.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    bloco.style.setProperty("display", titulo.includes(termo) ? "flex" : "none", "important");
                });

                if (termo.length === 0) {
                    painelResultadosGlobais.style.display = "none";
                    return;
                }

                const encontrados = catalogoCompleto48.filter(item =>
                    item.titulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termo) ||
                    item.categoria.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(termo)
                );

                if (encontrados.length === 0) {
                    painelResultadosGlobais.innerHTML = `<div style="padding:14px; color:#8b949e; text-align:center; font-size:13px;">Nenhuma obra encontrada com "${this.value}". <a href="votacao.html" style="color:#00ff88; font-weight:bold;">Sugira este livro na votação!</a></div>`;
                } else {
                    painelResultadosGlobais.innerHTML = `<div style="font-size:11px; color:#00ff88; font-weight:bold; padding:4px 10px 8px 10px; border-bottom:1px solid #30363d;">⚡ ${encontrados.length} resultado(s) encontrado(s) nas 48 obras:</div>` +
                        encontrados.map(livro => {
                            const qtdDisp = estoqueGlobal[livro.titulo] !== undefined ? estoqueGlobal[livro.titulo] : 4;
                            const badgeDisp = qtdDisp > 0 ? `<span style="color:#00ff88; font-size:11px;">✅ ${qtdDisp} un.</span>` : `<span style="color:#ff6b6b; font-size:11px;">🚫 Esgotado</span>`;
                            return `
                                <a href="${livro.link}" style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; border-radius:8px; text-decoration:none; color:#ffffff; border-bottom:1px solid rgba(255,255,255,0.06);" onmouseover="this.style.background='#161b22'" onmouseout="this.style.background='transparent'">
                                    <div>
                                        <strong style="font-size:14px; display:block;">📖 ${livro.titulo}</strong>
                                        <span style="font-size:11px; color:#a371f7;">${livro.categoria}</span>
                                    </div>
                                    <div style="text-align:right;">
                                        ${badgeDisp}
                                        <span style="display:block; font-size:11px; color:#58a6ff; font-weight:bold;">Abrir ➔</span>
                                    </div>
                                </a>
                            `;
                        }).join("");
                }
                painelResultadosGlobais.style.display = "block";
            });

            document.addEventListener("click", function (e) {
                if (!containerBusca.contains(e.target)) {
                    painelResultadosGlobais.style.display = "none";
                }
            });
        }

        const barraFiltros = document.createElement("div");
        barraFiltros.id = "barraFiltrosRapidos";
        barraFiltros.style.cssText = "display:flex; justify-content:center; gap:10px; flex-wrap:wrap; margin-top:14px;";

        const opcoesFiltro = [
            { id: "todos", texto: "📚 Todos os Livros" },
            { id: "disponiveis", texto: "✅ Disponíveis Agora" },
            { id: "em-alta", texto: "🔥 Mais Lidos na Escola" }
        ];

        opcoesFiltro.forEach((op, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = op.texto;
            btn.dataset.filtro = op.id;
            btn.style.cssText = idx === 0
                ? "padding:8px 16px; border-radius:20px; border:1px solid #2f81f7; background:#2f81f7; color:#fff; font-size:12px; font-weight:bold; cursor:pointer; transition:all 0.2s;"
                : "padding:8px 16px; border-radius:20px; border:1px solid rgba(255,255,255,0.2); background:rgba(13,17,23,0.85); color:#c9d1d9; font-size:12px; font-weight:bold; cursor:pointer; transition:all 0.2s;";

            btn.addEventListener("click", function () {
                barraFiltros.querySelectorAll("button").forEach(b => {
                    b.style.background = "rgba(13,17,23,0.85)";
                    b.style.borderColor = "rgba(255,255,255,0.2)";
                    b.style.color = "#c9d1d9";
                });
                this.style.background = "#2f81f7";
                this.style.borderColor = "#2f81f7";
                this.style.color = "#ffffff";

                const tipo = this.dataset.filtro;
                blocosLivros.forEach(bloco => {
                    if (tipo === "todos") {
                        bloco.style.setProperty("display", "flex", "important");
                    } else if (tipo === "disponiveis") {
                        bloco.style.setProperty("display", bloco.dataset.disponivel === "sim" ? "flex" : "none", "important");
                    } else if (tipo === "em-alta") {
                        bloco.style.setProperty("display", bloco.dataset.emAlta === "sim" ? "flex" : "none", "important");
                    }
                });

                document.querySelectorAll("section").forEach(sec => {
                    const livrosNaSecao = Array.from(sec.querySelectorAll(".bloco-livro"));
                    if (livrosNaSecao.length > 0) {
                        const temVisivel = livrosNaSecao.some(l => l.style.display !== "none");
                        sec.style.display = temVisivel ? "block" : "none";
                    }
                });
            });
            barraFiltros.appendChild(btn);
        });
        containerBusca.appendChild(barraFiltros);
    }

    const menuLinks = document.querySelector(".menu-links");
    if (menuLinks && !menuLinks.querySelector('a[href*="votacao.html"]')) {
        const linkVotacao = document.createElement("a");
        linkVotacao.href = "votacao.html";
        linkVotacao.textContent = "🗳️ Votação";
        linkVotacao.style.color = "#00ff88";

        const linkPrimeiro = menuLinks.querySelector('a[href*="index.html"]');
        if (linkPrimeiro) {
            menuLinks.insertBefore(linkVotacao, linkPrimeiro);
            const corteVotacao = document.createElement("span");
            corteVotacao.className = "divisor-menu-futurista";
            corteVotacao.style.cssText = "display:inline-block; width:2px; height:26px; background:linear-gradient(180deg, transparent, #a371f7, #2f81f7, transparent); margin:0 4px; box-shadow:0 0 8px #a371f7;";
            menuLinks.insertBefore(corteVotacao, linkPrimeiro);
        }
    }

    const bancoImagensAleatorias = [
        "img/banner-random-1.jpg", "img/banner-random-2.jpg", "img/banner-random-3.jpg",
        "img/banner-random-4.jpg", "img/banner-random-5.jpg"
    ];

    document.querySelectorAll(".grade-livros").forEach((grade, index) => {
        if (grade.parentElement.classList.contains("carrossel-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "carrossel-wrapper";
        wrapper.style.cssText = "position:relative; display:flex; align-items:center; width:100%;";
        grade.parentNode.insertBefore(wrapper, grade);
        wrapper.appendChild(grade);

        const btnEsquerda = document.createElement("button");
        btnEsquerda.type = "button";
        btnEsquerda.className = "seta-carrossel seta-esquerda";
        btnEsquerda.innerHTML = "❮";
        btnEsquerda.style.cssText = "position:absolute; left:5px; top:50%; transform:translateY(-50%); z-index:9999; width:46px; height:46px; border-radius:50%; background:#0d1117; border:2px solid #2f81f7; color:#ffffff; font-size:22px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(47,129,247,0.8);";

        const btnDireita = document.createElement("button");
        btnDireita.type = "button";
        btnDireita.className = "seta-carrossel seta-direita";
        btnDireita.innerHTML = "❯";
        btnDireita.style.cssText = "position:absolute; right:5px; top:50%; transform:translateY(-50%); z-index:9999; width:46px; height:46px; border-radius:50%; background:#0d1117; border:2px solid #2f81f7; color:#ffffff; font-size:22px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(47,129,247,0.8);";

        wrapper.appendChild(btnEsquerda);
        wrapper.appendChild(btnDireita);

        btnEsquerda.addEventListener("click", (e) => { e.preventDefault(); grade.scrollBy({ left: -650, behavior: "smooth" }); });
        btnDireita.addEventListener("click", (e) => { e.preventDefault(); grade.scrollBy({ left: 650, behavior: "smooth" }); });

        const secao = wrapper.closest("section");
        if (secao) {
            const imagemEscolhida = bancoImagensAleatorias[Math.floor(Math.random() * bancoImagensAleatorias.length)];
            const banner = document.createElement("div");
            banner.className = "banner-divisoria-promo";
            banner.style.cssText = "margin: 0 30px 25px 30px; padding: 20px 26px; border-radius: 16px; background: linear-gradient(135deg, rgba(13,17,23,0.88) 0%, rgba(47,129,247,0.25) 100%); border: 1px solid rgba(47,129,247,0.65); backdrop-filter: blur(8px); display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap; box-shadow: 0 8px 30px rgba(0,0,0,0.45);";

            banner.innerHTML = `
                <img src="${imagemEscolhida}" alt="Destaque Biblioteca" style="width:310px; height:165px; object-fit:cover; border-radius:12px; border:2px solid #2f81f7; background:#161b22; flex-shrink:0; box-shadow:0 6px 20px rgba(0,0,0,0.7);" onerror="this.src='img/logo professor.png'">
                <div style="flex:1; min-width:240px;">
                    <h3 style="color:#ffffff; font-size:20px; margin-bottom:8px; text-shadow:0 2px 5px rgba(0,0,0,0.9);">${index === 0 ? "🗳️ Qual livro você quer ver na biblioteca no próximo mês?" : "💡 Não encontrou o livro que procurava no acervo?"}</h3>
                    <p style="color:#c9d1d9; font-size:14px; margin:0; line-height:1.5;">${index === 0 ? "Mais de 1.748 votos registrados pelos alunos do Colégio Humberto Castelo Branco. Participe e deixe sua sugestão!" : "Acesse a arena de votação da escola, sugira novos títulos e veja os comentários da galera!"}</p>
                </div>
                <a href="votacao.html" style="background:#238636; color:#ffffff; text-decoration:none; padding:14px 24px; border-radius:8px; font-weight:bold; font-size:14px; border:1px solid #2ea043; white-space:nowrap;">${index === 0 ? "🔥 Votar nos Próximos Livros" : "🚀 Sugerir e Comentar Agora"}</a>
            `;
            secao.parentNode.insertBefore(banner, secao.nextSibling);
        }
    });
});
