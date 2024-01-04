//Variables de modelado
var scene, renderer, camera, model;
var textures = ["https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/tatami.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/azul.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/algodon.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/rubi.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/gold.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/pocket.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/pared.txt",
"https://raw.githubusercontent.com/Juanjoposi/Practica-Final-Robot/main/textures/roof.txt"];

//Controles del Robot
var controls;
var key_up = false;
var key_down = false;
var key_left = false;
var key_right = false;
var key_camera_left = false;
var key_camera_right = false;
var key_space = false;



/**
 * Funcion de inicio
 **/
function init() {

    //Event controlers
    window.addEventListener('keydown', handleKeyDown, true)
    window.addEventListener('keyup', handleKeyUp, true)

    //Escena
    scene = new THREE.Scene();

    //Camara
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    //Render con tamaño ajustado a la ventana
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xD2B48C));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    //Suelo
    var planeGeometry = new THREE.PlaneGeometry(200, 200, 1, 1);
    var planeMaterial = new THREE.MeshPhongMaterial({
        color: 0x333333, map: getTexture(textures[0])
    });
    var suelo = new THREE.Mesh(planeGeometry, planeMaterial);
    suelo.position.set(0,0,0);
    suelo.rotation.x-=Math.PI/2;
    suelo.castShadow = true;
    suelo.receiveShadow = true;
    scene.add(suelo);

    //MODELADO DEL ROBOT

    model = new THREE.Object3D();
    scene.add(model);
    // Cabeza
    var headGroup = createHead();
    headGroup.position.set(0, 15, 0);

    // Cuerpo
    var bodyGroup = createBody();
    bodyGroup.position.set(0, 6, 0);

    //Brazos
    var armsAndHandsGroup = createArmsAndHands();
    bodyGroup.add(armsAndHandsGroup);

    //Zapatos
    var shoesGroup = createShoes();
    bodyGroup.add(shoesGroup);

    //Camara
    camera.position.set(-30, 30, 60);
    camera.lookAt(model.position);

    // Paredes
    var wallTexture = getTexture(textures[6]); 
    var wallMaterial = new THREE.MeshPhongMaterial({
        map: wallTexture,
        side: THREE.DoubleSide // Textura visible desde ambos lados
    });

    // Pared lateral izquierda
    var leftWallGeometry = new THREE.PlaneGeometry(200, 100);
    var leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-100, 50, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Pared lateral derecha
    var rightWallGeometry = new THREE.PlaneGeometry(200, 100);
    var rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(100, 50, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);
    
    // Pared posterior (conexión entre las paredes laterales)
    var backWallConnectionGeometry = new THREE.PlaneGeometry(200, 100);
    var backWallConnection = new THREE.Mesh(backWallConnectionGeometry, wallMaterial);
    backWallConnection.position.set(0, 50, -100);
    backWallConnection.rotation.y = Math.PI;
    scene.add(backWallConnection);

    // Pared frontal (conexión entre las paredes laterales)
    var frontWallConnectionGeometry = new THREE.PlaneGeometry(200, 100);
    var frontWallConnection = new THREE.Mesh(frontWallConnectionGeometry, wallMaterial);
    frontWallConnection.position.set(0, 50, 100);
    scene.add(frontWallConnection);

    // Techo
    var ceilingGeometry = new THREE.PlaneGeometry(200, 200);
    var ceilingMaterial = new THREE.MeshPhongMaterial({
        map: getTexture(textures[7]), // Textura del techo
        side: THREE.DoubleSide // Mostrar la textura en ambos lados
    });
    var techo = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    techo.position.set(0, 100, 0); // Coloca el techo arriba
    techo.rotation.x = Math.PI / 2; // Rota para que esté plano encima de las paredes
    scene.add(techo);

    // Luz ambiente rojo claro
    var ambientLight = new THREE.AmbientLight(0xff6347); 
    scene.add(ambientLight);

    // Luz direccional azul claro
    var spotLight = new THREE.DirectionalLight(0xadd8e6,1); 
    spotLight.position.set(0, 80, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);  
    
    
    //Sombreado
    spotLight.shadow.mapSize.width = 5120; // default
    spotLight.shadow.mapSize.height = 5120; // default
    spotLight.shadow.camera.near = 0.1; // default
    spotLight.shadow.camera.far = 500; // default
    spotLight.shadow.camera.top = -100 // default
    spotLight.shadow.camera.right = 100 // default
    spotLight.shadow.camera.left = -100 // default
    spotLight.shadow.camera.bottom = 100 // default

    document.getElementById("container").appendChild(renderer.domElement);

    createControls();

    renderer.render(scene, camera);
}

