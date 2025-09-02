<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Debanjan Pal | Web Developer Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #0a0a0a;
            color: #e5e5e5;
        }
        .glass-effect {
            background: rgba(23, 23, 23, 0.6);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .hero-glow {
            box-shadow: 0 0 150px 50px rgba(79, 70, 229, 0.3);
        }
    </style>
</head>
<body class="antialiased">

    <!-- Header -->
    <header id="header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-effect">
        <div class="container mx-auto px-6 py-4 flex justify-between items-center">
            <a href="#" class="text-2xl font-bold text-white tracking-wider">DP.</a>
            <nav class="hidden md:flex items-center space-x-8">
                <a href="#home" class="text-neutral-300 hover:text-indigo-400 transition-colors duration-300">Home</a>
                <a href="#about" class="text-neutral-300 hover:text-indigo-400 transition-colors duration-300">About</a>
                <a href="#projects" class="text-neutral-300 hover:text-indigo-400 transition-colors duration-300">Projects</a>
                <a href="#contact" class="text-neutral-300 hover:text-indigo-400 transition-colors duration-300">Contact</a>
            </nav>
            <button id="mobile-menu-button" class="md:hidden text-white">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        </div>
        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden px-6 pb-4">
            <a href="#home" class="block py-2 text-neutral-300 hover:text-indigo-400">Home</a>
            <a href="#about" class="block py-2 text-neutral-300 hover:text-indigo-400">About</a>
            <a href="#projects" class="block py-2 text-neutral-300 hover:text-indigo-400">Projects</a>
            <a href="#contact" class="block py-2 text-neutral-300 hover:text-indigo-400">Contact</a>
        </div>
    </header>

    <!-- Main Content -->
    <main>

        <!-- Hero Section -->
        <section id="home" class="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
            <div class="absolute inset-0 hero-glow opacity-50"></div>
            <div class="relative z-10 container mx-auto px-6">
                <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                    Hi, I'm Debanjan Pal
                </h1>
                <p class="text-lg md:text-2xl text-indigo-300 mb-8">
                    Software Engineer | Actively looking for full-time opportunities
                </p>
                <a href="#projects" class="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                    View My Work
                </a>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-20 md:py-32 bg-[#111111]">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-white mb-12">About Me</h2>
                <div class="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                    <div class="w-full md:w-1/3">
                        <img src="https://placehold.co/400x400/171717/e5e5e5?text=Debanjan+Pal" alt="Debanjan Pal Portrait" class="rounded-full shadow-lg w-64 h-64 md:w-full md:h-auto mx-auto object-cover">
                    </div>
                    <div class="w-full md:w-2/3 text-center md:text-left">
                        <p class="text-lg text-neutral-300 mb-6 leading-relaxed">
                            I am a Software Engineer with a strong background in developing scalable and efficient web applications. My expertise lies in the MERN stack (MongoDB, Express.js, React, Node.js), and I have a keen interest in cloud technologies and system design.
                        </p>
                        <p class="text-lg text-neutral-300 mb-8 leading-relaxed">
                           I am passionate about writing clean, maintainable code and building products that provide a seamless user experience. Currently, I am actively seeking full-time opportunities where I can leverage my skills to contribute to challenging projects and grow as a developer.
                        </p>
                        <div class="flex justify-center md:justify-start flex-wrap gap-4">
                             <!-- Skills could be listed here -->
                            <span class="bg-neutral-800 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full">React</span>
                            <span class="bg-neutral-800 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full">Node.js</span>
                            <span class="bg-neutral-800 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full">Express.js</span>
                            <span class="bg-neutral-800 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full">MongoDB</span>
                            <span class="bg-neutral-800 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full">System Design</span>
                             <span class="bg-neutral-800 text-indigo-300 text-sm font-medium px-4 py-2 rounded-full">Cloud Technologies</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Projects Section -->
        <section id="projects" class="py-20 md:py-32">
            <div class="container mx-auto px-6">
                <h2 class="text-3xl md:text-4xl font-bold text-center text-white mb-16">My Projects</h2>
                <div id="project-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Projects will be dynamically loaded here -->
                    <p class="text-neutral-400 col-span-full text-center">Loading projects...</p>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-20 md:py-32 bg-[#111111]">
            <div class="container mx-auto px-6 text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Get In Touch</h2>
                <p class="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">I'm currently open to new opportunities and collaborations. Feel free to reach out if you have a project in mind or just want to connect!</p>
                <div class="flex justify-center items-center space-x-6">
                     <a href="https://www.linkedin.com/in/debanjanpal/" target="_blank" rel="noopener noreferrer" class="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                        Say Hello
                    </a>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="bg-neutral-900 border-t border-neutral-800">
        <div class="container mx-auto px-6 py-8 text-center text-neutral-400">
            <div class="flex justify-center space-x-6 mb-4">
                <a href="https://github.com/Debanjan-Pal" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .5 -.6 1.2 -.5 2v3.5"></path></svg>
                </a>
                <a href="https://www.linkedin.com/in/debanjanpal/" target="_blank" rel="noopener noreferrer" class="hover:text-indigo-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0 -2 -2a2 2 0 0 0 -2 2v7h-4v-7a6 6 0 0 1 6 -6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" class="hover:text-indigo-400 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.9 3.3 4.9-6.1-1.4-6.1-6.1-6.1-6.1l-3.3 1.4.1-3.4-3.3-1.4s2.1.7 3.3 2.1c-1.4-1.6-4.9-3.3-4.9-3.3s1.4 6.1 6.1 6.1z"></path></svg>
                </a>
            </div>
            <p>&copy; 2024 Debanjan Pal. All rights reserved.</p>
        </div>
    </footer>

    <script>
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

        // Change header style on scroll
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

        // --- Dynamically Load Projects ---
        async function loadProjects() {
            // NOTE: The project data below has been populated from your Google Drive link.
            // To add a new project, you can add a new object to this array.
            const projectGrid = document.getElementById('project-grid');

            try {
                // This data is sourced from your Google Drive folder.
                const projects = [
                    {
                        title: "Dev-Portfolio",
                        description: "A sleek, modern, and fully responsive portfolio website for developers to showcase their projects, skills, and experience.",
                        videoUrl: "https://drive.google.com/uc?export=view&id=1-8_O3y6s1sZ2-X2JvHqJ8Jc_xP_g1Qv5",
                        tags: ["HTML", "Tailwind CSS", "JavaScript"],
                        demoUrl: "https://github.com/Debanjan-Pal/Dev-Portfolio"
                    },
                    {
                        title: "Brain-Tumor-Detection",
                        description: "An advanced deep learning model designed to accurately detect and classify brain tumors from MRI scans.",
                        videoUrl: "https://drive.google.com/uc?export=view&id=1-AFJm3dY7N5Ym7v1pC8Q7K5n2-h9sS8D",
                        tags: ["Deep Learning", "CNN", "Python"],
                        demoUrl: "https://github.com/Debanjan-Pal/Brain-Tumor-Detection"
                    },
                    {
                        title: "E-commerce-Website",
                        description: "A comprehensive e-commerce platform built with the MERN stack, including features like user authentication, product catalog, and shopping cart.",
                        videoUrl: "https://drive.google.com/uc?export=view&id=1-DB7F8f-tTjT5qJ1qV7-H7d5J-l1jYvJ",
                        tags: ["MERN", "React", "Node.js"],
                        demoUrl: "https://github.com/Debanjan-Pal/E-commerce-Website"
                    }
                ];
                
                if (projects.length === 0) {
                    projectGrid.innerHTML = '<p class="text-neutral-400 col-span-full text-center">No projects to display at the moment.</p>';
                    return;
                }

                projectGrid.innerHTML = ''; // Clear the "Loading..." message

                projects.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'glass-effect rounded-xl overflow-hidden transform hover:-translate-y-2 transition-all duration-300 flex flex-col';
                    
                    const tagsHtml = project.tags.map(tag => `<span class="bg-neutral-800 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full">${tag}</span>`).join('');

                    projectCard.innerHTML = `
                        <div class="w-full h-48 bg-neutral-900 flex items-center justify-center">
                            <video autoplay loop muted playsinline class="w-full h-full object-cover">
                                <source src="${project.videoUrl}" type="video/mp4">
                                Your browser does not support the video tag. An error may have occurred with the video link.
                            </video>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <h3 class="text-xl font-semibold text-white mb-2">${project.title}</h3>
                            <p class="text-neutral-400 mb-4 text-sm flex-grow">${project.description}</p>
                            <div class="flex flex-wrap gap-2 mb-4">
                                ${tagsHtml}
                            </div>
                            <div class="mt-auto">
                                <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 font-semibold">View on GitHub &rarr;</a>
                            </div>
                        </div>
                    `;
                    projectGrid.appendChild(projectCard);
                });

            } catch (error) {
                console.error("Failed to load projects:", error);
                projectGrid.innerHTML = '<p class="text-red-400 col-span-full text-center">Could not load projects. Please try again later.</p>';
            }
        }

        document.addEventListener('DOMContentLoaded', loadProjects);
    </script>
</body>
</html>


