export async function loadData() {
    const response = await fetch('./data.json');
    return await response.json();
}

export function renderExperience(data, container, reverseOrder = true) {
    container.innerHTML = '';
    const experienceList = reverseOrder ? [...data.experience].reverse() : data.experience;
    const jobMapping = reverseOrder ? [1, 2, 3] : [3, 2, 1];
    experienceList.forEach((job, index) => {
        const jobIndex = jobMapping[index];
        const jobElement = document.createElement('div');
        jobElement.className = 'experience-item';
        jobElement.innerHTML = `
            <div class="experience-header">
                <div>
                    <h3 class="job-title" data-i18n="experience.job${jobIndex}.title">${job.title}</h3>
                    <span class="company-name">${job.company}</span>
                </div>
                <span class="experience-date" ${jobIndex === 3 ? 'data-i18n="experience.job3.date"' : ''}>${job.date}</span>
            </div>
            <ul class="experience-description">
                ${job.duties.map((duty, dutyIndex) => `<li data-i18n="experience.job${jobIndex}.duty${dutyIndex + 1}">${duty}</li>`).join('')}
            </ul>
            <div class="tech-stack">
                ${job.techStack.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
            </div>
        `;
        container.appendChild(jobElement);
    });
}

export function renderSkills(data, container) {
    container.innerHTML = '';
    
    const frontendContainer = document.createElement('div');
    frontendContainer.className = 'skill-category';
    frontendContainer.innerHTML = `
        <h3 class="category-title">Frontend</h3>
        <div class="skill-tags">
            ${data.skills.frontend.map(skill => {
                if (skill.emoji) {
                    return `<span class="skill-tag">${skill.emoji} ${skill.name}</span>`;
                }
                return `<span class="skill-tag">
                    <img src="${skill.icon}" alt="${skill.name}" class="skill-icon">
                    ${skill.name}
                </span>`;
            }).join('')}
        </div>
    `;
    container.appendChild(frontendContainer);
    
    const backendContainer = document.createElement('div');
    backendContainer.className = 'skill-category';
    backendContainer.innerHTML = `
        <h3 class="category-title">Backend</h3>
        <div class="skill-tags">
            ${data.skills.backend.map(skill => `
                <span class="skill-tag">
                    <img src="${skill.icon}" alt="${skill.name}" class="skill-icon">
                    ${skill.name}
                </span>
            `).join('')}
        </div>
    `;
    container.appendChild(backendContainer);
    
    const cloudContainer = document.createElement('div');
    cloudContainer.className = 'skill-category';
    cloudContainer.innerHTML = `
        <h3 class="category-title">Cloud & Tools</h3>
        <div class="skill-tags">
            ${data.skills.cloud.map(skill => `
                <span class="skill-tag">
                    <img src="${skill.icon}" alt="${skill.name}" class="skill-icon ${skill.name === 'Vercel' ? 'vercel-icon' : ''}">
                    ${skill.name}
                </span>
            `).join('')}
        </div>
    `;
    container.appendChild(cloudContainer);
}

export function renderLanguages(data, container) {
    container.innerHTML = '';
    data.languages.forEach(lang => {
        const langElement = document.createElement('div');
        langElement.className = 'language-item';
        langElement.innerHTML = `
            <div class="language-info">
                <span class="language-name">${lang.name}</span>
                <span class="language-level-text">${lang.level}</span>
            </div>
            <div class="language-progress">
                <div class="progress-bar">
                    <div class="progress-fill ${lang.name.toLowerCase()}-progress" style="width: ${lang.percentage}%"></div>
                </div>
                <span class="progress-percentage">${lang.percentage}%</span>
            </div>
        `;
        container.appendChild(langElement);
    });
}

export function renderPersonalInfo(data, container) {
    const nameElement = container.querySelector('h2');
    if (nameElement) nameElement.textContent = data.personal.name;
    
    const descElement = container.querySelector('.lead-text');
    if (descElement) {
        descElement.innerHTML = data.personal.description.replace(
            /Frontend Developer/g, 
            '<code class="inline-code">Frontend Developer</code>'
        );
    }
}

export function renderEducation(data, container) {
    container.innerHTML = '';
    const eduElement = document.createElement('div');
    eduElement.className = 'education-item';
    eduElement.innerHTML = `
        <div class="education-header">
            <h3 class="education-degree">${data.education.degree}</h3>
            <span class="education-institution">${data.education.institution}</span>
        </div>
        <span class="education-date">${data.education.date}</span>
    `;
    container.appendChild(eduElement);
}

export function renderContact(data, container) {
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        emailLink.href = `mailto:${data.contact.email}`;
    }
    
    const telegramLink = document.getElementById('telegram-link');
    if (telegramLink) {
        telegramLink.href = `https://t.me/${data.contact.telegram}`;
    }
}