/**
 * createHead(): Crea los elementos que forman la cabeza del robot
 **/


function createHead() {
    var headGroup = new THREE.Object3D();
    headGroup.name = "head";
    model.add(headGroup);

    // Cabeza redonda
    var sphereHead = new THREE.SphereGeometry(6, 32, 32);
    var sphereMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0.9,
        roughness: 0.5,
        reflectivity: 0.8,
        map: getTexture(textures[1])
    });
    var head = new THREE.Mesh(sphereHead, sphereMaterial);
    head.castShadow = true;
    headGroup.add(head);

    // Nariz
    var noseGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    var noseMaterial = new THREE.MeshPhysicalMaterial({
        map: getTexture(textures[3]),
        metalness: 0.9,
        roughness: 0.5
    });
    var nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(0, 2, 5.7); // Posición ajustada para centrar la nariz en la cara
    headGroup.add(nose);

    // Ojos
    var eyeWhiteGeometry = new THREE.CircleGeometry(1.5, 32);
    var eyeWhiteMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    var eyeBlackGeometry = new THREE.CircleGeometry(0.8, 32);
    var eyeBlackMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    });

    var eye1 = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    eye1.position.set(-2, 3, 5.5);
    headGroup.add(eye1);

    var eye2 = new THREE.Mesh(eyeWhiteGeometry, eyeWhiteMaterial);
    eye2.position.set(2, 3, 5.5);
    headGroup.add(eye2);

    var eye1Inner = new THREE.Mesh(eyeBlackGeometry, eyeBlackMaterial);
    eye1Inner.position.set(-2, 3, 5.7);
    headGroup.add(eye1Inner);

    var eye2Inner = new THREE.Mesh(eyeBlackGeometry, eyeBlackMaterial);
    eye2Inner.position.set(2, 3, 5.7);
    headGroup.add(eye2Inner);

    // Gorrocoptero
    var gorroGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 3);
    var gorroMaterial = new THREE.MeshPhysicalMaterial({
        map: getTexture(textures[4]),
        metalness: 0.9,
        roughness: 0.5
    });
    var gorro = new THREE.Mesh(gorroGeometry, gorroMaterial);
    gorro.position.set(0, 7, 0); // Ajuste para colocar el gorro justo encima de la cabeza
    headGroup.add(gorro);


    // Hélices 
    var bladeGeometry = new THREE.BoxGeometry(0.1, 1, 0.2); 
    var bladeMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff 
    });

    for (let i = 0; i < 2; i++) {
        var blade1 = new THREE.Mesh(bladeGeometry, bladeMaterial);
        var blade2 = new THREE.Mesh(bladeGeometry, bladeMaterial);
    
        // Posicionar y rotar las aspas de la hélice
        blade1.position.set(0.25, 8, i === 0 ? -0.5 : 0.5); // Ajustar la posición
        blade1.rotation.x = Math.PI / 2; // Rotar la cuchilla para que se vea de frente
        headGroup.add(blade1);
    
        blade2.position.set(-0.25, 8, i === 0 ? -0.5 : 0.5); // Ajustar la posición
        blade2.rotation.x = Math.PI / 2; // Rotar la cuchilla para que se vea de frente
        headGroup.add(blade2);
    }

    // Boca
    var mouthGeometry = new THREE.CylinderGeometry(1.5, 1.5, 1, 32); 

    var mouthMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xFF0000, // Color de la boca
        metalness: 0.9,
        roughness: 0.5,
        reflectivity:1,
        map: getTexture(textures[3])
    });

    var mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, 0, 5); 
    headGroup.add(mouth); 

    // Posición de la nariz
    var nosePosition = new THREE.Vector3(0, 0, 4.5);

    // Dirección hacia la que apunta la luz (al frente de la nariz)
    var frontOfNose = new THREE.Vector3(0, 0, -5); // hacia adelante 

    // Crear luz tipo Spotlight desde la nariz
    var spotLightNose = new THREE.SpotLight(0xffffff, 3);
    spotLightNose.position.copy(nosePosition);
    spotLightNose.target.position.copy(frontOfNose); // Establecer el objetivo al frente de la nariz
    spotLightNose.distance = 300; // Distancia de iluminación
    spotLightNose.angle = Math.PI / 5; // Ángulo de apertura del cono de luz
    spotLightNose.penumbra = 0.6; // Suavidad del borde del cono de luz

    headGroup.add(spotLightNose);

    return headGroup;
}

