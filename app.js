// B-17 Interior Compartment Data
// Maps the actual layout of a B-17 Flying Fortress
const compartments = {
    'nose': {
        name: 'Waist Compartment',
        description: 'Side-opening section containing two waist gun positions (left and right). Originally open windows; later fitted with staggered gun stations to reduce crowding. Crew defended against attacking fighters from the rear and sides.',
        image: 'images/B17-Interior1.jpg', // Replace with actual image path
        connections: {
            'forward': null, // Front of aircraft
            'aft': 'cockpit' // Back to cockpit
        },
        interactiveItems: [
            { yaw: -88, pitch: 25, name: 'Browning M2 .50 caliber machine gun', description: 'The B-17 used Browning M2 .50 caliber machine guns, air-cooled and belt-fed, firing about 750–850 rpm. They provided strong defensive fire from multiple turret and window positions around the bomber.' },
            { yaw: 45, pitch: 7, name: 'Browning M2 .50 caliber machine gun', description: 'The B-17 used Browning M2 .50 caliber machine guns, air-cooled and belt-fed, firing about 750–850 rpm. They provided strong defensive fire from multiple turret and window positions around the bomber.' },
            { yaw: 91, pitch: -19, name: 'Crew Oxygen Bottles', description: 'Stored compressed oxygen to supply crew masks during high-altitude missions, preventing hypoxia and keeping airmen operational.' },
            { yaw: 29, pitch: 6, name: 'Main Oxygen Storage', description: 'Primary high-capacity oxygen tank that supplied breathable oxygen to crew members during high-altitude missions. It fed the aircraft\'s oxygen system to prevent hypoxia and keep the crew functional.' },
            { yaw: 150, pitch: -20, name: 'Portable Oxygen Bottle', description: 'A small, carry-able oxygen tank used by crew when moving between stations at altitude, ensuring they remained supplied with oxygen away from the main system outlets.' }
        ]
    },
    'cockpit': {
        name: 'Radio Room',
        description: 'Where the radio operator worked and maintained long-range communications. Contained emergency equipment and a small escape hatch.',
        image: 'images/B17-Interior2.jpg', // Replace with actual image path
        connections: {
            'forward': 'nose',
            'aft': 'radio'
        },
    },
    'radio': {
        name: 'Bomb Bay',
        description: 'Central internal space carrying up to ~4,800 lbs of bombs. Features the one narrow catwalk, which crew had to cross during missions. Doors opened hydraulically to release bomb loads.',
        image: 'images/B17-Interior3.jpg', // Replace with actual image path
        connections: {
            'forward': 'cockpit',
            'aft': 'bomb-bay'
        },
    },
    'bomb-bay': {
        name: 'Bombardier/Nose Compartment',
        description: 'Houses the bombardier and navigator. Contains the Norden bombsight, forward guns, navigation table, and windows for spotting targets. Extremely cramped and exposed — one of the most vulnerable areas in combat.',
        image: 'images/B17-Interior4.jpg', // Replace with actual image path
        connections: {
            'forward': 'radio',
            'aft': 'waist-right',
            'port': 'waist-right',
            'starboard': 'waist-right'
        },
    },
    'waist-right': {
        name: 'Cockpit',
        description: 'Occupied by the pilot, co-pilot, and sometimes the flight engineer. Contains all flight controls, throttle quadrant, gauges, radios, and overhead systems. Directly behind this is the top-turret position (flight engineer operated the dorsal turret).',
        image: 'images/B17-Interior6.jpg', // Replace with actual image path
        connections: {
            'forward': 'bomb-bay',
            'aft': null,
            'port': 'bomb-bay'
        },
    },
};

// Application State
let currentCompartment = 'nose';
let viewer = null;
let navPanelVisible = true;
let currentLanguage = 'en'; // 'en' or 'es'
let hotspotsAdded = false;

