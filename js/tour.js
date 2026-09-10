/* ========================================
   Tour Virtual MR.COM - Configuration
   ======================================== */

// Scene definitions
const scenes = [
    {
        title: "Oficina Principal",
        description: "Nuestro espacio de trabajo principal donde creamos soluciones tecnológicas",
        image: "images/oficina-360.jpg",
        hotspots: [
            { yaw: -30, pitch: 0, type: "info", text: "Mesa de trabajo principal", scene: null },
            { yaw: 90, pitch: 10, type: "scene", text: "Ir a Sala de Espera", scene: 1 },
            { yaw: 180, pitch: 5, type: "info", text: "Zona de servidores y equipos", scene: null },
        ]
    },
    {
        title: "Sala de Espera",
        description: "Un espacio cómodo para recibir a nuestros clientes",
        image: "images/sala-360.jpg",
        hotspots: [
            { yaw: -60, pitch: 0, type: "info", text: "Área de descanso para clientes", scene: null },
            { yaw: 120, pitch: 5, type: "scene", text: "Ir a Entrada", scene: 2 },
            { yaw: 200, pitch: 0, type: "scene", text: "Volver a Oficina", scene: 0 },
        ]
    },
    {
        title: "Entrada",
        description: "El acceso principal a nuestras instalaciones",
        image: "images/pasillo-360.jpg",
        hotspots: [
            { yaw: 45, pitch: 0, type: "info", text: "Acceso principal con sistema de seguridad", scene: null },
            { yaw: 150, pitch: 5, type: "scene", text: "Ir a Exterior", scene: 3 },
            { yaw: -90, pitch: 5, type: "scene", text: "Ir a Oficina", scene: 0 },
        ]
    },
    {
        title: "Exterior",
        description: "Vista exterior de nuestras instalaciones en Castro, Chiloé",
        image: "images/exterior-360.jpg",
        hotspots: [
            { yaw: 0, pitch: 0, type: "info", text: "Entrada principal del edificio", scene: null },
            { yaw: 180, pitch: 5, type: "scene", text: "Ir a Sala de Reuniones", scene: 4 },
        ]
    },
    {
        title: "Sala de Reuniones",
        description: "Espacio para reuniones con clientes y presentaciones de proyectos",
        image: "images/conferencias-360.jpg",
        hotspots: [
            { yaw: 0, pitch: 5, type: "info", text: "Mesa de reuniones principal", scene: null },
            { yaw: 120, pitch: 10, type: "scene", text: "Ir a Oficina Principal", scene: 0 },
            { yaw: 240, pitch: 5, type: "scene", text: "Ir a Exterior", scene: 3 },
        ]
    }
];

// State
let currentScene = 0;
let viewer = null;

// Initialize the viewer
function initViewer() {
    const config = createSceneConfig(currentScene);
    
    viewer = pannellum.viewer('panorama', config);
    
    updateSceneInfo();
    updateSceneSelector();
}

// Create Pannellum config for a scene
function createSceneConfig(sceneIndex) {
    const scene = scenes[sceneIndex];
    
    return {
        type: 'equirectangular',
        panorama: scene.image,
        autoLoad: true,
        autoRotate: -2,
        autoRotateInactivityDelay: 5000,
        compass: false,
        northOffset: 0,
        showZoomCtrl: true,
        keyboardZoom: true,
        mouseZoom: true,
        doubleClickZoom: true,
        hfov: 100,
        minHfov: 50,
        maxHfov: 140,
        pitch: 0,
        yaw: 0,
        hotSpots: scene.hotspots.map(hotspot => createHotspot(hotspot)),
        onLoad: function() {
            console.log('Escena cargada:', scene.title);
        }
    };
}

// Create hotspot definition
function createHotspot(hotspot) {
    const base = {
        yaw: hotspot.yaw,
        pitch: hotspot.pitch,
        cssClass: 'custom-hotspot',
    };
    
    if (hotspot.type === 'scene') {
        return {
            ...base,
            type: 'scene',
            text: hotspot.text,
            createTourHotspot: function(args) {
                const div = document.createElement('div');
                div.className = 'pnlm-hotspot pnlm-scene-hotspot';
                div.innerHTML = '<i class="fas fa-arrow-right"></i>';
                return div;
            },
            clickHandlerFunc: function() {
                goToScene(hotspot.scene);
            }
        };
    }
    
    return {
        ...base,
        type: 'info',
        text: hotspot.text,
        clickHandlerFunc: function() {
            alert(hotspot.text);
        }
    };
}

// Navigation functions
function goToScene(index) {
    if (index < 0 || index >= scenes.length || index === currentScene) return;
    
    currentScene = index;
    
    if (viewer) {
        viewer.destroy();
    }
    
    initViewer();
    
    // Scroll to tour
    document.getElementById('tour').scrollIntoView({ behavior: 'smooth' });
}

function nextScene() {
    const next = (currentScene + 1) % scenes.length;
    goToScene(next);
}

function previousScene() {
    const prev = (currentScene - 1 + scenes.length) % scenes.length;
    goToScene(prev);
}

// Start tour (el viewer ya está cargado al entrar — solo hace scroll)
function startTour() {
    document.getElementById('tour').scrollIntoView({ behavior: 'smooth' });
}

// Fullscreen
function toggleFullscreen() {
    const container = document.querySelector('.tour-viewer-wrap');
    
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Update UI
function updateSceneInfo() {
    const scene = scenes[currentScene];
    document.getElementById('scene-title').textContent = scene.title;
    document.getElementById('scene-description').textContent = scene.description;
    document.getElementById('current-scene').textContent = currentScene + 1;
    document.getElementById('total-scenes').textContent = scenes.length;
}

function updateSceneSelector() {
    const cards = document.querySelectorAll('.tour-scene-card');
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentScene);
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextScene();
    if (e.key === 'ArrowLeft') previousScene();
    if (e.key === 'Escape' && document.fullscreenElement) {
        document.exitFullscreen();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Cargar el viewer automáticamente apenas entra la página
    // (sin necesidad de hacer clic en "Iniciar Tour")
    if (typeof pannellum !== 'undefined' && !viewer) {
        initViewer();
    }
});