/**
 * creteBody(): Crear cuerpo
 **/
function createBody() {
    var bodyGroup = new THREE.Object3D();
    bodyGroup.name = "body";
    model.add(bodyGroup);

    // Texturas para cada sección
    var BodyTexture = getTexture(textures[1]); 
    var beltTexture = getTexture(textures[3]); 
    var bellTexture = getTexture(textures[4]);
    var pocketTexture = getTexture(textures[2]);
    var tailTexture = getTexture(textures[3]);

    var bodyMaterial = new THREE.MeshBasicMaterial({
        color: 0xBDAC9A,
        metalness: 0.5,
        reflectivity: 0,
        map: BodyTexture
    });


    // Crear cilindro completo como cuerpo
    var bodyGeometry = new THREE.CylinderGeometry(5, 5, 12, 20); 
    var body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    body.rotation.x = Math.PI; 

    bodyGroup.add(body);

    // Collar
    var beltUpperGeometry = new THREE.TorusGeometry(5, 0.2, 8, 32);
    var beltMaterial = new THREE.MeshBasicMaterial({
        color: 0xBDAC9A,
        metalness: 1,
        reflectivity: 0.8,
        map: beltTexture
    });

    var beltUpper = new THREE.Mesh(beltUpperGeometry, beltMaterial);
    beltUpper.rotation.x = Math.PI / 2;
    beltUpper.position.y = 5.5; // Ajustar la posición del cinturón superior
    bodyGroup.add(beltUpper);

    // Cascabel
    var bellGeometry = new THREE.SphereGeometry(0.5, 20, 20); // Geometría esférica para el cascabel
    var bellMaterial = new THREE.MeshPhongMaterial({
        reflectivity: 0.8,
        map: bellTexture}); 

    var bell = new THREE.Mesh(bellGeometry, bellMaterial);
    bell.position.set(0, 5.5, 5); 

    bodyGroup.add(bell); 

    // Bolsillo
    var pocketGeometry = new THREE.CylinderGeometry(3, 1, 3, 32); 

    var pocketMaterial = new THREE.MeshPhysicalMaterial({
        metalness: 0.9,
        roughness: 0.5,
        reflectivity:1,
        map: pocketTexture
    });

    var pocket = new THREE.Mesh(pocketGeometry, pocketMaterial);
    pocket.position.set(0, 0, 5); 
    bodyGroup.add(pocket); 

    // Cola
    var tailGeometry = new THREE.SphereGeometry(1, 20, 20); 
    var tailMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        map: tailTexture,
    });
    var tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(0, -5, -5); 
    bodyGroup.add(tail); 

    return bodyGroup;
}


/**
 * createArmsAndHands(): Crear brazos y manos
 **/

