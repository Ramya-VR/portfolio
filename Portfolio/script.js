/* --- TIMELINE HUD CONTROL HANDLERS --- */
const navButtons = document.querySelectorAll('.nav-btn');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* --- SECTION BY SECTION INTERSECTION OBSERVER --- */
const sceneElements = document.querySelectorAll('.scene');
let activeTimers = { skills: null };

const observerOptions = {
    root: null,
    threshold: 0.3
};

const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const targetId = entry.target.id;
        
        if (entry.isIntersecting) {
            entry.target.classList.add('visible-now');
            
            // Update navigation HUD highlighting
            navButtons.forEach(btn => {
                if (btn.getAttribute('data-target') === targetId) {
                    btn.classList.add('active-nav');
                } else {
                    btn.classList.remove('active-nav');
                }
            });

            // Manage individual section animations dynamically on scroll entrance
            if (targetId === 'scene-skills') {
                executeSkillsWheelRotation();
            }
        } else {
            entry.target.classList.remove('visible-now');
            if (targetId === 'scene-skills') clearInterval(activeTimers.skills);
        }
    });
}, observerOptions);

sceneElements.forEach(scene => sceneObserver.observe(scene));

/* --- ENGINE COMPONENT: SKILLS ECOSYSTEM WHEEL --- */
const skillsData = [
    { name: "WordPress Engineering", short: "WP" },
    { name: "Front-End Development", short: "FE" },
    { name: "WooCommerce Architecture", short: "WC" },
    { name: "Elementor Pro", short: "El" },
    { name: "Java Frameworks", short: "Jv" },
    { name: "MySQL Databasing", short: "Sq" }
];

const wheel = document.querySelector('.skills-right-wheel');
const label = document.getElementById('skill-label');

function constructSkillsWheel() {
    const radius = 160;
    const absoluteCount = skillsData.length;

    skillsData.forEach((data, index) => {
        const stepAngle = (index / absoluteCount) * 2 * Math.PI;
        const computedX = Math.round(radius * Math.cos(stepAngle));
        const computedY = Math.round(radius * Math.sin(stepAngle));

        const badgeNode = document.createElement('div');
        badgeNode.className = 'skill-badge';
        badgeNode.innerText = data.short;
        badgeNode.style.left = `calc(50% + ${computedX}px - 40px)`;
        badgeNode.style.top = `calc(50% + ${computedY}px - 40px)`;
        badgeNode.setAttribute('data-full-title', data.name);
        wheel.appendChild(badgeNode);
    });
}

function executeSkillsWheelRotation() {
    clearInterval(activeTimers.skills);
    const targets = document.querySelectorAll('.skill-badge');
    let rotationCursor = 0;

    const cycleNextSkill = () => {
        targets.forEach(node => node.classList.remove('active-badge'));
        if (targets[rotationCursor]) {
            targets[rotationCursor].classList.add('active-badge');
            label.innerText = targets[rotationCursor].getAttribute('data-full-title');
        }
        rotationCursor = (rotationCursor + 1) % targets.length;
    };

    cycleNextSkill();
    activeTimers.skills = setInterval(cycleNextSkill, 1200);
}

/* --- INITIALIZATION HOOK --- */
window.onload = () => {
    constructSkillsWheel();
};