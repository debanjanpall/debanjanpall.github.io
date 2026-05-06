// Initialize Vanta Birds on the Hero section
VANTA.BIRDS({
    el: "#home",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    backgroundColor: 0x0a0a0a, // Matches your body background
    color1: 0x4f46e5,         // Matches indigo-600
    color2: 0x818cf8          // Matches indigo-400
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when a link is clicked
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('py-2');
        header.classList.remove('py-4');
    } else {
        header.classList.add('py-4');
        header.classList.remove('py-2');
    }
});

// --- Load Projects ---
async function loadProjects() {
    const projectGrid = document.getElementById('project-grid');
    
    const GOOGLE_DRIVE_API_URL = 'https://script.google.com/macros/s/AKfycbyNGEFosJG4rEo1RvjXkIo0DxH9-LiJ_xeS1MJwmtS3XS4f6VRiHUbuwRRdH3fp1Htr/exec';
    
    try {
        const response = await fetch(GOOGLE_DRIVE_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const projects = await response.json();
        
        if (projects.error) {
            throw new Error(`Google Apps Script Error: ${projects.error}`);
        }

        if (!Array.isArray(projects) || projects.length === 0) {
            projectGrid.innerHTML = '<p class="text-neutral-400 col-span-full text-center">No projects to display at the moment.</p>';
            return;
        }

        projectGrid.innerHTML = '';
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'glass-effect rounded-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col p-6';

            // Check if the project object contains a GIF URL and create the image tag if it does
            let gifHtml = '';
            if (project.gifUrl) {
                // Google Drive recently rolled out security updates blocking direct image embedding via 'export' links,
                // regardless of file size, causing them to fail in <img> tags.
                // By extracting the file ID and using Google's alternate content delivery URL (lh3), we can bypass this.
                const fileIdMatch = project.gifUrl.match(/id=([a-zA-Z0-9_-]+)/);
                
                if (fileIdMatch && fileIdMatch[1]) {
                    const fileId = fileIdMatch[1];
                    const directGifUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                    gifHtml = `<img src="${directGifUrl}" alt="${project.title} Preview" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm shadow-indigo-500/10">`;
                }
            }

            projectCard.innerHTML = `
                <div class="flex flex-col flex-grow">
                    ${gifHtml}
                    <h3 class="text-xl font-semibold text-white mb-2">${project.title}</h3>
                    <p class="text-neutral-400 mb-4 text-sm flex-grow">Project folder loaded from Google Drive.</p>
                    <div class="mt-auto">
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center">
                            Open Folder <span class="ml-1">→</span>
                        </a>
                    </div>
                </div>
            `;
            projectGrid.appendChild(projectCard);
        });

    } catch (error) {
        console.error("Failed to load projects:", error);
        projectGrid.innerHTML = `<p class="text-red-400 col-span-full text-center">Could not load projects: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', loadProjects);

// --- Contact Form Handling ---
const contactForm = document.getElementById('contact-form');
const thankYouPanel = document.getElementById('thank-you-panel');
const closeThankYouBtn = document.getElementById('close-thank-you');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevents the default redirect
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        // FormSubmit AJAX URL requires /ajax/ before the email address
        const actionUrl = 'https://formsubmit.co/ajax/debanjanpal59@gmail.com';

        try {
            const response = await fetch(actionUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });

            if (response.ok) {
                contactForm.reset(); // Clear the form fields
                contactForm.classList.add('hidden'); // Hide the form
                thankYouPanel.classList.remove('hidden'); // Show the thank you message
            } else {
                alert('Oops! There was a problem submitting your form.');
            }
        } catch (error) {
            console.error(error);
            alert('Oops! There was a problem submitting your form.');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

if (closeThankYouBtn) {
    closeThankYouBtn.addEventListener('click', () => {
        thankYouPanel.classList.add('hidden'); // Hide thank you panel
        contactForm.classList.remove('hidden'); // Show form again
    });
}