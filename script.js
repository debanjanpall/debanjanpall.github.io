// Initialize Vanta Waves on the background layer
VANTA.WAVES({
    el: "#vanta-bg",
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
    const isHidden = mobileMenu.classList.toggle('hidden');
    mobileMenuButton.setAttribute('aria-expanded', !isHidden);
});

// Close mobile menu when a link is clicked
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
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
    const CACHE_KEY = 'portfolio_projects_data_v2';
    
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

        const ASTEROID_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.DevUp.AsteroidRun';

        // Sort projects with Asteroid Run pinned first, then reverse alphabetical order (Z to A)
        projects.sort((a, b) => {
            const aIsAsteroid = a.title && a.title.toLowerCase().includes('asteroid');
            const bIsAsteroid = b.title && b.title.toLowerCase().includes('asteroid');
            if (aIsAsteroid) return -1;
            if (bIsAsteroid) return 1;
            return b.title.localeCompare(a.title);
        });

        projectGrid.innerHTML = '';
        
        // 2. Use a DocumentFragment to minimize DOM repaints
        const fragment = document.createDocumentFragment();
        
        projects.forEach((project, index) => {
            const isAsteroid = project.title && project.title.toLowerCase().includes('asteroid');
            const projectCard = document.createElement('div');
            // Add opacity-0 and translate-y-5 for reveal animation. Add glowing border for Asteroid Run.
            projectCard.className = isAsteroid
                ? 'project-card glass-effect rounded-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 flex flex-col p-6 opacity-0 translate-y-5 cursor-pointer relative border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                : 'project-card glass-effect rounded-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500 flex flex-col p-6 opacity-0 translate-y-5 cursor-pointer';

            let mediaHtml = '';
            if (project.gifUrl) {
                const fileIdMatch = project.gifUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
                
                if (fileIdMatch && fileIdMatch[1]) {
                    const fileId = fileIdMatch[1];
                    const directVideoUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
                    const posterUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                    mediaHtml = `<video data-src="${directVideoUrl}" data-file-id="${fileId}" poster="${posterUrl}" alt="${project.title} Preview" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm shadow-indigo-500/10" loop muted playsinline preload="none"></video>`;
                }
            }

            // Check for description content, fallback if not found
            let descriptionText = project.description ? project.description : 'Project folder loaded from Google Drive.';
            if (isAsteroid) {
                descriptionText = 'Asteroid Run is an addictive cosmic physics puzzle game! Slingshot expressive 3D planets around a central gravity well, merge identical worlds to evolve them from tiny asteroids into the blazing Sun, and keep your cool before the jar overflows.';
            }

            let featuredBadgeHtml = '';
            let actionButtonsHtml = `
                <div class="mt-auto">
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center text-sm">
                        Open Folder <span class="ml-1">→</span>
                    </a>
                </div>
            `;

            if (isAsteroid) {
                featuredBadgeHtml = `
                    <div class="flex items-center justify-between mb-3">
                        <span class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3.609 1.814L13.793 12 3.61 22.186a1.597 1.597 0 0 1-.61-.926V2.74c0-.36.216-.7.609-.926zm11.24 11.24l2.42 2.42-12.04 6.963 9.62-9.383zm0-2.108L5.23 1.563l12.04 6.963-2.42 2.42zm1.488 1.054l3.528 2.04c1.134.656 1.134 1.724 0 2.38l-3.528 2.04-2.112-2.112 2.112-2.348z"/></svg>
                            LIVE ON GOOGLE PLAY
                        </span>
                        <span class="text-xs text-neutral-400 font-medium">Android Mobile</span>
                    </div>
                `;
                actionButtonsHtml = `
                    <div class="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-white/10">
                        <a href="${ASTEROID_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 transform hover:scale-105" onclick="event.stopPropagation()">
                            <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3.609 1.814L13.793 12 3.61 22.186a1.597 1.597 0 0 1-.61-.926V2.74c0-.36.216-.7.609-.926zm11.24 11.24l2.42 2.42-12.04 6.963 9.62-9.383zm0-2.108L5.23 1.563l12.04 6.963-2.42 2.42zm1.488 1.054l3.528 2.04c1.134.656 1.134 1.724 0 2.38l-3.528 2.04-2.112-2.112 2.112-2.348z"/></svg>
                            Play Store ↗
                        </a>
                        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-neutral-400 hover:text-white text-xs font-medium inline-flex items-center">
                            Folder <span class="ml-1">→</span>
                        </a>
                    </div>
                `;
            }

            projectCard.innerHTML = `
                <div class="flex flex-col flex-grow">
                    ${featuredBadgeHtml}
                    ${mediaHtml}
                    <h3 class="text-xl font-semibold text-white mb-2">${project.title}</h3>
                    <p class="text-neutral-400 mb-4 text-sm flex-grow line-clamp-3" title="${descriptionText.replace(/"/g, '&quot;')}">${descriptionText}</p>
                    ${actionButtonsHtml}
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

        // --- Initialize Video Lazy Loading & Autoplay on Scroll ---
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        if (!video.src && video.dataset.src) {
                            video.src = video.dataset.src;
                        }
                        video.play().catch(err => {
                            console.log("Video play interrupted/blocked:", err);
                        });
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: 0.1 });

            projectGrid.querySelectorAll('video').forEach(video => {
                videoObserver.observe(video);
            });
        } else {
            // Fallback for older browsers
            projectGrid.querySelectorAll('video').forEach(video => {
                if (video.dataset.src) {
                    video.src = video.dataset.src;
                }
                video.autoplay = true;
            });
        }

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
        <div id="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title" class="bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] relative transform transition-all duration-300 scale-95" onclick="event.stopPropagation()">
            <div id="modal-content-wrapper" class="overflow-y-auto max-h-[90vh] p-6 sm:p-8">
                <!-- Dynamic content will be injected here -->
            </div>
            <button id="modal-close-btn" class="absolute -top-3 -right-3 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 w-10 h-10 flex items-center justify-center text-2xl leading-none font-light border border-neutral-700 z-20" aria-label="Close project modal">&times;</button>
            
            <!-- Navigation Buttons -->
            <button id="modal-prev-btn" class="absolute top-1/2 left-2 sm:-left-5 -translate-y-1/2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 w-12 h-12 flex items-center justify-center text-3xl leading-none font-light border border-neutral-700 z-10 transition-transform hover:scale-110" aria-label="View previous project">‹</button>
            <button id="modal-next-btn" class="absolute top-1/2 right-2 sm:-right-5 -translate-y-1/2 bg-neutral-800 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700 w-12 h-12 flex items-center justify-center text-3xl leading-none font-light border border-neutral-700 z-10 transition-transform hover:scale-110" aria-label="View next project">›</button>
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
            modalContentWrapper.innerHTML = ''; // Clear contents to stop background video playback/loading
        }, 300); // Match transition duration
    };

    const displayProjectInModal = (index) => {
        if (index < 0 || index >= projectsForModal.length) return;
        
        currentIndexForModal = index;
        const project = projectsForModal[index];

        let modalMediaHtml = '';
        if (project.gifUrl) {
            const fileIdMatch = project.gifUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
            if (fileIdMatch && fileIdMatch[1]) {
                const fileId = fileIdMatch[1];
                const directVideoUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=t`;
                const posterUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
                modalMediaHtml = `
                    <div class="relative w-full flex justify-center items-center bg-black/20 rounded-lg mb-6 min-h-[12rem]">
                        <!-- Loading Spinner -->
                        <div class="absolute flex justify-center items-center pointer-events-none">
                            <div class="w-10 h-10 border-4 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                        </div>
                        <!-- Video -->
                        <video src="${directVideoUrl}" data-file-id="${fileId}" poster="${posterUrl}" alt="${project.title} Preview" class="w-full h-auto max-h-[60vh] object-contain rounded-lg relative z-10 opacity-0 transition-opacity duration-500" loop muted autoplay playsinline oncanplay="this.previousElementSibling.classList.add('hidden'); this.classList.remove('opacity-0');"></video>
                    </div>
                `;
            }
        }

        const isAsteroid = project.title && project.title.toLowerCase().includes('asteroid');
        const ASTEROID_PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.DevUp.AsteroidRun';

        let descriptionText = project.description ? project.description : 'Project folder loaded from Google Drive.';
        if (isAsteroid) {
            descriptionText = 'Asteroid Run is an addictive cosmic physics puzzle game! Slingshot expressive 3D planets around a central gravity well, merge identical worlds to evolve them from tiny asteroids into the blazing Sun, and keep your cool before the jar overflows.';
        }

        let badgeHtml = '';
        let modalActionsHtml = `
            <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center text-sm">
                Open Folder <span class="ml-1">→</span>
            </a>
        `;

        if (isAsteroid) {
            badgeHtml = `
                <div class="mb-3">
                    <span class="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3.609 1.814L13.793 12 3.61 22.186a1.597 1.597 0 0 1-.61-.926V2.74c0-.36.216-.7.609-.926zm11.24 11.24l2.42 2.42-12.04 6.963 9.62-9.383zm0-2.108L5.23 1.563l12.04 6.963-2.42 2.42zm1.488 1.054l3.528 2.04c1.134.656 1.134 1.724 0 2.38l-3.528 2.04-2.112-2.112 2.112-2.348z"/></svg>
                        OFFICIAL RELEASE • LIVE ON GOOGLE PLAY
                    </span>
                </div>
            `;
            modalActionsHtml = `
                <div class="flex flex-wrap items-center gap-4">
                    <a href="${ASTEROID_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105">
                        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M3.609 1.814L13.793 12 3.61 22.186a1.597 1.597 0 0 1-.61-.926V2.74c0-.36.216-.7.609-.926zm11.24 11.24l2.42 2.42-12.04 6.963 9.62-9.383zm0-2.108L5.23 1.563l12.04 6.963-2.42 2.42zm1.488 1.054l3.528 2.04c1.134.656 1.134 1.724 0 2.38l-3.528 2.04-2.112-2.112 2.112-2.348z"/></svg>
                        Get it on Google Play Store ↗
                    </a>
                    <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="text-neutral-300 hover:text-white font-semibold inline-flex items-center text-sm border border-neutral-700 hover:border-neutral-500 px-4 py-3 rounded-lg transition-all">
                        Open Project Folder <span class="ml-1">→</span>
                    </a>
                </div>
            `;
        }

        modalContentWrapper.innerHTML = `
            ${badgeHtml}
            <h3 id="modal-title" class="text-3xl font-bold text-white mb-4">${project.title}</h3>
            ${modalMediaHtml}
            <p class="text-neutral-300 mb-8 whitespace-pre-wrap">${descriptionText}</p>
            ${modalActionsHtml}
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

// Global error listener to handle video to image fallback (e.g. if the video fails to load, falls back to the original GIF)
document.addEventListener('error', function (e) {
    const target = e.target;
    if (target.tagName === 'VIDEO' && target.dataset.fileId) {
        const fileId = target.dataset.fileId;
        const imgEl = document.createElement('img');
        imgEl.src = `https://lh3.googleusercontent.com/d/${fileId}`;
        imgEl.alt = target.alt || "Preview";
        imgEl.className = target.className;

        // If the video is in the modal (indicated by opacity-0 style)
        if (target.classList.contains('opacity-0')) {
            imgEl.className = "w-full h-auto max-h-[60vh] object-contain rounded-lg relative z-10 opacity-0 transition-opacity duration-500";
            imgEl.onload = function () {
                imgEl.classList.remove('opacity-0');
                if (imgEl.previousElementSibling) {
                    imgEl.previousElementSibling.classList.add('hidden');
                }
            };
        } else {
            imgEl.setAttribute('loading', 'lazy');
        }

        target.parentNode.replaceChild(imgEl, target);
    }
}, true); // Use capture phase because error event does not bubble