function createArmsAndHands() {
    var armsAndHandsGroup = new THREE.Object3D();

    // Material Brazos
    var armTexture = getTexture(textures[1]); 
    var armMaterial = new THREE.MeshBasicMaterial({
        map: armTexture
    });

    // Material Manosanos
    var handTexture = getTexture(textures[2]); 
    var handMaterial = new THREE.MeshBasicMaterial({
        map: handTexture
    });

    // Brazo izquierdo
    var leftArmGeometry = new THREE.CylinderGeometry(1, 1, 8, 20); // Ajustar el tamaño del brazo
    var leftArm = new THREE.Mesh(leftArmGeometry, armMaterial); // Asigna el material del brazo
    leftArm.position.set(-5, 7, 4); // Posiciona el brazo a la izquierda del cuerpo hacia adelante
    leftArm.rotation.x = Math.PI / 6; // Inclinar el brazo hacia arriba
    armsAndHandsGroup.add(leftArm);

    // Mano izquierda
    var leftHandGeometry = new THREE.SphereGeometry(1.8, 32, 32); // Ajustar el tamaño de la mano
    var leftHand = new THREE.Mesh(leftHandGeometry, handMaterial); // Asigna el material de la mano
    leftHand.position.set(-5, 11.6, 7); // Posiciona la mano en la parte superior del brazo izquierdo
    armsAndHandsGroup.add(leftHand);

    // Brazo derecho
    var rightArmGeometry = new THREE.CylinderGeometry(1, 1, 8, 20); // Ajustar el tamaño del brazo
    var rightArm = new THREE.Mesh(rightArmGeometry, armMaterial); // Asigna el material del brazo
    rightArm.position.set(5, 7, 4); // Posiciona el brazo a la derecha del cuerpo hacia adelante
    rightArm.rotation.x = Math.PI / 6; // Inclinar el brazo hacia arriba
    armsAndHandsGroup.add(rightArm);

    // Mano derecha
    var rightHandGeometry = new THREE.SphereGeometry(1.8, 32, 32); // Ajustar el tamaño de la mano
    var rightHand = new THREE.Mesh(rightHandGeometry, handMaterial); // Asigna el material de la mano
    rightHand.position.set(5, 11.6, 7); // Posiciona la mano en la parte superior del brazo derecho
    armsAndHandsGroup.add(rightHand);

    return armsAndHandsGroup;
}


/**
 * createShoes(): Crea los zapatos
 **/

function createShoes() {
    var shoesGroup = new THREE.Object3D();

    // Zapato izquierdo

    var leftShoeTexture = getTexture(textures[2]);
    var leftShoeMaterial = new THREE.MeshBasicMaterial({ map: leftShoeTexture });

    
    var leftShoeGeometry = new THREE.CylinderGeometry(2, 2, 1, 20);
    var leftShoeMaterial = new THREE.MeshBasicMaterial({ map: leftShoeTexture });
    var leftShoe = new THREE.Mesh(leftShoeGeometry, leftShoeMaterial);
    leftShoe.position.set(-2.5, -6, 3); // Ajustar la posición en Y y Z para el zapato izquierdo
    shoesGroup.add(leftShoe);

    // Zapato derecho
    var rightShoeTexture = getTexture(textures[2]);
    var rightShoeMaterial = new THREE.MeshBasicMaterial({ map: rightShoeTexture });

    var rightShoeGeometry = new THREE.CylinderGeometry(2, 2, 1, 20);
    var rightShoeMaterial = new THREE.MeshBasicMaterial({ map: rightShoeTexture });
    var rightShoe = new THREE.Mesh(rightShoeGeometry, rightShoeMaterial);
    rightShoe.position.set(2.5, -6, 3); // Ajustar la posición en Y y Z para el zapato derecho
    shoesGroup.add(rightShoe);

    return shoesGroup;
}


/**
 * getTexture(url): Cambia la imagen en formato base64 a textura
 **/