// Translations
const translations = {
    en: {
        'nose': {
            name: 'Waist Compartment',
            description: 'Side-opening section containing two waist gun positions (left and right). Originally open windows; later fitted with staggered gun stations to reduce crowding. Crew defended against attacking fighters from the rear and sides.',
            interactiveItems: [
                { yaw: -88, pitch: 25, name: 'Browning M2 .50 caliber machine gun', description: 'The B-17 used Browning M2 .50 caliber machine guns, air-cooled and belt-fed, firing about 750–850 rpm. They provided strong defensive fire from multiple turret and window positions around the bomber.' },
                { yaw: 45, pitch: 7, name: 'Browning M2 .50 caliber machine gun', description: 'The B-17 used Browning M2 .50 caliber machine guns, air-cooled and belt-fed, firing about 750–850 rpm. They provided strong defensive fire from multiple turret and window positions around the bomber.' },
                { yaw: 91, pitch: -19, name: 'Crew Oxygen Bottles', description: 'Stored compressed oxygen to supply crew masks during high-altitude missions, preventing hypoxia and keeping airmen operational.' },
                { yaw: 29, pitch: 6, name: 'Main Oxygen Storage', description: 'Primary high-capacity oxygen tank that supplied breathable oxygen to crew members during high-altitude missions. It fed the aircraft\'s oxygen system to prevent hypoxia and keep the crew functional.' },
                { yaw: 150, pitch: -20, name: 'Portable Oxygen Bottle', description: 'A small, carry-able oxygen tank used by crew when moving between stations at altitude, ensuring they remained supplied with oxygen away from the main system outlets.' },
                { yaw: 6, pitch: 11, name: 'Ammunition Feed Chutes', description: 'Flexible steel belts feeding .50 cal rounds from ammo boxes to the guns.' },
                { yaw: 77, pitch: 24, name: 'Oxygen Regulator Panel', description: 'Controls and gauges for crew oxygen supply, with hose ports allowing airmen to plug in masks at high altitude.' }
            ]
        },
        'cockpit': {
            name: 'Radio Room',
            description: 'Where the radio operator worked and maintained long-range communications. Contained emergency equipment and a small escape hatch.',
            interactiveItems: [
                { yaw: -141, pitch: -19, name: 'Radio Operator\'s Station', description: 'The workspace where the radio operator managed communications and navigation messages during flight.' },
                { yaw: -158, pitch: -6, name: 'BC-348 Radio Receiver', description: 'Standard WWII bomber radio used for receiving communications and navigation signals.' },
                { yaw: -82, pitch: -9, name: 'Portable Oxygen Bottle', description: 'A small, carry-able oxygen tank used by crew when moving between stations at altitude, ensuring they remained supplied with oxygen away from the main system outlets.' },
                { yaw: -33, pitch: 65, name: 'Astrodome / Overhead Escape Hatch', description: 'A clear overhead dome in the radio/navigator area used for celestial navigation with a sextant, and also served as an emergency exit point for crew.' },
                { yaw: 9, pitch: -12, name: 'Command Radio Transmitter Stack', description: 'A set of WWII radio transmitters used by the radio operator to send long-range messages to base and other aircraft, forming the main communication link of the B-17.' },
                { yaw: 39, pitch: 2, name: 'Oxygen Regulator Panel', description: 'Controls and gauges for crew oxygen supply, with hose ports allowing airmen to plug in masks at high altitude.' },
                { yaw: 118, pitch: 23, name: 'SCR-274N Command Radio Receivers/Transmitters', description: 'A rack of tunable command set radios used for short-to-medium range communication between aircraft and with formation members.' },
                { yaw: 82, pitch: -20, name: 'Crew Oxygen Bottles', description: 'Stored compressed oxygen to supply crew masks during high-altitude missions, preventing hypoxia and keeping airmen operational.' }
            ]
        },
        'radio': {
            name: 'Bomb Bay',
            description: 'Central internal space carrying up to ~4,800 lbs of bombs. Features the one narrow catwalk, which crew had to cross during missions. Doors opened hydraulically to release bomb loads.',
            interactiveItems: [
                { yaw: -58, pitch: 44, name: 'M64 500-lb General Purpose Bomb', description: 'A standard WWII high-explosive bomb used against buildings, vehicles, and fortifications, commonly carried in B-17 bomb bays.' },
                { yaw: -143, pitch: 28, name: 'Bomb Bay Catwalk', description: 'Narrow walkway running through the bomb bay, allowing crew to pass between front and rear sections of the B-17 during flight.' }
            ]
        },
        'bomb-bay': {
            name: 'Bombardier/Nose Compartment',
            description: 'Houses the bombardier and navigator. Contains the Norden bombsight, forward guns, navigation table, and windows for spotting targets. Extremely cramped and exposed — one of the most vulnerable areas in combat.',
            interactiveItems: [
                { yaw: -166, pitch: 0, name: 'Ammunition Feed Chutes', description: 'Flexible steel belts feeding .50 cal rounds from ammo boxes to the guns.' },
                { yaw: 154, pitch: 49, name: 'Browning M2 .50 caliber machine gun', description: 'The B-17 used Browning M2 .50 caliber machine guns, air-cooled and belt-fed, firing about 750–850 rpm. They provided strong defensive fire from multiple turret and window positions around the bomber.' },
                { yaw: -124, pitch: 24, name: 'Browning M2 .50 caliber machine gun', description: 'The B-17 used Browning M2 .50 caliber machine guns, air-cooled and belt-fed, firing about 750–850 rpm. They provided strong defensive fire from multiple turret and window positions around the bomber.' },
                { yaw: -150, pitch: 7, name: 'Bombardier\'s Seat', description: 'Fold-down seat where the bombardier sat while operating the Norden bombsight.' },
                { yaw: -105, pitch: 43, name: 'Portable Oxygen Bottle', description: 'A small, carry-able oxygen tank used by crew when moving between stations at altitude, ensuring they remained supplied with oxygen away from the main system outlets.' },
                { yaw: 130, pitch: 8, name: 'Portable Oxygen Bottle', description: 'A small, carry-able oxygen tank used by crew when moving between stations at altitude, ensuring they remained supplied with oxygen away from the main system outlets.' },
                { yaw: -24, pitch: -29, name: 'Crew Oxygen Bottles', description: 'Stored compressed oxygen to supply crew masks during high-altitude missions, preventing hypoxia and keeping airmen operational.' },
                { yaw: 144, pitch: -20, name: 'Crew Oxygen Bottles', description: 'Stored compressed oxygen to supply crew masks during high-altitude missions, preventing hypoxia and keeping airmen operational.' },
                { yaw: 6, pitch: -7, name: 'Main Oxygen Storage', description: 'Primary high-capacity oxygen tank that supplied breathable oxygen to crew members during high-altitude missions. It fed the aircraft\'s oxygen system to prevent hypoxia and keep the crew functional.' },
                { yaw: -37, pitch: 33, name: 'BC-745/ARC-5 Radio Compass Receiver', description: 'Automatic direction-finding radio used for navigation, helping the crew locate beacons and home back to base.' },
                { yaw: 84, pitch: 71, name: 'Oxygen Regulator Panel', description: 'Controls and gauges for crew oxygen supply, with hose ports allowing airmen to plug in masks at high altitude.' },
                { yaw: 104, pitch: 18, name: 'Drift Meter', description: 'Optical navigation device used by the navigator/bombardier to measure wind drift and adjust the aircraft\'s course for accurate bombing and navigation.' }
            ]
        },
        'waist-right': {
            name: 'Cockpit',
            description: 'Occupied by the pilot, co-pilot, and sometimes the flight engineer. Contains all flight controls, throttle quadrant, gauges, radios, and overhead systems. Directly behind this is the top-turret position (flight engineer operated the dorsal turret).',
            interactiveItems: [
                { yaw: 151, pitch: 90, name: 'Chin Turret Gun Position', description: 'Clear nose section housing the twin .50 caliber chin turret, giving the bomber forward defensive fire against head-on attacks.' },
                { yaw: 174, pitch: -24, name: 'Hydraulic Reservoir & Accumulator', description: 'Stores and pressurizes hydraulic fluid used to operate systems such as bomb bay doors, brakes, and other hydraulic components throughout the aircraft.' },
                { yaw: -53, pitch: -10, name: 'Engine/Flight Controls & Instrument Panel', description: 'Main control cluster for throttles, mixture, prop pitch, and gauges.' },
                { yaw: -80, pitch: -4, name: 'Pilot\'s Seat', description: 'Primary flight position responsible for controlling the aircraft, managing takeoff, landing, and in-flight handling.' },
                { yaw: -27, pitch: 3, name: 'Co-Pilot\'s Seat', description: 'Secondary flight position assisting with controls, engine management, navigation, and systems monitoring.' },
                { yaw: -112, pitch: -34, name: 'Main Oxygen Storage', description: 'Primary high-capacity oxygen tank that supplied breathable oxygen to crew members during high-altitude missions. It fed the aircraft\'s oxygen system to prevent hypoxia and keep the crew functional.' },
                { yaw: 19, pitch: -28, name: 'Main Oxygen Storage', description: 'Primary high-capacity oxygen tank that supplied breathable oxygen to crew members during high-altitude missions. It fed the aircraft\'s oxygen system to prevent hypoxia and keep the crew functional.' },
                { yaw: 129, pitch: -35, name: 'Bomb Bay Catwalk', description: 'Narrow walkway running through the bomb bay, allowing crew to pass between front and rear sections of the B-17 during flight.' },
                { yaw: -79, pitch: 40, name: 'AN-M8 Flare Pistol (Signal Gun)', description: 'Handheld pyrotechnic launcher used to fire flares for signaling, coordination, or emergency distress communication. It was stored near the cockpit or nose so the crew could fire it through designated signal ports or emergency openings.' },
                { yaw: -47, pitch: -54, name: 'Path to Nose Compartment', description: '', navigateTo: 'bomb-bay' }
            ]
        },
        nav: {
            hideMap: 'Hide Map',
            showMap: 'Show Map',
            switchToSpanish: 'Español',
            switchToEnglish: 'ENGLISH',
            title: 'B-17 Interior Map'
        }
    },
    es: {
        'nose': {
            name: 'Compartimiento de Ametralladoras de Costado',
            description: 'Sección lateral con dos posiciones de ametralladoras (izquierda y derecha). Originalmente tenía ventanillas abiertas; más tarde se les añadieron puestos de tiro escalonados para reducir el hacinamiento. La tripulación defendía el avión de los cazas enemigos que atacaban por los lados y la parte trasera.',
            interactiveItems: [
                { yaw: -88, pitch: 25, name: 'Ametralladora Browning M2 calibre .50', description: 'El B-17 utilizaba ametralladoras Browning M2 de calibre .50, enfriadas por aire y alimentadas por cinta, con una cadencia de 750–850 disparos por minuto. Proporcionaban defensa poderosa desde múltiples torretas y posiciones laterales del bombardero.' },
                { yaw: 45, pitch: 7, name: 'Ametralladora Browning M2 calibre .50', description: 'El B-17 utilizaba ametralladoras Browning M2 de calibre .50, enfriadas por aire y alimentadas por cinta, con una cadencia de 750–850 disparos por minuto. Proporcionaban defensa poderosa desde múltiples torretas y posiciones laterales del bombardero.' },
                { yaw: 91, pitch: -19, name: 'Botellas de Oxígeno para la Tripulación', description: 'Almacenaban oxígeno comprimido para suministrar máscaras a la tripulación durante misiones a gran altitud, previniendo la hipoxia y manteniendo operativos a los aviadores.' },
                { yaw: 29, pitch: 6, name: 'Almacenamiento Principal de Oxígeno', description: 'Tanque principal de alta capacidad que suministraba oxígeno respirable a los miembros de la tripulación durante misiones a gran altitud. Alimentaba el sistema de oxígeno de la aeronave para prevenir la hipoxia y mantener funcional a la tripulación.' },
                { yaw: 150, pitch: -20, name: 'Botella de Oxígeno Portátil', description: 'Un pequeño tanque de oxígeno portátil utilizado por la tripulación al moverse entre estaciones a gran altitud, asegurando que permanecieran abastecidos con oxígeno lejos de las salidas del sistema principal.' },
                { yaw: 6, pitch: 11, name: 'Tolvas de Alimentación de Munición', description: 'Cintas de acero flexibles que alimentan cartuchos calibre .50 desde las cajas de munición hasta las ametralladoras.' },
                { yaw: 77, pitch: 24, name: 'Panel Regulador de Oxígeno', description: 'Controles e indicadores para el suministro de oxígeno de la tripulación, con puertos de manguera que permitían a los aviadores conectar máscaras a gran altitud.' }
            ]
        },
        'cockpit': {
            name: 'Sala de Radio',
            description: 'Lugar donde trabajaba el operador de radio y mantenía las comunicaciones de largo alcance. Contenía equipo de emergencia y una pequeña escotilla de escape.',
            interactiveItems: [
                { yaw: -141, pitch: -19, name: 'Estación del Operador de Radio', description: 'El espacio de trabajo donde el operador de radio gestionaba las comunicaciones y mensajes de navegación durante el vuelo.' },
                { yaw: -158, pitch: -6, name: 'Receptor de Radio BC-348', description: 'Radio estándar de bombardero de la Segunda Guerra Mundial utilizada para recibir comunicaciones y señales de navegación.' },
                { yaw: -82, pitch: -9, name: 'Botella de Oxígeno Portátil', description: 'Un pequeño tanque de oxígeno portátil utilizado por la tripulación al moverse entre estaciones a gran altitud, asegurando que permanecieran abastecidos con oxígeno lejos de las salidas del sistema principal.' },
                { yaw: -33, pitch: 65, name: 'Astrodomo / Escotilla de Escape Superior', description: 'Una cúpula transparente superior en el área del radio/navegante utilizada para navegación celeste con un sextante, y que también servía como punto de salida de emergencia para la tripulación.' },
                { yaw: 9, pitch: -12, name: 'Conjunto de Transmisores de Radio de Comando', description: 'Un conjunto de transmisores de radio de la Segunda Guerra Mundial utilizados por el operador de radio para enviar mensajes de largo alcance a la base y a otras aeronaves, formando el enlace de comunicación principal del B-17.' },
                { yaw: 39, pitch: 2, name: 'Panel Regulador de Oxígeno', description: 'Controles e indicadores para el suministro de oxígeno de la tripulación, con puertos de manguera que permitían a los aviadores conectar máscaras a gran altitud.' },
                { yaw: 118, pitch: 23, name: 'Receptores/Transmisores de Radio de Comando SCR-274N', description: 'Un conjunto de radios de comando sintonizables utilizadas para comunicación de corto a medio alcance entre aeronaves y con miembros de la formación.' },
                { yaw: 82, pitch: -20, name: 'Botellas de Oxígeno para la Tripulación', description: 'Almacenaban oxígeno comprimido para suministrar máscaras a la tripulación durante misiones a gran altitud, previniendo la hipoxia y manteniendo operativos a los aviadores.' }
            ]
        },
        'radio': {
            name: 'Bodega de Bombas',
            description: 'Espacio interno central que transportaba hasta aproximadamente 4,800 libras de bombas. Contaba con una pasarela estrecha que la tripulación debía cruzar durante las misiones. Las compuertas se abrían hidráulicamente para liberar la carga de bombas.',
            interactiveItems: [
                { yaw: -58, pitch: 44, name: 'Bomba de Propósito General M64 de 500 libras', description: 'Una bomba explosiva estándar de la Segunda Guerra Mundial utilizada contra edificios, vehículos y fortificaciones, comúnmente transportada en las bodegas de bombas del B-17.' },
                { yaw: -143, pitch: 28, name: 'Pasarela de la Bodega de Bombas', description: 'Pasarela estrecha que atraviesa la bodega de bombas, permitiendo a la tripulación pasar entre las secciones delantera y trasera del B-17 durante el vuelo.' }
            ]
        },
        'bomb-bay': {
            name: 'Compartimiento del Bombardero/Sección de Nariz',
            description: 'Aloja al bombardero y al navegante. Contiene la mira Norden, ametralladoras frontales, la mesa de navegación y ventanillas para observar los objetivos. Es un espacio extremadamente reducido y expuesto — una de las zonas más vulnerables en combate.',
            interactiveItems: [
                { yaw: -166, pitch: 0, name: 'Tolvas de Alimentación de Munición', description: 'Cintas de acero flexibles que alimentan cartuchos calibre .50 desde las cajas de munición hasta las ametralladoras.' },
                { yaw: 154, pitch: 49, name: 'Ametralladora Browning M2 calibre .50', description: 'El B-17 utilizaba ametralladoras Browning M2 de calibre .50, enfriadas por aire y alimentadas por cinta, con una cadencia de 750–850 disparos por minuto. Proporcionaban defensa poderosa desde múltiples torretas y posiciones laterales del bombardero.' },
                { yaw: -124, pitch: 24, name: 'Ametralladora Browning M2 calibre .50', description: 'El B-17 utilizaba ametralladoras Browning M2 de calibre .50, enfriadas por aire y alimentadas por cinta, con una cadencia de 750–850 disparos por minuto. Proporcionaban defensa poderosa desde múltiples torretas y posiciones laterales del bombardero.' },
                { yaw: -150, pitch: 7, name: 'Asiento del Bombardero', description: 'Asiento plegable donde se sentaba el bombardero mientras operaba la mira Norden.' },
                { yaw: -105, pitch: 43, name: 'Botella de Oxígeno Portátil', description: 'Un pequeño tanque de oxígeno portátil utilizado por la tripulación al moverse entre estaciones a gran altitud, asegurando que permanecieran abastecidos con oxígeno lejos de las salidas del sistema principal.' },
                { yaw: 130, pitch: 8, name: 'Botella de Oxígeno Portátil', description: 'Un pequeño tanque de oxígeno portátil utilizado por la tripulación al moverse entre estaciones a gran altitud, asegurando que permanecieran abastecidos con oxígeno lejos de las salidas del sistema principal.' },
                { yaw: -24, pitch: -29, name: 'Botellas de Oxígeno para la Tripulación', description: 'Almacenaban oxígeno comprimido para suministrar máscaras a la tripulación durante misiones a gran altitud, previniendo la hipoxia y manteniendo operativos a los aviadores.' },
                { yaw: 144, pitch: -20, name: 'Botellas de Oxígeno para la Tripulación', description: 'Almacenaban oxígeno comprimido para suministrar máscaras a la tripulación durante misiones a gran altitud, previniendo la hipoxia y manteniendo operativos a los aviadores.' },
                { yaw: 6, pitch: -7, name: 'Almacenamiento Principal de Oxígeno', description: 'Tanque principal de alta capacidad que suministraba oxígeno respirable a los miembros de la tripulación durante misiones a gran altitud. Alimentaba el sistema de oxígeno de la aeronave para prevenir la hipoxia y mantener funcional a la tripulación.' },
                { yaw: -37, pitch: 33, name: 'Receptor de Brújula de Radio BC-745/ARC-5', description: 'Radio de búsqueda automática de dirección utilizada para navegación, ayudando a la tripulación a localizar balizas y regresar a la base.' },
                { yaw: 84, pitch: 71, name: 'Panel Regulador de Oxígeno', description: 'Controles e indicadores para el suministro de oxígeno de la tripulación, con puertos de manguera que permitían a los aviadores conectar máscaras a gran altitud.' },
                { yaw: 104, pitch: 18, name: 'Medidor de Deriva', description: 'Dispositivo de navegación óptico utilizado por el navegante/bombardero para medir la deriva del viento y ajustar el rumbo de la aeronave para un bombardeo y navegación precisos.' }
            ]
        },
        'waist-right': {
            name: 'Cabina de Pilotaje',
            description: 'Ocupada por el piloto, el copiloto y, a veces, el ingeniero de vuelo. Contiene todos los controles de vuelo, el cuadrante de aceleración, instrumentos, radios y sistemas superiores. Justo detrás se encuentra la posición de la torreta superior (operada por el ingeniero de vuelo).',
            interactiveItems: [
                { yaw: 151, pitch: 90, name: 'Posición de Ametralladora de la Torreta del Mentón', description: 'Sección frontal transparente que alberga la torreta gemela de calibre .50 del mentón, proporcionando al bombardero fuego defensivo frontal contra ataques frontales.' },
                { yaw: 174, pitch: -24, name: 'Depósito y Acumulador Hidráulico', description: 'Almacena y presuriza el fluido hidráulico utilizado para operar sistemas como las compuertas de la bodega de bombas, los frenos y otros componentes hidráulicos en toda la aeronave.' },
                { yaw: -53, pitch: -10, name: 'Controles de Motor/Vuelo y Panel de Instrumentos', description: 'Grupo principal de controles para aceleradores, mezcla, paso de hélice e indicadores.' },
                { yaw: -80, pitch: -4, name: 'Asiento del Piloto', description: 'Posición de vuelo principal responsable de controlar la aeronave, gestionando el despegue, aterrizaje y manejo en vuelo.' },
                { yaw: -27, pitch: 3, name: 'Asiento del Copiloto', description: 'Posición de vuelo secundaria que asiste con los controles, gestión del motor, navegación y monitoreo de sistemas.' },
                { yaw: -112, pitch: -34, name: 'Almacenamiento Principal de Oxígeno', description: 'Tanque principal de alta capacidad que suministraba oxígeno respirable a los miembros de la tripulación durante misiones a gran altitud. Alimentaba el sistema de oxígeno de la aeronave para prevenir la hipoxia y mantener funcional a la tripulación.' },
                { yaw: 19, pitch: -28, name: 'Almacenamiento Principal de Oxígeno', description: 'Tanque principal de alta capacidad que suministraba oxígeno respirable a los miembros de la tripulación durante misiones a gran altitud. Alimentaba el sistema de oxígeno de la aeronave para prevenir la hipoxia y mantener funcional a la tripulación.' },
                { yaw: 129, pitch: -35, name: 'Pasarela de la Bodega de Bombas', description: 'Pasarela estrecha que atraviesa la bodega de bombas, permitiendo a la tripulación pasar entre las secciones delantera y trasera del B-17 durante el vuelo.' },
                { yaw: -79, pitch: 40, name: 'Pistola de Bengalas AN-M8 (Arma de Señal)', description: 'Lanzador pirotécnico portátil utilizado para disparar bengalas para señalización, coordinación o comunicación de emergencia. Se almacenaba cerca de la cabina o la nariz para que la tripulación pudiera dispararlo a través de puertos de señal designados o aberturas de emergencia.' },
                { yaw: -47, pitch: -54, name: 'Camino al Compartimiento de Nariz', description: '', navigateTo: 'bomb-bay' }
            ]
        },
        nav: {
            hideMap: 'Ocultar Mapa',
            showMap: 'Mostrar Mapa',
            switchToSpanish: 'Español',
            switchToEnglish: 'ENGLISH',
            title: 'Mapa Interior B-17'
        }
    }
};