// --- Dynamic Experience & Copyright Auto-updater ---
// Career started January 1, 2022 (Cyclops Medtech -> Equidor Medtech)
function updateDynamicExperience() {
    const careerStartDate = new Date(2022, 0, 1);
    const now = new Date();

    // Calculate difference in months
    const totalMonths = (now.getFullYear() - careerStartDate.getFullYear()) * 12 + (now.getMonth() - careerStartDate.getMonth());
    const years = totalMonths / 12;

    // Round to nearest half-year increments (e.g. 4.5+, 5+, 5.5+)
    const rounded = Math.floor(years * 2) / 2;
    const expString = `${rounded}+`;

    document.querySelectorAll('.dynamic-exp-years').forEach(el => {
        el.textContent = expString;
    });

    const copyrightYearEl = document.getElementById('copyright-year');
    if (copyrightYearEl) {
        copyrightYearEl.textContent = now.getFullYear();
    }
}

// Run immediately
updateDynamicExperience();

// --- 3D Scroll-Driven Xbox Controller Experience ---
function initController3D() {
    const canvas = document.getElementById('webgl-controller-canvas');
    const container = document.getElementById('canvas3d-container');
    if (!canvas || !window.THREE || !window.THREE.GLTFLoader || !window.gsap) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key light (crisp white from top right)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    // Fill light (soft cool indigo tone from front left)
    const fillLight = new THREE.DirectionalLight(0xa5b4fc, 0.9);
    fillLight.position.set(-5, 2, 4);
    scene.add(fillLight);

    // Accent indigo rim light (matching portfolio brand palette)
    const rimLight = new THREE.PointLight(0x6366f1, 2.5, 25);
    rimLight.position.set(-4, -3, 3);
    scene.add(rimLight);

    // Violet top-rear rim light for depth
    const rearLight = new THREE.PointLight(0x818cf8, 1.8, 20);
    rearLight.position.set(3, 5, -3);
    scene.add(rearLight);

    // 3. Hierarchy: scrollGroup (GSAP scroll) -> mouseGroup (cursor parallax + bob) -> model
    const scrollGroup = new THREE.Group();
    const mouseGroup = new THREE.Group();
    scrollGroup.add(mouseGroup);
    scene.add(scrollGroup);

    // 4. Load Textures & 3D Game Boy Model
    // When opened directly via file:/// in Chrome/Edge, browsers block local fetch/images due to CORS;
    // using embedded Base64 data guarantees it works 100% offline via file:/// as well as on http/https.
    const isFileProto = window.location.protocol === 'file:';
    const textureSource = (isFileProto && window.GAMEBOY_TEXTURE_DATA) ? window.GAMEBOY_TEXTURE_DATA : 'assets/baked-game-boy.jpg';
    const modelSource = (isFileProto && window.GAMEBOY_GLB_DATA) ? window.GAMEBOY_GLB_DATA : 'assets/gameboy.glb';

    const textureLoader = new THREE.TextureLoader();
    const bakedTexture = textureLoader.load(textureSource);
    bakedTexture.flipY = false;
    bakedTexture.encoding = THREE.sRGBEncoding;

    const bodyMaterial = new THREE.MeshStandardMaterial({
        map: bakedTexture,
        roughness: 0.65,
        metalness: 0.05
    });

    // Iconic olive-green retro LCD screen with gentle backlight glow
    const screenMaterial = new THREE.MeshStandardMaterial({
        color: 0x8bac0f,
        emissive: 0x8bac0f,
        emissiveIntensity: 0.25,
        roughness: 0.35,
        metalness: 0.1
    });

    // Battery power indicator LED
    const ledMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        emissive: 0xff1111,
        emissiveIntensity: 2.0,
        roughness: 0.2
    });

    const loader = new THREE.GLTFLoader();
    loader.load(modelSource, (gltf) => {
        const model = gltf.scene;

        // Auto-center & normalize scale
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Visual size in Three.js space
        const targetSize = window.innerWidth < 768 ? 2.4 : 3.2;
        const scaleFactor = targetSize / maxDim;
        model.scale.setScalar(scaleFactor);

        // Center model geometry around (0,0,0)
        box.setFromObject(model);
        box.getCenter(center);
        model.position.sub(center);

        // Apply materials to Game Boy components
        model.traverse((child) => {
            if (child.isMesh) {
                if (child.name === 'screen') {
                    child.material = screenMaterial;
                } else if (child.name === 'power-indicator') {
                    child.material = ledMaterial;
                } else {
                    child.material = bodyMaterial;
                }
            }
        });

        mouseGroup.add(model);

        // Smooth fade-in
        if (container) {
            container.classList.remove('opacity-0');
        }

        // Setup GSAP ScrollTrigger timeline
        setupScrollAnimation(scrollGroup);
    }, undefined, (err) => {
        console.warn('3D Game Boy loading error:', err);
    });

    // 5. GSAP ScrollTrigger Choreography
    function setupScrollAnimation(group) {
        if (!window.ScrollTrigger) return;
        gsap.registerPlugin(ScrollTrigger);

        const isMobile = window.innerWidth < 768;

        // Initial state at Hero (#home)
        // Game Boy sits in the background depth plane on the right flank, strictly behind all text and buttons
        group.position.set(
            isMobile ? 0    : 3.0,
            isMobile ? -0.8 : -0.2,
            isMobile ? -1.2 : -0.8
        );
        group.rotation.set(0.24, -0.38, 0.06);
        group.scale.setScalar(1);

        // Section 1: Hero to About Me (#about)
        // Game Boy glides smoothly in the background behind the bio text and cards
        const tlAbout = gsap.timeline({
            scrollTrigger: {
                trigger: '#about',
                start: 'top bottom',
                end: 'center center',
                scrub: 1.4
            }
        });

        tlAbout.to(group.position, {
            x: isMobile ? 0    : 2.2,
            y: isMobile ? -0.8 : 0.1,
            z: isMobile ? -1.0 : -0.4,
            ease: 'none'
        }, 0);

        tlAbout.to(group.rotation, {
            x: 0.15,
            y: -0.75,
            z: 0.1,
            ease: 'none'
        }, 0);

        // Section 2: About Me to Technical Skills (#skills)
        // Swings to left flank in the background behind the skill cards
        const tlSkills = gsap.timeline({
            scrollTrigger: {
                trigger: '#skills',
                start: 'top bottom',
                end: 'center center',
                scrub: 1.4
            }
        });

        tlSkills.to(group.position, {
            x: isMobile ? 0    : -2.0,
            y: isMobile ? -0.4 : 0.2,
            z: isMobile ? -1.0 : -0.5,
            ease: 'none'
        }, 0);

        tlSkills.to(group.rotation, {
            x: 0.45,
            y: 0.35,
            z: -0.12,
            ease: 'none'
        }, 0);

        // Section 3: Technical Skills → Experience & Projects
        // Fades and recedes into the distance — no competition with project video cards
        const tlProjects = gsap.timeline({
            scrollTrigger: {
                trigger: '#experience',
                start: 'top 80%',
                end: 'top 30%',
                scrub: 1
            }
        });

        tlProjects.to(group.position, {
            y: -4,
            z: -6,
            ease: 'power1.in'
        }, 0);

        tlProjects.to(group.scale, {
            x: 0.01,
            y: 0.01,
            z: 0.01,
            ease: 'power1.in'
        }, 0);
    }

    // 6. Interactive Mouse Movement / Cursor Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('pointermove', (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    // 7. Responsive Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();
    let isVisible = true;

    // Pause rendering when tab is not visible to save battery
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (!isVisible) return;

        const elapsedTime = clock.getElapsedTime();

        // Smooth mouse lerp
        currentMouseX += (targetMouseX - currentMouseX) * 0.06;
        currentMouseY += (targetMouseY - currentMouseY) * 0.06;

        // Subtle interactive tilt
        mouseGroup.rotation.y = currentMouseX * 0.25;
        mouseGroup.rotation.x = -currentMouseY * 0.18;

        // Gentle floating bob
        mouseGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.08;

        renderer.render(scene, camera);
    }
    animate();
}

// Initialize 3D Controller once scripts and DOM are ready
if (document.readyState === 'complete') {
    initController3D();
} else {
    window.addEventListener('load', initController3D);
}