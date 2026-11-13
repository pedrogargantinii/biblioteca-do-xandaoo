document.addEventListener("click", function (e) {
    const coresBrilho = ["#ffd700", "#00f2fe", "#58a6ff", "#00ff88", "#ffffff"];
    const quantidadeParticulas = 10;

    for (let i = 0; i < quantidadeParticulas; i++) {
        const particula = document.createElement("span");
        const cor = coresBrilho[Math.floor(Math.random() * coresBrilho.length)];
        const tamanho = Math.random() * 6 + 4;
        const angulo = (Math.PI * 2 * i) / quantidadeParticulas + (Math.random() * 0.4);
        const distancia = Math.random() * 45 + 20;

        particula.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: ${tamanho}px;
            height: ${tamanho}px;
            background: ${cor};
            border-radius: 50%;
            box-shadow: 0 0 8px ${cor}, 0 0 14px ${cor};
            pointer-events: none;
            z-index: 2147483647;
            transform: translate(-50%, -50%);
            transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.65s ease;
        `;

        document.body.appendChild(particula);

        requestAnimationFrame(() => {
            const destX = Math.cos(angulo) * distancia;
            const destY = Math.sin(angulo) * distancia;
            particula.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(0.2)`;
            particula.style.opacity = "0";
        });

        setTimeout(() => {
            particula.remove();
        }, 680);
    }
});
