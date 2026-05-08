// Initialize Vanta Waves on the Hero section
VANTA.WAVES({
    el: "#home",
    mouseControls: true,
    touchControls: true,
    gyroControls: false,
    minHeight: 200.00,
    minWidth: 200.00,
    scale: 1.00,
    scaleMobile: 1.00,
    color: 0x181818
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
    const CACHE_KEY = 'portfolio_projects_data';
    
    try {
        let projects;
        const cachedData = sessionStorage.getItem(CACHE_KEY);

        // 1. Use cached data if available to instantly load projects
        if (cachedData) {
            projects = JSON.parse(cachedData);
        } else {
            // Show a skeleton loading animation while fetching data from the API
            const skeletonCards = Array(6).fill('').map(() => `
                <div class="glass-effect rounded-xl overflow-hidden flex flex-col p-6 animate-pulse border border-white/5">
                    <div class="w-full h-48 bg-gray-600/20 rounded-lg mb-4"></div>
                    <div class="h-6 bg-gray-600/20 rounded w-2/3 mb-2"></div>
                    <div class="h-4 bg-gray-600/20 rounded w-full mb-1 flex-grow"></div>
                    <div class="h-4 bg-gray-600/20 rounded w-4/5 mb-4"></div>
                    <div class="mt-auto h-4 bg-gray-600/20 rounded w-1/3"></div>
                </div>
            `).join('');
            projectGrid.innerHTML = skeletonCards;

            const response = await fetch(GOOGLE_DRIVE_API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            projects = await response.json();
            
            if (projects.error) {
                throw new Error(`Google Apps Script Error: ${projects.error}`);
            }
            
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(projects));
        }

        if (!Array.isArray(projects) || projects.length === 0) {
            projectGrid.innerHTML = '<p class="text-neutral-400 col-span-full text-center">No projects to display at the moment.</p>';
            return;
        }

        // Sort projects in reverse alphabetical order (Z to A)
        projects.sort((a, b) => b.title.localeCompare(a.title));

        projectGrid.innerHTML = '';
        
        // 2. Use a DocumentFragment to minimize DOM repaints
        const fragment = document.createDocumentFragment();
        
        projects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            // Add opacity-0 and translate-y-5 for the reveal animation. Increased duration for a smoother effect.
            projectCard.className = 'project-card glass-effect rounded-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 flex flex-col p-6 opacity-0 translate-y-5 cursor-pointer';

            let gifHtml = '';
            if (project.gifUrl) {
                const fileIdMatch = project.gifUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
                
                if (fileIdMatch && fileIdMatch[1]) {
                    const fileId = fileIdMatch[1];
                    const directGifUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                    // 3. Added loading="lazy" to defer off-screen image loading
                    gifHtml = `<img src="${directGifUrl}" alt="${project.title} Preview" loading="lazy" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm shadow-indigo-500/10">`;
                }
            }

            // Check for description content, fallback if not found
            const descriptionText = project.description ? project.description : 'Project folder loaded from Google Drive.';

            projectCard.innerHTML = `
                <div class="flex flex-col flex-grow">
                    ${gifHtml}
                    <h3 class="text-xl font-semibold text-white mb-2">${project.title}</h3>
                    <p class="text-neutral-400 mb-4 text-sm flex-grow line-clamp-3" title="${descriptionText.replace(/"/g, '&quot;')}">${descriptionText}</p>
                    <div class="mt-auto">
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center">
                            Open Folder <span class="ml-1">→</span>
                        </a>
                    </div>
                </div>
            `;

            // Add click listener to open project details in a modal
            projectCard.addEventListener('click', (e) => { // When a card is clicked...
                if (e.target.closest('a')) return; // ...but not if it's a link.
                // Pass the full list and current index to the modal
                window.openProjectModal(projects, index);
            });

            fragment.appendChild(projectCard);
        });
        
        // Append all cards at once
        projectGrid.appendChild(fragment);

        // --- Animate cards into view ---
        // Trigger a staggered animation on each card to have them fade and slide in.
        const cards = Array.from(projectGrid.children);
        cards.forEach((card, index) => {
            setTimeout(() => card.classList.remove('opacity-0', 'translate-y-5'), index * 100);
        });
    } catch (error) {
        console.error("Failed to load projects:", error);
        projectGrid.innerHTML = `<p class="text-red-400 col-span-full text-center">Could not load projects: ${error.message}</p>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    // --- Modal Setup ---
    let projectsForModal = [];
    let currentIndexForModal = -1;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'project-modal';
    modalContainer.className = 'fixed inset-0 bg-black bg-opacity-80 z-50 hidden opacity-0 items-center justify-center p-4 transition-opacity duration-300';
    
    modalContainer.innerHTML = `
        <div id="modal-dialog" class="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] relative transform transition-all duration-300 scale-95" onclick="event.stopPropagation()">
            <div id="modal-content-wrapper" class="overflow-y-auto max-h-[90vh] p-6 sm:p-8">
                <!-- Dynamic content will be injected here -->
            </div>
            <button id="modal-close-btn" class="absolute -top-3 -right-3 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 w-10 h-10 flex items-center justify-center text-2xl leading-none font-light border border-neutral-700 z-20">&times;</button>
            
            <!-- Navigation Buttons -->
            <button id="modal-prev-btn" class="absolute top-1/2 left-2 sm:-left-5 -translate-y-1/2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 w-12 h-12 flex items-center justify-center text-3xl leading-none font-light border border-neutral-700 z-10 transition-transform hover:scale-110">‹</button>
            <button id="modal-next-btn" class="absolute top-1/2 right-2 sm:-right-5 -translate-y-1/2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 w-12 h-12 flex items-center justify-center text-3xl leading-none font-light border border-neutral-700 z-10 transition-transform hover:scale-110">›</button>
        </div>
    `;
    document.body.appendChild(modalContainer);

    const modalContentWrapper = document.getElementById('modal-content-wrapper');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalPrevBtn = document.getElementById('modal-prev-btn');
    const modalNextBtn = document.getElementById('modal-next-btn');

    const closeModal = () => {
        document.getElementById('modal-dialog').classList.add('scale-95');
        modalContainer.classList.add('opacity-0');
        setTimeout(() => {
            modalContainer.classList.add('hidden');
            modalContainer.classList.remove('flex');
            document.body.style.overflow = ''; // Re-enable scrolling
        }, 300); // Match transition duration
    };

    const displayProjectInModal = (index) => {
        if (index < 0 || index >= projectsForModal.length) return;
        
        currentIndexForModal = index;
        const project = projectsForModal[index];

        let modalGifHtml = '';
        if (project.gifUrl) {
            const fileIdMatch = project.gifUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                const fileId = fileIdMatch[1];
                const directGifUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                modalGifHtml = `
                    <div class="relative w-full flex justify-center items-center bg-black/20 rounded-lg mb-6 min-h-[12rem]">
                        <!-- Loading Spinner -->
                        <div class="absolute flex justify-center items-center pointer-events-none">
                            <div class="w-10 h-10 border-4 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                        <!-- Image -->
                        <img src="${directGifUrl}" alt="${project.title} Preview" class="w-full h-auto max-h-[60vh] object-contain rounded-lg relative z-10 opacity-0 transition-opacity duration-500" onload="this.previousElementSibling.classList.add('hidden'); this.classList.remove('opacity-0');">
                    </div>
                `;
            }
        }

        const descriptionText = project.description ? project.description : 'Project folder loaded from Google Drive.';

        modalContentWrapper.innerHTML = `
            <h3 class="text-3xl font-bold text-white mb-4">${project.title}</h3>
            ${modalGifHtml}
            <p class="text-neutral-300 mb-8 whitespace-pre-wrap">${descriptionText}</p>
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center">
                Open Folder <span class="ml-1">→</span>
            </a>
        `;
        // Scroll to top of modal content on navigation
        modalContentWrapper.scrollTop = 0;
    };

    modalCloseBtn.addEventListener('click', closeModal);
    modalContainer.addEventListener('click', closeModal); // Close when clicking the backdrop

    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIndex = (currentIndexForModal - 1 + projectsForModal.length) % projectsForModal.length;
        displayProjectInModal(prevIndex);
    });

    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIndex = (currentIndexForModal + 1) % projectsForModal.length;
        displayProjectInModal(nextIndex);
    });

    // Add keyboard navigation for the modal
    document.addEventListener('keydown', (e) => {
        // Only act if the modal is open (i.e., not hidden)
        if (modalContainer.classList.contains('hidden')) {
            return;
        }

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault(); // Prevent browser from scrolling
                modalPrevBtn.click(); // Trigger the 'previous' button's click event
                break;
            case 'ArrowRight':
                e.preventDefault(); // Prevent browser from scrolling
                modalNextBtn.click(); // Trigger the 'next' button's click event
                break;
            case 'Escape':
                e.preventDefault(); // Prevent any default browser action
                closeModal(); // Close the modal
                break;
        }
    });

    // Define the function on the window object so it's accessible from the loadProjects scope
    window.openProjectModal = (projects, index) => {
        projectsForModal = projects;
        displayProjectInModal(index);
        
        modalContainer.classList.remove('hidden');
        modalContainer.classList.add('flex');
        // Small delay ensures the browser processes the layout before animating
        setTimeout(() => {
            modalContainer.classList.remove('opacity-0');
            document.getElementById('modal-dialog').classList.remove('scale-95');
        }, 10);
        
        document.body.style.overflow = 'hidden'; // Disable background scrolling
    };
});

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