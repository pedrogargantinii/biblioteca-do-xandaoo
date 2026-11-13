document.addEventListener("DOMContentLoaded", function () {
    const secaoComentarios = document.querySelector(".secao-comentarios-dinamica");
    const formComentario = document.querySelector(".formulario-comentario");
    const tagTituloLivro = document.querySelector(".container-interno-livro h2");

    if (!secaoComentarios || !formComentario) return;

    const tituloLivro = tagTituloLivro ? tagTituloLivro.textContent.trim() : "Geral";
    const chaveStorage = "comentarios_" + tituloLivro;

    let listaComentarios = JSON.parse(localStorage.getItem(chaveStorage));

    if (!listaComentarios || listaComentarios.length === 0) {
        listaComentarios = [
            {
                id: 1,
                autor: "Lucas Mendes (3º Técnico)",
                nota: "★★★★★ - Excelente",
                texto: "Leitura obrigatória! Peguei emprestado na semana passada e devorei em dois dias. A conservação do exemplar da biblioteca está impecável.",
                likes: 14,
                curtido: false,
                respostas: [
                    { autor: "Prof. Darci", texto: "Fico muito feliz que tenha gostado, Lucas! Excelente indicação para a turma." }
                ]
            },
            {
                id: 2,
                autor: "Mariana Silva (2º Ano B)",
                nota: "★★★★★ - Excelente",
                texto: "Muito bom mesmo, me ajudou demais a entender a matéria e ainda me prendeu do começo ao fim.",
                likes: 9,
                curtido: false,
                respostas: []
            },
            {
                id: 3,
                autor: "Gabriel Costa (1º Técnico)",
                nota: "★★★★☆ - Muito Bom",
                texto: "Recomendo muito para quem quer passar o tempo no intervalo ou aprofundar os conhecimentos. Vale cada página.",
                likes: 6,
                curtido: false,
                respostas: []
            },
            {
                id: 4,
                autor: "Beatriz Oliveira (3º Ano A)",
                nota: "★★★★★ - Excelente",
                texto: "Um dos melhores acervos que já li aqui na escola. Já vou reservar o próximo volume!",
                likes: 11,
                curtido: false,
                respostas: []
            }
        ];
        localStorage.setItem(chaveStorage, JSON.stringify(listaComentarios));
    }

    let containerLista = document.getElementById("listaComentariosRenderizados");
    if (!containerLista) {
        containerLista = document.createElement("div");
        containerLista.id = "listaComentariosRenderizados";
        secaoComentarios.insertBefore(containerLista, formComentario);
    }

    function salvarERenderizar() {
        localStorage.setItem(chaveStorage, JSON.stringify(listaComentarios));
        renderizarComentarios();
    }

    function renderizarComentarios() {
        containerLista.innerHTML = "";

        listaComentarios.forEach((coment, index) => {
            const box = document.createElement("div");
            box.className = "box-comentario";
            box.style.marginBottom = "18px";

            const corLike = coment.curtido ? "#2f81f7" : "#c9d1d9";
            const bordaLike = coment.curtido ? "1px solid #2f81f7" : "1px solid #30363d";

            let htmlRespostas = "";
            if (coment.respostas && coment.respostas.length > 0) {
                coment.respostas.forEach(resp => {
                    htmlRespostas += `
                        <div class="box-resposta" style="margin-top: 10px; margin-left: 25px; padding: 10px; background: rgba(47, 129, 247, 0.08); border-left: 2px solid #2f81f7; border-radius: 6px;">
                            <strong style="color: #58a6ff; font-size: 13px;">↳ ${resp.autor}:</strong>
                            <p style="font-size: 13px; margin-top: 4px; color: #e6edf3;">${resp.texto}</p>
                        </div>
                    `;
                });
            }

            box.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: #ffffff; font-size: 15px;">👤 ${coment.autor}</strong>
                    <span style="color: #f1c40f; font-size: 13px; font-weight: bold;">${coment.nota || "★★★★★ - Excelente"}</span>
                </div>
                <p style="color: #e6edf3; font-size: 14px; line-height: 1.5; margin-bottom: 12px;">${coment.texto}</p>
                
                <div style="display: flex; gap: 10px; align-items: center;">
                    <button type="button" class="btn-curtir" data-index="${index}" style="padding: 5px 12px; font-size: 12px; color: ${corLike}; border: ${bordaLike};">
                        👍 Curtir (${coment.likes})
                    </button>
                    <button type="button" class="btn-abrir-resposta" data-index="${index}" style="padding: 5px 12px; font-size: 12px;">
                        💬 Responder
                    </button>
                </div>

                <div class="area-input-resposta" id="replyBox-${index}" style="display: none; margin-top: 12px; margin-left: 25px;">
                    <input type="text" id="inputReply-${index}" placeholder="Escreva sua resposta..." style="background: rgba(13,17,23,0.9); border: 1px solid #2f81f7; color: #fff; padding: 8px 12px; border-radius: 6px; width: 70%; font-size: 13px;">
                    <button type="button" class="btn-enviar-resposta" data-index="${index}" style="padding: 8px 14px; font-size: 12px; margin-left: 6px;">Enviar</button>
                </div>

                ${htmlRespostas}
            `;

            containerLista.appendChild(box);
        });

        document.querySelectorAll(".btn-curtir").forEach(btn => {
            btn.addEventListener("click", function () {
                const idx = this.getAttribute("data-index");
                if (listaComentarios[idx].curtido) {
                    listaComentarios[idx].likes -= 1;
                    listaComentarios[idx].curtido = false;
                } else {
                    listaComentarios[idx].likes += 1;
                    listaComentarios[idx].curtido = true;
                }
                salvarERenderizar();
            });
        });

        document.querySelectorAll(".btn-abrir-resposta").forEach(btn => {
            btn.addEventListener("click", function () {
                const idx = this.getAttribute("data-index");
                const replyDiv = document.getElementById(`replyBox-${idx}`);
                replyDiv.style.display = replyDiv.style.display === "none" ? "block" : "none";
            });
        });

        document.querySelectorAll(".btn-enviar-resposta").forEach(btn => {
            btn.addEventListener("click", function () {
                const idx = this.getAttribute("data-index");
                const inputField = document.getElementById(`inputReply-${idx}`);
                const textoResp = inputField.value.trim();

                if (textoResp !== "") {
                    const usuario = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
                    const nomeAutor = usuario ? usuario.email.split("@")[0] : "Visitante";

                    listaComentarios[idx].respostas.push({
                        autor: nomeAutor,
                        texto: textoResp
                    });
                    salvarERenderizar();
                }
            });
        });
    }

    formComentario.addEventListener("submit", function (e) {
        e.preventDefault();
        const textarea = formComentario.querySelector("textarea");
        const selectNota = formComentario.querySelector("select");

        const texto = textarea ? textarea.value.trim() : "";
        const nota = selectNota ? selectNota.value : "★★★★★ - Excelente";

        if (texto !== "") {
            const usuario = JSON.parse(localStorage.getItem("usuarioRedeBiblioteca"));
            const nomeAutor = usuario ? `${usuario.email.split("@")[0]} (${usuario.provedor})` : "Aluno da Biblioteca";

            listaComentarios.unshift({
                id: Date.now(),
                autor: nomeAutor,
                nota: nota,
                texto: texto,
                likes: 1,
                curtido: true,
                respostas: []
            });

            textarea.value = "";
            salvarERenderizar();
        }
    });

    renderizarComentarios();
});