// Initialize the application
function init() {
    setupEventListeners();
    initializeViewer();
    updateNavigation();
}

// Setup event listeners
function setupEventListeners() {
    // Compartment navigation items
    document.querySelectorAll('.compartment-item').forEach(item => {
        item.addEventListener('click', () => {
            const compartment = item.dataset.compartment;
            switchCompartment(compartment);
        });
    });

    // Toggle navigation panel
    document.getElementById('toggle-nav').addEventListener('click', toggleNavPanel);
    document.getElementById('toggle-nav-btn').addEventListener('click', toggleNavPanel);

    // Fullscreen toggle
    document.getElementById('toggle-fullscreen').addEventListener('click', toggleFullscreen);

    // Settings button
    document.getElementById('settings-btn').addEventListener('click', toggleLanguage);

    // Toggle description button
    document.getElementById('toggle-description').addEventListener('click', toggleDescription);

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Destroy existing viewer
function destroyViewer() {
    if (viewer) {
        try {
            viewer.destroy();
        } catch (e) {
            console.warn('Error destroying viewer:', e);
        }
        viewer = null;
    }
    // Clear the panorama container
    const container = document.getElementById('panorama');
    if (container) {
        container.innerHTML = '';
    }
}

// Initialize Pannellum viewer
function initializeViewer() {
    // Destroy existing viewer if it exists
    destroyViewer();
    
    // Set initial view based on compartment
    let initialPitch = 0;
    let initialYaw = 0;
    
    if (currentCompartment === 'radio') {
        // Bomb Bay opens centered on the bomb
        initialPitch = 44;
        initialYaw = -58;
    } else if (currentCompartment === 'waist-right') {
        // Cockpit opens at specified view
        initialPitch = 2;
        initialYaw = -54;
    } else if (currentCompartment === 'bomb-bay') {
        // Bombardier/Nose Compartment opens at specified view
        initialPitch = 18;
        initialYaw = -159;
    }
    
    const config = {
        type: 'equirectangular',
        panorama: compartments[currentCompartment].image,
        autoLoad: true,
        autoRotate: 0,
        compass: false,
        showControls: true,
        hfov: 100,
        minHfov: 50,
        maxHfov: 120,
        pitch: initialPitch,
        yaw: initialYaw
    };

    viewer = pannellum.viewer('panorama', config);
    
    // Ensure controls are visible
    setTimeout(() => {
        const controls = document.querySelector('.pnlm-controls');
        if (controls) {
            controls.style.display = 'block';
            controls.style.visibility = 'visible';
        }
    }, 100);
    
    viewer.on('load', () => {
        // Wait for scene to be fully loaded
        console.log('Load event fired for compartment:', currentCompartment);
        hotspotsAdded = false; // Reset flag on load
        setTimeout(() => {
            console.log('Load timeout: updating hotspots for', currentCompartment);
            updateHotspots();
            updateCompartmentInfo();
            setupMouseCoordinates();
            hotspotsAdded = true; // Mark as added after updateHotspots completes
        }, 500);
    });
    
    viewer.on('render', () => {
        // Also update hotspots on render to ensure they appear (only once, with delay)
        if (!hotspotsAdded) {
            setTimeout(() => {
                console.log('Render timeout: updating hotspots for', currentCompartment);
                updateHotspots();
                hotspotsAdded = true;
            }, 400);
        }
    });

    // Handle image load errors
    viewer.on('error', (error) => {
        console.warn('Image load error:', error);
        console.warn('Failed to load:', compartments[currentCompartment].image);
        // Show placeholder or error message
        showImageError();
    });
}

// Switch to a different compartment
function switchCompartment(compartmentId) {
    if (!compartments[compartmentId]) {
        console.error('Invalid compartment:', compartmentId);
        return;
    }

    currentCompartment = compartmentId;
    
    // Update navigation and info first
    updateNavigation();
    updateCompartmentInfo();
    
    // Recreate viewer with new panorama (most reliable method)
    destroyViewer();
    initializeViewer();
    
    // Reset hotspot tracking
    hotspotsAdded = false;
}

// Update navigation panel highlighting
function updateNavigation() {
    document.querySelectorAll('.compartment-item').forEach(item => {
        if (item.dataset.compartment === currentCompartment) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Update compartment info overlay
function updateCompartmentInfo() {
    const comp = compartments[currentCompartment];
    const lang = translations[currentLanguage];
    document.getElementById('compartment-title').textContent = lang[currentCompartment].name;
    document.getElementById('compartment-description').textContent = lang[currentCompartment].description;
}

// Toggle language between English and Spanish
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'es' : 'en';
    updateAllTexts();
    // Update hotspots with new language
    if (viewer) {
        updateHotspots();
    }
}

// Toggle description expand/collapse
let descriptionExpanded = true;

function toggleDescription() {
    descriptionExpanded = !descriptionExpanded;
    const container = document.getElementById('compartment-description-container');
    const button = document.getElementById('toggle-description');
    
    if (descriptionExpanded) {
        container.classList.remove('collapsed');
        button.classList.remove('collapsed');
        button.textContent = '▼';
    } else {
        container.classList.add('collapsed');
        button.classList.add('collapsed');
        button.textContent = '▶';
    }
}

// Update all text elements with current language
function updateAllTexts() {
    const lang = translations[currentLanguage];
    
    // Update navigation panel title
    document.querySelector('.nav-panel h2').textContent = lang.nav.title;
    
    // Update compartment names in navigation
    document.querySelectorAll('.compartment-item').forEach(item => {
        const compartmentId = item.dataset.compartment;
        const nameSpan = item.querySelector('.compartment-name');
        if (nameSpan && lang[compartmentId]) {
            nameSpan.textContent = lang[compartmentId].name;
        }
    });
    
    // Update toggle button
    const toggleBtn = document.getElementById('toggle-nav');
    toggleBtn.textContent = navPanelVisible ? lang.nav.hideMap : lang.nav.showMap;
    
    // Update settings button - show the language it will switch TO
    const settingsBtn = document.getElementById('settings-btn');
    const nameSpan = settingsBtn.querySelector('.compartment-name');
    if (nameSpan) {
        // Show the language we'll switch TO (opposite of current)
        if (currentLanguage === 'en') {
            nameSpan.textContent = lang.nav.switchToSpanish;
        } else {
            nameSpan.textContent = lang.nav.switchToEnglish;
        }
    }
    
    // Update compartment info
    updateCompartmentInfo();
}

// Update navigation hotspots
function updateHotspots() {
    if (!viewer) return;
    
    const comp = compartments[currentCompartment];
    
    // Remove all existing hotspots by getting the scene and removing each one
    try {
        const scene = viewer.getScene();
        if (scene && scene.hotSpots) {
            console.log(`Removing ${scene.hotSpots.length} existing hotspots`);
            // Create a copy of the array to avoid modification during iteration
            const hotspotsToRemove = [...scene.hotSpots];
            hotspotsToRemove.forEach((hotspot) => {
                if (hotspot.id) {
                    console.log(`Removing hotspot with id: ${hotspot.id}`);
                    viewer.removeHotSpot(hotspot.id);
                }
            });
        } else {
            console.log('No existing hotspots to remove');
        }
    } catch (e) {
        console.warn('Error removing hotspots:', e);
    }

    // Add interactive item hotspots (informational tooltips)
    // Get interactive items from translations based on current language
    const lang = translations[currentLanguage];
    const langComp = lang[currentCompartment];
    
    console.log(`updateHotspots called for compartment: ${currentCompartment}, language: ${currentLanguage}`);
    console.log('langComp:', langComp);
    
    if (langComp && langComp.interactiveItems) {
        console.log(`Adding ${langComp.interactiveItems.length} interactive items for ${currentCompartment}`);
        langComp.interactiveItems.forEach((item, index) => {
            // Ensure coordinates are numbers
            const yaw = parseFloat(item.yaw);
            const pitch = parseFloat(item.pitch);
            
            const hotspotId = `item-hotspot-${currentCompartment}-${index}`;
            console.log(`Adding hotspot ${index}: ${item.name} at yaw=${yaw}, pitch=${pitch}, id=${hotspotId}`);
            
            try {
                // Check if this is a navigation hotspot
                if (item.navigateTo) {
                    const targetCompartment = item.navigateTo;
                    const hotspotConfig = {
                        pitch: pitch,
                        yaw: yaw,
                        type: 'info',
                        text: `<strong>${item.name}</strong>${item.description ? '<br>' + item.description : ''}`,
                        id: hotspotId,
                        cssClass: 'item-hotspot nav-hotspot',
                        clickHandlerFunc: function(hotSpotDiv, args) {
                            switchCompartment(targetCompartment);
                        }
                    };
                    console.log('Navigation hotspot config:', hotspotConfig);
                    viewer.addHotSpot(hotspotConfig);
                    console.log(`Successfully added navigation hotspot ${index} to ${targetCompartment}`);
                } else {
                    const hotspotConfig = {
                        pitch: pitch,
                        yaw: yaw,
                        type: 'info',
                        text: `<strong>${item.name}</strong><br>${item.description}`,
                        id: hotspotId,
                        cssClass: 'item-hotspot'
                    };
                    console.log('Hotspot config:', hotspotConfig);
                    viewer.addHotSpot(hotspotConfig);
                    console.log(`Successfully added hotspot ${index}`);
                }
            } catch (e) {
                console.error(`Error adding hotspot ${index}:`, e);
            }
        });
    } else {
        console.log(`No interactive items found for ${currentCompartment} in language ${currentLanguage}`);
        if (langComp) {
            console.log('Available keys:', Object.keys(langComp));
        } else {
            console.log('langComp is null or undefined');
        }
    }
}

// Toggle navigation panel
function toggleNavPanel() {
    navPanelVisible = !navPanelVisible;
    const navPanel = document.querySelector('.nav-panel');
    const toggleBtn = document.getElementById('toggle-nav');
    
    if (navPanelVisible) {
        navPanel.classList.remove('hidden');
        toggleBtn.textContent = 'Hide Map';
    } else {
        navPanel.classList.add('hidden');
        toggleBtn.textContent = 'Show Map';
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error('Error attempting to enable fullscreen:', err);
        });
        document.body.classList.add('fullscreen');
    } else {
        document.exitFullscreen();
        document.body.classList.remove('fullscreen');
    }
}

// Handle keyboard shortcuts
function handleKeyboard(e) {
    // Escape to exit fullscreen or show nav
    if (e.key === 'Escape') {
        if (document.fullscreenElement) {
            toggleFullscreen();
        } else if (!navPanelVisible) {
            toggleNavPanel();
        }
    }
    
    // Number keys to switch compartments
    const compartmentKeys = {
        '1': 'nose',
        '2': 'cockpit',
        '3': 'radio',
        '4': 'bomb-bay',
        '5': 'waist-right'
    };
    
    if (compartmentKeys[e.key]) {
        switchCompartment(compartmentKeys[e.key]);
    }
    
    // M to toggle map
    if (e.key === 'm' || e.key === 'M') {
        toggleNavPanel();
    }
}

// Show image error message
function showImageError() {
    const info = document.getElementById('compartment-info');
    const desc = document.getElementById('compartment-description');
    const originalText = desc.textContent;
    desc.textContent = 'Image not found. Please ensure the image file exists at the specified path.';
    desc.style.color = '#ff6b6b';
    
    setTimeout(() => {
        desc.textContent = originalText;
        desc.style.color = '';
    }, 5000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        document.body.classList.remove('fullscreen');
    }
});

