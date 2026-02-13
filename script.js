const DATABASE_PATHS = {
    work: 'database/workdb.json',
    skills: 'database/skilldb.json',
    experience: 'database/experiencedb.json',
    blog: 'database/blogdb.json'
};

/**
 * Fetch and parse JSON data
 * @param {string} url 
 * @returns {Promise<any>}
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (e) {
        console.error(`Could not load data from ${url}:`, e);
        return null;
    }
}

/**
 * Render Project Cards
 */
async function renderProjects() {
    const container = document.getElementById('projects-grid');
    const db = await fetchData(DATABASE_PATHS.work);
    
    if (!db || !db.data) {
        container.innerHTML = '<p class="error">System Error: Failed to load project database.</p>';
        return;
    }

    // Only show featured projects or first 6
    const projects = db.data.filter(p => p.featured).slice(0, 6);
    
    container.innerHTML = projects.map(project => `
        <article class="project-card">
            <div class="project-img" style="background-image: url('${project.thumbnail.replace('../../', '')}');"></div>
            <div class="project-info">
                <span class="project-category">${project.category}</span>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="project-tech">
                    ${project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.liveLink ? `<a href="${project.liveLink}" target="_blank" rel="noopener"><span>_LIVE</span></a>` : ''}
                    ${project.repoLink ? `<a href="${project.repoLink}" target="_blank" rel="noopener"><span>_REPO</span></a>` : ''}
                </div>
            </div>
        </article>
    `).join('');
}

/**
 * Render Skills
 */
async function renderSkills() {
    const container = document.getElementById('skills-container');
    const db = await fetchData(DATABASE_PATHS.skills);
    
    if (!db || !db.data) return;

    // Filter featured skills
    const skills = db.data.filter(s => s.featured);
    
    container.innerHTML = skills.map(skill => `
        <div class="skill-card">
            ${skill.icon ? `<div class="skill-icon"><img src="${skill.icon}" alt="${skill.name}"></div>` : ''}
            <div class="skill-name">${skill.name}</div>
            <div class="skill-progress-bg" style="flex-grow: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; margin: 0 1rem;">
                <div class="skill-progress-fill" style="width: ${skill.proficiency}%; height: 100%; background: var(--secondary);"></div>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary);">${skill.proficiency}%</span>
        </div>
    `).join('');
}

/**
 * Render Experience
 */
async function renderExperience() {
    const container = document.getElementById('experience-timeline');
    const db = await fetchData(DATABASE_PATHS.experience);
    
    if (!db || !db.data) return;

    container.innerHTML = db.data.map(exp => `
        <div class="timeline-item">
            <div class="timeline-date">${exp.startDate} - ${exp.endDate}</div>
            <div class="timeline-content">
                <h3 class="timeline-role">${exp.role}</h3>
                <div class="timeline-company">
                    ${exp.url ? `<a href="${exp.url}" target="_blank" rel="noopener">${exp.company}</a>` : exp.company} // ${exp.location}
                </div>
                <p class="project-desc">${exp.description}</p>
                <div class="project-tech">
                    ${exp.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Render Blogs
 */
async function renderBlogs() {
    const container = document.getElementById('blogs-grid');
    const db = await fetchData(DATABASE_PATHS.blog);
    
    if (!db || !db.data) return;

    // Show latest 3 blogs
    const blogs = db.data.slice(0, 3);
    
    container.innerHTML = blogs.map(blog => `
        <article class="blog-card">
            <div class="blog-body">
                <div class="blog-date">${new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                <h3 class="blog-title">${blog.title}</h3>
                <p class="project-desc" style="font-size: 0.85rem;">${blog.excerpt}</p>
                <a href="${blog.pageLink}" class="blog-link">READ_MORE_</a>
            </div>
        </article>
    `).join('');
}

/**
 * Initialize Portfolio
 */
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderSkills();
    renderExperience();
    renderBlogs();

    // Scroll revealing with Intersection Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('reveal');
        observer.observe(section);
    });

    // Update System Status in Footer
    const statusText = document.querySelector('.status-online');
    if (statusText) {
        const updateStatus = () => {
            const now = new Date();
            statusText.textContent = `ONLINE [${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}]`;
        };
        updateStatus();
        setInterval(updateStatus, 1000);
    }

    console.log("Portfolio Initialized. System Status: OPTIMAL");
});