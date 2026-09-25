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

// Local high-performance WebM video assets converted for ultra-fast, smooth 60fps playback without Google Drive 403 cross-site blocks
const LOCAL_WEBM_VIDEOS = {
    'asteroid run': 'assets/videos/asteroid-run.webm',
    'bird runner': 'assets/videos/bird-runner.webm',
    'bergmann': 'assets/videos/bergmann.webm',
    'animal swipe': 'assets/videos/animal-swipe.webm'
};

function getProjectMediaInfo(project) {
    const title = project.title ? project.title.toLowerCase().trim() : '';
    let webmSrc = null;
    for (const [key, path] of Object.entries(LOCAL_WEBM_VIDEOS)) {
        if (title.includes(key)) {
            webmSrc = path;
            break;
        }
    }

    let fileId = null;
    if (project.gifUrl) {
        const fileIdMatch = project.gifUrl.match(/(?:id=|\/d\/)([a-zA-Z0-9_-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            fileId = fileIdMatch[1];
        }
    }

    const posterUrl = fileId ? `https://lh3.googleusercontent.com/d/${fileId}` : '';

    return {
        isWebm: !!webmSrc,
        videoSrc: webmSrc,
        fileId: fileId,
        posterUrl: posterUrl
    };
}

// Authentic, sharp, 4-color Google Play Store SVG icon (no overlapping glitch artifacts)
const getGooglePlaySvg = (sizeClass = 'w-4 h-4') => `
<svg class="${sizeClass} flex-shrink-0" viewBox="0 0 466 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EA4335" d="M199.9 237.8 1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8z"/>
    <path fill="#FBBC04" d="m433.91 205.1-104.65-60-111.61 110.22 113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22z"/>
    <path fill="#34A853" d="M199.42 273.45 329.27 145.1 87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z"/>
    <path fill="#4285F4" d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86z"/>
</svg>
`;

// --- Load Projects ---
async function loadProjects() {
    const projectGrid = document.getElementById('project-grid');
    
    const GOOGLE_DRIVE_API_URL = 'https://script.google.com/macros/s/AKfycbyNGEFosJG4rEo1RvjXkIo0DxH9-LiJ_xeS1MJwmtS3XS4f6VRiHUbuwRRdH3fp1Htr/exec';
    const CACHE_KEY = 'portfolio_projects_data_v3';
    
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

            const media = getProjectMediaInfo(project);
            let mediaHtml = '';
            if (media.isWebm) {
                mediaHtml = `<video data-src="${media.videoSrc}" poster="${media.posterUrl}" alt="${project.title} Preview" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm shadow-indigo-500/10" loop muted playsinline preload="none"></video>`;
            } else if (media.posterUrl) {
                mediaHtml = `<img src="${media.posterUrl}" alt="${project.title} Preview" class="w-full h-48 object-cover rounded-lg mb-4 shadow-sm shadow-indigo-500/10" loading="lazy">`;
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
                            ${getGooglePlaySvg('w-3.5 h-3.5')}
                            LIVE ON GOOGLE PLAY
                        </span>
                        <span class="text-xs text-neutral-400 font-medium">Android Mobile</span>
                    </div>
                `;
                actionButtonsHtml = `
                    <div class="mt-auto pt-4 flex items-center justify-between gap-3 border-t border-white/10">
                        <a href="${ASTEROID_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg inline-flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 transform hover:scale-105" onclick="event.stopPropagation()">
                            ${getGooglePlaySvg('w-3.5 h-3.5')}
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

        const media = getProjectMediaInfo(project);
        let modalMediaHtml = '';
        if (media.isWebm) {
            modalMediaHtml = `
                <div class="relative w-full flex justify-center items-center bg-black/20 rounded-lg mb-6 min-h-[12rem]">
                    <!-- Loading Spinner -->
                    <div class="absolute flex justify-center items-center pointer-events-none">
                        <div class="w-10 h-10 border-4 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <!-- Video -->
                    <video src="${media.videoSrc}" poster="${media.posterUrl}" alt="${project.title} Preview" class="w-full h-auto max-h-[60vh] object-contain rounded-lg relative z-10 opacity-0 transition-opacity duration-500" loop muted autoplay playsinline oncanplay="this.previousElementSibling.classList.add('hidden'); this.classList.remove('opacity-0');"></video>
                </div>
            `;
        } else if (media.posterUrl) {
            modalMediaHtml = `
                <div class="relative w-full flex justify-center items-center bg-black/20 rounded-lg mb-6 min-h-[12rem]">
                    <!-- Loading Spinner -->
                    <div class="absolute flex justify-center items-center pointer-events-none">
                        <div class="w-10 h-10 border-4 border-neutral-700 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                    <!-- Image / GIF -->
                    <img src="${media.posterUrl}" alt="${project.title} Preview" class="w-full h-auto max-h-[60vh] object-contain rounded-lg relative z-10 opacity-0 transition-opacity duration-500" onload="this.previousElementSibling.classList.add('hidden'); this.classList.remove('opacity-0');">
                </div>
            `;
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
                        ${getGooglePlaySvg('w-3.5 h-3.5')}
                        OFFICIAL RELEASE • LIVE ON GOOGLE PLAY
                    </span>
                </div>
            `;
            modalActionsHtml = `
                <div class="flex flex-wrap items-center gap-4">
                    <a href="${ASTEROID_PLAY_STORE_URL}" target="_blank" rel="noopener noreferrer" class="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-105">
                        ${getGooglePlaySvg('w-5 h-5')}
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

// Global error listener to handle video to image fallback (e.g. if a video fails to load, falls back to the poster or preview)
document.addEventListener('error', function (e) {
    const target = e.target;
    if (target.tagName === 'VIDEO' && !target.dataset.hasFailed) {
        target.dataset.hasFailed = 'true';
        const fallbackSrc = target.poster || (target.dataset.fileId ? `https://lh3.googleusercontent.com/d/${target.dataset.fileId}` : '');
        if (!fallbackSrc) return;

        const imgEl = document.createElement('img');
        imgEl.src = fallbackSrc;
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