// Setup mouse coordinates tracking
let mouseMoveHandler = null;

function setupMouseCoordinates() {
    if (!viewer) return;
    
    const panoramaContainer = document.getElementById('panorama');
    const coordsDisplay = document.getElementById('mouse-coords');
    const yawValue = document.getElementById('yaw-value');
    const pitchValue = document.getElementById('pitch-value');
    
    if (!panoramaContainer || !coordsDisplay || !yawValue || !pitchValue) return;
    
    // Remove old event listener if it exists
    if (mouseMoveHandler) {
        panoramaContainer.removeEventListener('mousemove', mouseMoveHandler);
    }
    
    mouseMoveHandler = (e) => {
        if (!viewer) return;
        
        const rect = panoramaContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Get the canvas element from Pannellum
        const canvas = panoramaContainer.querySelector('canvas');
        if (!canvas) return;
        
        const canvasRect = canvas.getBoundingClientRect();
        const canvasX = e.clientX - canvasRect.left;
        const canvasY = e.clientY - canvasRect.top;
        
        // Calculate normalized coordinates (-1 to 1)
        const normalizedX = (canvasX / canvasRect.width) * 2 - 1;
        const normalizedY = (canvasY / canvasRect.height) * 2 - 1;
        
        // Get current view parameters
        const scene = viewer.getScene();
        const currentHfov = viewer.getHfov();
        const currentPitch = viewer.getPitch();
        const currentYaw = viewer.getYaw();
        
        // Calculate yaw and pitch from mouse position
        // Yaw: horizontal angle (-180 to 180)
        const yaw = currentYaw + (normalizedX * currentHfov / 2);
        
        // Pitch: vertical angle (-90 to 90)
        const pitch = currentPitch - (normalizedY * currentHfov / 2);
        
        // Clamp pitch to valid range
        const clampedPitch = Math.max(-90, Math.min(90, pitch));
        
        // Update display
        if (yawValue) yawValue.textContent = Math.round(yaw);
        if (pitchValue) pitchValue.textContent = Math.round(clampedPitch);
    };
    
    // Add the event listener
    panoramaContainer.addEventListener('mousemove', mouseMoveHandler);
    
    // Hide coordinates when mouse leaves the panorama
    panoramaContainer.addEventListener('mouseleave', () => {
        if (coordsDisplay) {
            coordsDisplay.style.opacity = '0.5';
        }
    });
    
    panoramaContainer.addEventListener('mouseenter', () => {
        if (coordsDisplay) {
            coordsDisplay.style.opacity = '1';
        }
    });
}

