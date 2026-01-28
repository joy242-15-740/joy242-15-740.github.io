document.addEventListener('DOMContentLoaded', () => {
    // Subtle interactive background effect
    const container = document.querySelector('.container');
    const circles = document.querySelectorAll('.blur-circle');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;

        circles.forEach((circle, index) => {
            const speed = (index + 1) * 20;
            const x = (window.innerWidth - e.pageX * speed) / 100;
            const y = (window.innerHeight - e.pageY * speed) / 100;

            circle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    console.log("Portfolio initialized. Stay tuned.");
});