function getTexture(url){
    var image = new Image();
    fetch(url).then(function(response) {
        return response.text().then(function(text){
            image.src = 'data:image/png;base64,'+text;
        })
    });
    var texture = new THREE.Texture();
    texture.image = image;
    image.onload = function() {
        texture.needsUpdate = true;
    };

    return texture;
}

/**
 * createControls(): Controles de cámara
 **/
function createControls() {

    controls = new OrbitControls( camera, renderer.domElement );

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.5;
    controls.keys = [ 65, 83, 68 ];

}

/**
 * degToRad(degrees): Grados a radianes
 **/
function degToRad(degrees) {
        return degrees * Math.PI / 180;
}

/**
 * animate(): Animar la imagen
 **/
function animate() {

    requestAnimationFrame( animate );
    controls.update();
    movementHandler();
    render();
}

/**
 * movementHandler(): Controles de movimiento del robot
 **/
function movementHandler(){
    var head = scene.getObjectByName("head");
    if (key_left){
        model.rotation.y += 0.025;
    }
    if (key_right){
        model.rotation.y -= 0.025;
    }
    if (key_up){
        var direction = new THREE.Vector3();
        model.getWorldDirection(direction);
        model.position.add(direction.multiplyScalar(0.25));
    }
    if (key_down){
        var direction = new THREE.Vector3();
        model.getWorldDirection(direction);
        model.position.add(direction.multiplyScalar(-0.25));
    }
    if (key_camera_left){
        head.rotation.y += 0.04;
    }
    if (key_camera_right){
        head.rotation.y -= 0.04;
    }
}

/**
 * handleKeyDown(event): Controla que una tecla esté pulsada
 **/
function handleKeyDown(event)
    {
        if (event.keyCode == 65) 
            key_left = true;
        else if (event.keyCode == 87)
            key_up = true;
        else if (event.keyCode == 83)
            key_down = true;
        else if (event.keyCode == 68)
            key_right = true;
        else if (event.keyCode == 81)
            key_camera_left = true;
        else if (event.keyCode == 69)
            key_camera_right = true;
    }
/**
 * handleKeyUp(event): Controla si la tecla no es pulsada
 **/
function handleKeyUp(event)
    {
        if (event.keyCode == 65) 
            key_left = false;
        else if (event.keyCode == 87)
            key_up = false;
        else if (event.keyCode == 83)
            key_down = false;
        else if (event.keyCode == 68)
            key_right = false;
        else if (event.keyCode == 81)
            key_camera_left = false;
        else if (event.keyCode == 69)
            key_camera_right = false;
    }


/**
 * Salto del robot
 **/

window.addEventListener('keydown', function(event) {
    if (event.keyCode == 32) {
        key_space = true;
        jump(); // Llamar a la función de salto cuando se presiona la barra espaciadora
    }
}, true);

window.addEventListener('keyup', function(event) {
    if (event.keyCode == 32) {
        key_space = false;
    }
}, true);


/**
 * jump(): Inicializa el salto
 **/

function jump() {
    if (model.position.y <= 0) { //Controla que este en el suelo
        var initialY = model.position.y;
        var jumpHeight = 10;
        var jumpDuration = 1000;
        var startTime = Date.now();

        animateJump(initialY, jumpHeight, jumpDuration, startTime);
    }
}

/**
 * animateJump(initialY, jumpHeight, jumpDuration, startTime): Realiza el efecto del salto del robot
 **/


function animateJump(initialY, jumpHeight, jumpDuration, startTime) {
    var currentTime = Date.now();
    var elapsedTime = currentTime - startTime;
    var progress = elapsedTime / jumpDuration;

    if (progress < 1) {
        model.position.y = initialY + jumpHeight * Math.sin(progress * Math.PI);
        requestAnimationFrame(function() {
            animateJump(initialY, jumpHeight, jumpDuration, startTime);
        });
    } else {
        model.position.y = initialY;
    }
}

/**
 * Render de la escena
 **/
function render() {
    renderer.render( scene, camera );
}




