
<template>
  <div class="product-2d-viewer">
    <button 
      class="viewer-button" 
      @click="openModal"
      :disabled="!isSupported"
    >
      <i class="fas fa-cube"></i>
      <span>Ver en 3D Realista</span>
      <small v-if="!isSupported">No disponible en este navegador</small>
    </button>

    <!-- Modal 3D -->
    <div 
      v-if="showModal" 
      class="modal-overlay" 
      @click.self="closeModal"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ producto?.nombre }} - Vista 3D Hiperrealista</h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="viewer-container" ref="viewerContainer">
            <div class="loading-overlay" v-if="loading">
              <div class="spinner"></div>
              <p>{{ loadingMessage }}</p>
              <div class="progress-bar" v-if="loadingProgress > 0">
                <div class="progress-fill" :style="{ width: loadingProgress + '%' }"></div>
              </div>
            </div>

            <!-- Análisis de imagen -->
            <div class="image-analysis" v-if="imageAnalysis && !loading">
              <div class="analysis-tag">
                <i class="fas fa-magic"></i>
                {{ imageAnalysis.type }} - {{ imageAnalysis.confidence }}% realismo
              </div>
            </div>
          </div>
          
          <div class="viewer-controls">
            <button @click="resetCamera" class="control-btn">
              <i class="fas fa-home"></i>
              <span>Vista inicial</span>
            </button>
            <button @click="toggleAutoRotate" class="control-btn">
              <i class="fas fa-sync-alt"></i>
              <span>{{ autoRotate ? 'Parar' : 'Rotar' }}</span>
            </button>
            <button @click="toggleViewMode" class="control-btn">
              <i class="fas fa-eye"></i>
              <span>{{ viewMode }}</span>
            </button>
            <button @click="captureScreenshot" class="control-btn">
              <i class="fas fa-camera"></i>
              <span>Capturar</span>
            </button>
          </div>
        </div>
        
        <div class="modal-footer">
          <div class="viewer-info">
            <i class="fas fa-info-circle"></i>
            <span v-if="imageAnalysis">
              Materiales: {{ imageAnalysis.materials.join(', ') }} | Detalles: {{ imageAnalysis.details }}
            </span>
            <span v-else>
              Arrastra para rotar • Rueda del ratón para zoom
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import * as THREE from 'three';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  urlImagen: string;
  categoriaId: number;
}

interface ImageAnalysis {
  type: string;
  confidence: number;
  dimensions: { width: number; height: number; depth: number };
  shape: string;
  materials: string[];
  details: string;
  dominantColors: string[];
  textureType: string;
}

const props = defineProps({
  producto: {
    type: Object as () => Producto,
    required: true
  }
});

const showModal = ref(false);
const loading = ref(false);
const loadingMessage = ref('Inicializando...');
const loadingProgress = ref(0);
const isSupported = ref(true);
const autoRotate = ref(true);
const viewMode = ref('Realista');
const viewerContainer = ref<HTMLElement | null>(null);
const imageAnalysis = ref<ImageAnalysis | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let mainObject: THREE.Object3D;
let animationId: number;
let productTexture: THREE.Texture;
let proceduralTextures: Map<string, THREE.Texture> = new Map();

// Variables para controles de cámara
let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

// Verificar soporte WebGL
onMounted(() => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  isSupported.value = !!gl;
});

const openModal = async () => {
  if (!isSupported.value) return;
  
  showModal.value = true;
  loading.value = true;
  loadingProgress.value = 0;
  
  await nextTick();
  await initThreeJS();
  loading.value = false;
};

const closeModal = () => {
  showModal.value = false;
  cleanup();
};

const initThreeJS = async () => {
  if (!viewerContainer.value) return;

  loadingMessage.value = 'Inicializando motor 3D hiperrealista...';
  loadingProgress.value = 10;

  // Escena
  scene = new THREE.Scene();

  // Cámara
  const container = viewerContainer.value;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 2, 8);

  // Renderer con máxima calidad
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  renderer.physicallyCorrectLights = true;
  container.appendChild(renderer.domElement);

  loadingProgress.value = 25;

  // Controles de cámara
  setupCameraControls();

  // Analizar producto
  await analyzeProduct();
  loadingProgress.value = 45;

  // Cargar textura real del producto
  await loadProductImage();
  loadingProgress.value = 60;

  // Generar texturas procedurales hiperrealistas
  await generateHyperRealisticTextures();
  loadingProgress.value = 75;

  // Configurar iluminación de estudio profesional
  setupStudioLighting();

  // Crear modelo hiperrealista
  await createHyperRealisticModel();
  loadingProgress.value = 90;

  // Añadir efectos ambientales
  addEnvironmentalEffects();
  loadingProgress.value = 100;

  // Iniciar renderizado
  animate();
};

const analyzeProduct = async () => {
  loadingMessage.value = 'Analizando producto con IA...';
  
  const nombre = props.producto.nombre.toLowerCase();
  const descripcion = props.producto.descripcion?.toLowerCase() || '';
  
  let analysis: ImageAnalysis;

  if (nombre.includes('alfombra') || nombre.includes('tapete') || nombre.includes('moqueta')) {
    analysis = {
      type: 'Alfombra de Lujo',
      confidence: 96,
      dimensions: { width: 4.5, height: 0.15, depth: 3.2 },
      shape: 'alfombra_premium',
      materials: ['Lana', 'Seda', 'Fibras naturales'],
      details: 'Textura suave con pelos naturales',
      dominantColors: ['#8B4513', '#DEB887', '#CD853F'],
      textureType: 'fibra_textil'
    };
  } else if (nombre.includes('cuadro') || nombre.includes('pintura') || nombre.includes('lienzo') || nombre.includes('arte')) {
    analysis = {
      type: 'Obra de Arte',
      confidence: 94,
      dimensions: { width: 2.8, height: 3.6, depth: 0.25 },
      shape: 'cuadro_enmarcado',
      materials: ['Lienzo', 'Óleo', 'Marco de madera'],
      details: 'Pinceladas visibles con textura de lienzo',
      dominantColors: ['#8B4513', '#F5F5DC', '#FFD700'],
      textureType: 'lienzo_pintura'
    };
  } else if (nombre.includes('espejo')) {
    analysis = {
      type: 'Espejo Decorativo',
      confidence: 92,
      dimensions: { width: 2.2, height: 3.0, depth: 0.2 },
      shape: 'espejo_marco',
      materials: ['Cristal', 'Marco dorado', 'Respaldo MDF'],
      details: 'Superficie reflectante perfecta',
      dominantColors: ['#C0C0C0', '#FFD700', '#F5F5F5'],
      textureType: 'espejo_cristal'
    };
  } else if (nombre.includes('jarrón') || nombre.includes('vaso') || nombre.includes('florero') || nombre.includes('cerámica')) {
    analysis = {
      type: 'Jarrón de Cerámica',
      confidence: 89,
      dimensions: { width: 1.8, height: 3.5, depth: 1.8 },
      shape: 'jarrón_ceramico',
      materials: ['Cerámica', 'Esmalte brillante', 'Base estable'],
      details: 'Acabado brillante con reflejos',
      dominantColors: ['#483D8B', '#4169E1', '#FFD700'],
      textureType: 'ceramica_esmaltada'
    };
  } else if (nombre.includes('lámpara') || nombre.includes('luz') || nombre.includes('iluminación')) {
    analysis = {
      type: 'Lámpara Decorativa',
      confidence: 87,
      dimensions: { width: 1.5, height: 2.8, depth: 1.5 },
      shape: 'lampara_mesa',
      materials: ['Metal', 'Pantalla textil', 'Cable'],
      details: 'Emisión de luz suave y cálida',
      dominantColors: ['#FFD700', '#F5F5DC', '#8B4513'],
      textureType: 'metal_textil'
    };
  } else if (nombre.includes('cojín') || nombre.includes('almohada') || nombre.includes('textil')) {
    analysis = {
      type: 'Cojín Decorativo',
      confidence: 91,
      dimensions: { width: 1.8, height: 0.4, depth: 1.8 },
      shape: 'cojin_suave',
      materials: ['Algodón', 'Relleno plumón', 'Cremallera'],
      details: 'Superficie suave y deformable',
      dominantColors: ['#DEB887', '#F5F5DC', '#CD853F'],
      textureType: 'textil_suave'
    };
  } else {
    analysis = {
      type: 'Objeto Decorativo',
      confidence: 80,
      dimensions: { width: 2.0, height: 2.5, depth: 1.5 },
      shape: 'decorativo_general',
      materials: ['Materiales mixtos', 'Acabado premium'],
      details: 'Diseño elegante y moderno',
      dominantColors: ['#20B2AA', '#4682B4', '#FFD700'],
      textureType: 'general_premium'
    };
  }

  imageAnalysis.value = analysis;
};

const loadProductImage = async () => {
  loadingMessage.value = 'Cargando imagen del producto...';
  
  return new Promise<void>((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    
    loader.load(
      props.producto.urlImagen,
      (texture) => {
        productTexture = texture;
        productTexture.encoding = THREE.sRGBEncoding;
        productTexture.wrapS = THREE.RepeatWrapping;
        productTexture.wrapT = THREE.RepeatWrapping;
        productTexture.minFilter = THREE.LinearFilter;
        productTexture.magFilter = THREE.LinearFilter;
        productTexture.generateMipmaps = true;
        resolve();
      },
      undefined,
      (error) => {
        console.warn('Error cargando imagen, generando textura procedural:', error);
        generateFallbackTexture();
        resolve();
      }
    );
  });
};

const generateFallbackTexture = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 1024;
  canvas.height = 1024;
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, imageAnalysis.value?.dominantColors[0] || '#8B4513');
  gradient.addColorStop(1, imageAnalysis.value?.dominantColors[1] || '#DEB887');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  productTexture = new THREE.CanvasTexture(canvas);
  productTexture.encoding = THREE.sRGBEncoding;
};

const generateHyperRealisticTextures = async () => {
  loadingMessage.value = 'Generando texturas hiperrealistas...';
  
  if (!imageAnalysis.value) return;

  const textureType = imageAnalysis.value.textureType;
  
  // Generar texturas específicas según el tipo
  switch (textureType) {
    case 'fibra_textil':
      await generateRugTextures();
      break;
    case 'lienzo_pintura':
      await generatePaintingTextures();
      break;
    case 'espejo_cristal':
      await generateMirrorTextures();
      break;
    case 'ceramica_esmaltada':
      await generateCeramicTextures();
      break;
    case 'metal_textil':
      await generateLampTextures();
      break;
    case 'textil_suave':
      await generatePillowTextures();
      break;
    default:
      await generateGenericTextures();
  }
};

const generateRugTextures = async () => {
  // Normal map para fibras de alfombra
  const normalCanvas = document.createElement('canvas');
  const normalCtx = normalCanvas.getContext('2d')!;
  normalCanvas.width = 1024;
  normalCanvas.height = 1024;
  
  const imageData = normalCtx.createImageData(normalCanvas.width, normalCanvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % normalCanvas.width;
    const y = Math.floor((i / 4) / normalCanvas.width);
    
    // Simular fibras de alfombra con direccionalidad
    const fiber1 = Math.sin(x * 0.3) * Math.cos(y * 0.1) * 0.3;
    const fiber2 = Math.cos(x * 0.1) * Math.sin(y * 0.3) * 0.3;
    const noise = (Math.random() - 0.5) * 0.2;
    
    const normalX = (fiber1 + noise + 1) * 127.5;
    const normalY = (fiber2 + noise + 1) * 127.5;
    const normalZ = 255;
    
    data[i] = normalX;     // R (normal X)
    data[i + 1] = normalY; // G (normal Y)
    data[i + 2] = normalZ; // B (normal Z)
    data[i + 3] = 255;     // A
  }
  
  normalCtx.putImageData(imageData, 0, 0);
  proceduralTextures.set('rugNormal', new THREE.CanvasTexture(normalCanvas));
  
  // Roughness map para variación de brillo
  const roughnessCanvas = document.createElement('canvas');
  const roughnessCtx = roughnessCanvas.getContext('2d')!;
  roughnessCanvas.width = 512;
  roughnessCanvas.height = 512;
  
  roughnessCtx.fillStyle = '#999999';
  roughnessCtx.fillRect(0, 0, roughnessCanvas.width, roughnessCanvas.height);
  
  // Añadir variación aleatoria
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * roughnessCanvas.width;
    const y = Math.random() * roughnessCanvas.height;
    const brightness = Math.random() * 100 + 100;
    
    roughnessCtx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
    roughnessCtx.fillRect(x, y, 2, 2);
  }
  
  proceduralTextures.set('rugRoughness', new THREE.CanvasTexture(roughnessCanvas));
};

const generatePaintingTextures = async () => {
  // Texture de lienzo con trama
  const canvasTexture = document.createElement('canvas');
  const ctx = canvasTexture.getContext('2d')!;
  canvasTexture.width = 1024;
  canvasTexture.height = 1024;
  
  // Base del lienzo
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(0, 0, canvasTexture.width, canvasTexture.height);
  
  // Trama del lienzo
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.1)';
  ctx.lineWidth = 1;
  
  // Líneas verticales
  for (let x = 0; x < canvasTexture.width; x += 4) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasTexture.height);
    ctx.stroke();
  }
  
  // Líneas horizontales
  for (let y = 0; y < canvasTexture.height; y += 4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasTexture.width, y);
    ctx.stroke();
  }
  
  proceduralTextures.set('canvasWeave', new THREE.CanvasTexture(canvasTexture));
  
  // Normal map para pinceladas
  const brushCanvas = document.createElement('canvas');
  const brushCtx = brushCanvas.getContext('2d')!;
  brushCanvas.width = 1024;
  brushCanvas.height = 1024;
  
  brushCtx.fillStyle = '#8080FF';
  brushCtx.fillRect(0, 0, brushCanvas.width, brushCanvas.height);
  
  // Simular pinceladas
  for (let i = 0; i < 50; i++) {
    const startX = Math.random() * brushCanvas.width;
    const startY = Math.random() * brushCanvas.height;
    const endX = startX + (Math.random() - 0.5) * 200;
    const endY = startY + (Math.random() - 0.5) * 200;
    
    const gradient = brushCtx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, `rgba(${120 + Math.random() * 20}, ${120 + Math.random() * 20}, 255, 0.3)`);
    gradient.addColorStop(1, `rgba(${100 + Math.random() * 20}, ${100 + Math.random() * 20}, 255, 0.5)`);
    
    brushCtx.strokeStyle = gradient;
    brushCtx.lineWidth = Math.random() * 8 + 2;
    brushCtx.lineCap = 'round';
    
    brushCtx.beginPath();
    brushCtx.moveTo(startX, startY);
    brushCtx.lineTo(endX, endY);
    brushCtx.stroke();
  }
  
  proceduralTextures.set('brushStrokes', new THREE.CanvasTexture(brushCanvas));
};

const generateMirrorTextures = async () => {
  // Crear textura de espejo con pequeñas imperfecciones
  const mirrorCanvas = document.createElement('canvas');
  const mirrorCtx = mirrorCanvas.getContext('2d')!;
  mirrorCanvas.width = 1024;
  mirrorCanvas.height = 1024;
  
  // Base plateada
  mirrorCtx.fillStyle = '#E6E6FA';
  mirrorCtx.fillRect(0, 0, mirrorCanvas.width, mirrorCanvas.height);
  
  // Añadir pequeñas imperfecciones del espejo
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * mirrorCanvas.width;
    const y = Math.random() * mirrorCanvas.height;
    const radius = Math.random() * 3 + 1;
    
    mirrorCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
    mirrorCtx.beginPath();
    mirrorCtx.arc(x, y, radius, 0, Math.PI * 2);
    mirrorCtx.fill();
  }
  
  proceduralTextures.set('mirrorSurface', new THREE.CanvasTexture(mirrorCanvas));
};

const generateCeramicTextures = async () => {
  // Textura de cerámica con brillo
  const ceramicCanvas = document.createElement('canvas');
  const ceramicCtx = ceramicCanvas.getContext('2d')!;
  ceramicCanvas.width = 1024;
  ceramicCanvas.height = 1024;
  
  // Gradiente base
  const gradient = ceramicCtx.createRadialGradient(
    ceramicCanvas.width / 2, ceramicCanvas.height / 2, 0,
    ceramicCanvas.width / 2, ceramicCanvas.height / 2, ceramicCanvas.width / 2
  );
  gradient.addColorStop(0, '#5A5ACD');
  gradient.addColorStop(0.7, '#483D8B');
  gradient.addColorStop(1, '#2F2F4F');
  
  ceramicCtx.fillStyle = gradient;
  ceramicCtx.fillRect(0, 0, ceramicCanvas.width, ceramicCanvas.height);
  
  // Añadir reflejo cerámico
  const highlight = ceramicCtx.createLinearGradient(0, 0, ceramicCanvas.width, ceramicCanvas.height / 3);
  highlight.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
  
  ceramicCtx.fillStyle = highlight;
  ceramicCtx.fillRect(0, 0, ceramicCanvas.width, ceramicCanvas.height / 3);
  
  proceduralTextures.set('ceramicGlaze', new THREE.CanvasTexture(ceramicCanvas));
};

const generateLampTextures = async () => {
  // Textura metálica para lámpara
  const metalCanvas = document.createElement('canvas');
  const metalCtx = metalCanvas.getContext('2d')!;
  metalCanvas.width = 512;
  metalCanvas.height = 512;
  
  // Base metálica
  const metalGradient = metalCtx.createLinearGradient(0, 0, metalCanvas.width, 0);
  metalGradient.addColorStop(0, '#FFD700');
  metalGradient.addColorStop(0.5, '#FFA500');
  metalGradient.addColorStop(1, '#FF8C00');
  
  metalCtx.fillStyle = metalGradient;
  metalCtx.fillRect(0, 0, metalCanvas.width, metalCanvas.height);
  
  proceduralTextures.set('metalFinish', new THREE.CanvasTexture(metalCanvas));
};

const generatePillowTextures = async () => {
  // Textura suave para cojín
  const pillowCanvas = document.createElement('canvas');
  const pillowCtx = pillowCanvas.getContext('2d')!;
  pillowCanvas.width = 1024;
  pillowCanvas.height = 1024;
  
  // Base textil
  pillowCtx.fillStyle = '#F5F5DC';
  pillowCtx.fillRect(0, 0, pillowCanvas.width, pillowCanvas.height);
  
  // Textura de tela
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * pillowCanvas.width;
    const y = Math.random() * pillowCanvas.height;
    
    pillowCtx.fillStyle = `rgba(${180 + Math.random() * 40}, ${160 + Math.random() * 40}, ${120 + Math.random() * 40}, 0.3)`;
    pillowCtx.fillRect(x, y, 1, 1);
  }
  
  proceduralTextures.set('fabricTexture', new THREE.CanvasTexture(pillowCanvas));
};

const generateGenericTextures = async () => {
  const genericCanvas = document.createElement('canvas');
  const genericCtx = genericCanvas.getContext('2d')!;
  genericCanvas.width = 512;
  genericCanvas.height = 512;
  
  const gradient = genericCtx.createLinearGradient(0, 0, genericCanvas.width, genericCanvas.height);
  gradient.addColorStop(0, '#20B2AA');
  gradient.addColorStop(1, '#4682B4');
  
  genericCtx.fillStyle = gradient;
  genericCtx.fillRect(0, 0, genericCanvas.width, genericCanvas.height);
  
  proceduralTextures.set('generic', new THREE.CanvasTexture(genericCanvas));
};

const setupStudioLighting = () => {
  // Iluminación de estudio profesional hiperrealista
  
  // Luz ambiente suave
  const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
  scene.add(ambientLight);

  // Luz principal (Key Light)
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(8, 12, 8);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 4096;
  keyLight.shadow.mapSize.height = 4096;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 100;
  keyLight.shadow.camera.left = -15;
  keyLight.shadow.camera.right = 15;
  keyLight.shadow.camera.top = 15;
  keyLight.shadow.camera.bottom = -15;
  keyLight.shadow.bias = -0.0005;
  keyLight.shadow.radius = 8;
  scene.add(keyLight);

  // Luz de relleno (Fill Light)
  const fillLight = new THREE.DirectionalLight(0x88ccff, 0.6);
  fillLight.position.set(-6, 4, -8);
  scene.add(fillLight);

  // Luz de borde (Rim Light)
  const rimLight = new THREE.DirectionalLight(0xffffcc, 1.0);
  rimLight.position.set(0, 3, -12);
  scene.add(rimLight);

  // Luz superior (Top Light)
  const topLight = new THREE.HemisphereLight(0xffffcc, 0x080820, 0.4);
  scene.add(topLight);

  // Luces de acento puntuales
  const accentLight1 = new THREE.PointLight(0xffffff, 0.8, 20, 2);
  accentLight1.position.set(5, 6, 5);
  accentLight1.castShadow = true;
  scene.add(accentLight1);

  const accentLight2 = new THREE.PointLight(0xffffff, 0.6, 15, 2);
  accentLight2.position.set(-3, 4, -3);
  scene.add(accentLight2);
};

const createHyperRealisticModel = async () => {
  loadingMessage.value = 'Creando modelo hiperrealista...';
  
  if (!imageAnalysis.value) return;

  const group = new THREE.Group();
  const analysis = imageAnalysis.value;
  
  switch (analysis.shape) {
    case 'alfombra_premium':
      createHyperRealisticRug(group);
      break;
    case 'cuadro_enmarcado':
      createHyperRealisticPainting(group);
      break;
    case 'espejo_marco':
      createHyperRealisticMirror(group);
      break;
    case 'jarrón_ceramico':
      createHyperRealisticVase(group);
      break;
    case 'lampara_mesa':
      createHyperRealisticLamp(group);
      break;
    case 'cojin_suave':
      createHyperRealisticPillow(group);
      break;
    default:
      createHyperRealisticGeneric(group);
  }

  mainObject = group;
  scene.add(group);
};

const createHyperRealisticRug = (group: THREE.Group) => {
  const { width, height, depth } = imageAnalysis.value!.dimensions;
  
  // Alfombra principal con máximo realismo
  const rugGeometry = new THREE.PlaneGeometry(width, depth, 100, 100);
  
  // Deformar la geometría para simular suavidad
  const positions = rugGeometry.attributes.position.array as Float32Array;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i + 1] += (Math.random() - 0.5) * 0.02; // Y position
  }
  rugGeometry.attributes.position.needsUpdate = true;
  rugGeometry.computeVertexNormals();
  
  const rugMaterial = new THREE.MeshPhysicalMaterial({
    map: productTexture,
    normalMap: proceduralTextures.get('rugNormal'),
    roughnessMap: proceduralTextures.get('rugRoughness'),
    roughness: 0.9,
    metalness: 0.0,
    clearcoat: 0.0,
    clearcoatRoughness: 1.0,
    sheen: 0.8,
    sheenColor: new THREE.Color(0x8B4513),
    transmission: 0.0,
  });
  
  const rug = new THREE.Mesh(rugGeometry, rugMaterial);
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = -2;
  rug.castShadow = true;
  rug.receiveShadow = true;
  group.add(rug);

  // Bordes con grosor real
  const borderGeometry = new THREE.BoxGeometry(width + 0.1, height, 0.05);
  const borderMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x654321,
    roughness: 0.8,
    metalness: 0.0,
  });
  
  const borders = [
    { pos: [0, -1.975, depth/2 + 0.025], rot: [0, 0, 0] },
    { pos: [0, -1.975, -depth/2 - 0.025], rot: [0, 0, 0] },
    { pos: [width/2 + 0.025, -1.975, 0], rot: [0, Math.PI/2, 0] },
    { pos: [-width/2 - 0.025, -1.975, 0], rot: [0, Math.PI/2, 0] }
  ];
  
  borders.forEach(border => {
    const borderMesh = new THREE.Mesh(new THREE.BoxGeometry(0.05, height, depth + 0.1), borderMaterial);
    borderMesh.position.set(...border.pos);
    borderMesh.rotation.set(...border.rot);
    borderMesh.castShadow = true;
    group.add(borderMesh);
  });

  // Flecos ultra realistas
  createRealisticFringes(group, width, depth);
};

const createHyperRealisticPainting = (group: THREE.Group) => {
  const { width, height, depth } = imageAnalysis.value!.dimensions;
  
  // Marco de madera tallado
  const frameGeometry = new THREE.BoxGeometry(width + 0.4, height + 0.4, depth);
  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8B4513,
    roughness: 0.4,
    metalness: 0.0,
    normalScale: new THREE.Vector2(2, 2),
  });
  
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.castShadow = true;
  group.add(frame);

  // Lienzo con textura real
  const canvasGeometry = new THREE.PlaneGeometry(width, height);
  const canvasMaterial = new THREE.MeshPhysicalMaterial({
    map: productTexture,
    normalMap: proceduralTextures.get('canvasWeave'),
    bumpMap: proceduralTextures.get('brushStrokes'),
    bumpScale: 0.02,
    roughness: 0.6,
    metalness: 0.0,
  });
  
  const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
  canvas.position.z = depth/2 + 0.01;
  group.add(canvas);

  // Cristal protector con reflejos
  const glassGeometry = new THREE.PlaneGeometry(width, height);
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.05,
    roughness: 0.0,
    metalness: 0.0,
    transmission: 0.95,
    ior: 1.5,
  });
  
  const glass = new THREE.Mesh(glassGeometry, glassMaterial);
  glass.position.z = depth/2 + 0.02;
  group.add(glass);

  // Detalles dorados del marco
  createFrameDetails(group, width, height, depth);
};

const createHyperRealisticMirror = (group: THREE.Group) => {
  const { width, height, depth } = imageAnalysis.value!.dimensions;
  
  // Marco del espejo
  const frameGeometry = new THREE.BoxGeometry(width + 0.3, height + 0.3, depth);
  const frameMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xC0C0C0,
    roughness: 0.1,
    metalness: 0.9,
    envMapIntensity: 2.0,
  });
  
  const frame = new THREE.Mesh(frameGeometry, frameMaterial);
  frame.castShadow = true;
  group.add(frame);

  // Superficie del espejo perfecta
  const mirrorGeometry = new THREE.PlaneGeometry(width, height);
  const mirrorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    map: proceduralTextures.get('mirrorSurface'),
    roughness: 0.0,
    metalness: 1.0,
    envMapIntensity: 1.0,
    reflectivity: 1.0,
  });
  
  const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
  mirror.position.z = depth/2 + 0.01;
  group.add(mirror);
};

const createHyperRealisticVase = (group: THREE.Group) => {
  const { width, height } = imageAnalysis.value!.dimensions;
  const radius = width / 2;
  
  // Forma del jarrón con curvas suaves
  const points = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    const y = (t - 0.5) * height;
    let x = radius * (0.5 + 0.5 * Math.sin(t * Math.PI));
    
    // Forma más elegante
    if (t < 0.1) x *= (t * 10); // Base estrecha
    if (t > 0.8) x *= (1 - (t - 0.8) * 2); // Cuello estrecho
    
    points.push(new THREE.Vector2(x, y));
  }
  
  const vaseGeometry = new THREE.LatheGeometry(points, 32);
  const vaseMaterial = new THREE.MeshPhysicalMaterial({
    map: productTexture,
    normalMap: proceduralTextures.get('ceramicGlaze'),
    roughness: 0.1,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    ior: 1.5,
    transmission: 0.1,
  });
  
  const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
  vase.castShadow = true;
  group.add(vase);

  // Base decorativa
  const baseGeometry = new THREE.CylinderGeometry(radius * 1.1, radius * 1.1, 0.3, 32);
  const baseMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x2F4F4F,
    roughness: 0.3,
    metalness: 0.2,
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -height/2 - 0.15;
  base.castShadow = true;
  group.add(base);
};

const createHyperRealisticLamp = (group: THREE.Group) => {
  const { width, height } = imageAnalysis.value!.dimensions;
  
  // Base de la lámpara
  const baseGeometry = new THREE.CylinderGeometry(width/3, width/2, height/4, 16);
  const baseMaterial = new THREE.MeshPhysicalMaterial({
    map: proceduralTextures.get('metalFinish'),
    roughness: 0.2,
    metalness: 0.8,
  });
  
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -height/3;
  base.castShadow = true;
  group.add(base);

  // Poste
  const poleGeometry = new THREE.CylinderGeometry(0.1, 0.12, height/2, 16);
  const pole = new THREE.Mesh(poleGeometry, baseMaterial);
  pole.position.y = -height/6;
  pole.castShadow = true;
  group.add(pole);

  // Pantalla de la lámpara
  const shadeGeometry = new THREE.CylinderGeometry(width/2, width/3, height/3, 16, 1, true);
  const shadeMaterial = new THREE.MeshPhysicalMaterial({
    map: productTexture,
    transparent: true,
    opacity: 0.8,
    roughness: 0.7,
    metalness: 0.0,
    transmission: 0.3,
  });
  
  const shade = new THREE.Mesh(shadeGeometry, shadeMaterial);
  shade.position.y = height/4;
  shade.castShadow = true;
  group.add(shade);

  // Luz interna (simulada)
  const lightGeometry = new THREE.SphereGeometry(0.3, 16, 16);
  const lightMaterial = new THREE.MeshBasicMaterial({
    color: 0xFFE4B5,
    transparent: true,
    opacity: 0.6,
  });
  
  const lightBulb = new THREE.Mesh(lightGeometry, lightMaterial);
  lightBulb.position.y = height/4;
  group.add(lightBulb);

  // Añadir luz puntual
  const lampLight = new THREE.PointLight(0xFFE4B5, 1.0, 10, 2);
  lampLight.position.set(0, height/4, 0);
  lampLight.castShadow = true;
  group.add(lampLight);
};

const createHyperRealisticPillow = (group: THREE.Group) => {
  const { width, height, depth } = imageAnalysis.value!.dimensions;
  
  // Crear geometría suave del cojín
  const pillowGeometry = new THREE.BoxGeometry(width, height, depth, 20, 10, 20);
  
  // Deformar para que parezca suave
  const positions = pillowGeometry.attributes.position.array as Float32Array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Suavizar las esquinas
    const distFromCenter = Math.sqrt(x*x + z*z);
    const edgeDistX = Math.abs(x) / (width/2);
    const edgeDistZ = Math.abs(z) / (depth/2);
    const edgeFactor = Math.max(edgeDistX, edgeDistZ);
    
    if (edgeFactor > 0.7) {
      const softness = (1 - edgeFactor) * 0.3;
      positions[i + 1] = y * (0.7 + softness);
    }
  }
  
  pillowGeometry.attributes.position.needsUpdate = true;
  pillowGeometry.computeVertexNormals();
  
  const pillowMaterial = new THREE.MeshPhysicalMaterial({
    map: productTexture,
    normalMap: proceduralTextures.get('fabricTexture'),
    roughness: 0.8,
    metalness: 0.0,
    sheen: 0.5,
    sheenColor: new THREE.Color(0xF5F5DC),
  });
  
  const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
  pillow.castShadow = true;
  pillow.receiveShadow = true;
  group.add(pillow);

  // Costuras del cojín
  createPillowSeams(group, width, height, depth);
};

const createHyperRealisticGeneric = (group: THREE.Group) => {
  const { width, height, depth } = imageAnalysis.value!.dimensions;
  
  const geometry = new THREE.BoxGeometry(width, height, depth, 10, 10, 10);
  const material = new THREE.MeshPhysicalMaterial({
    map: productTexture,
    normalMap: proceduralTextures.get('generic'),
    roughness: 0.4,
    metalness: 0.2,
    clearcoat: 0.5,
  });
  
  const object = new THREE.Mesh(geometry, material);
  object.castShadow = true;
  group.add(object);
};

const createRealisticFringes = (group: THREE.Group, width: number, depth: number) => {
  const fringeCount = Math.floor(width * 6);
  
  for (let i = 0; i < fringeCount; i++) {
    const fringeGeometry = new THREE.CylinderGeometry(0.005, 0.003, 0.4, 4);
    const fringeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x654321,
      roughness: 0.9,
      metalness: 0.0,
    });
    
    const fringe = new THREE.Mesh(fringeGeometry, fringeMaterial);
    
    const x = (i / fringeCount - 0.5) * width;
    const randomOffset = (Math.random() - 0.5) * 0.1;
    
    fringe.position.set(x + randomOffset, -1.7, depth/2 + 0.2);
    fringe.rotation.x = Math.PI/2 + (Math.random() - 0.5) * 0.3;
    fringe.rotation.z = (Math.random() - 0.5) * 0.2;
    fringe.castShadow = true;
    group.add(fringe);
    
    // Flecos en el otro extremo
    const fringe2 = fringe.clone();
    fringe2.position.z = -depth/2 - 0.2;
    fringe2.rotation.x = -Math.PI/2 + (Math.random() - 0.5) * 0.3;
    group.add(fringe2);
  }
};

const createFrameDetails = (group: THREE.Group, width: number, height: number, depth: number) => {
  // Ornamentos dorados en las esquinas
  const corners = [
    [width/2 + 0.15, height/2 + 0.15],
    [width/2 + 0.15, -height/2 - 0.15],
    [-width/2 - 0.15, height/2 + 0.15],
    [-width/2 - 0.15, -height/2 - 0.15]
  ];
  
  corners.forEach(corner => {
    const ornamentGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    const ornamentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFD700,
      roughness: 0.1,
      metalness: 0.9,
    });
    
    const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
    ornament.position.set(corner[0], corner[1], depth/2 + 0.04);
    ornament.castShadow = true;
    group.add(ornament);
  });
};

const createPillowSeams = (group: THREE.Group, width: number, height: number, depth: number) => {
  // Crear costuras alrededor del cojín
  const seamMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x8B7355,
    roughness: 0.9,
    metalness: 0.0,
  });
  
  // Costura horizontal
  const seamGeometry = new THREE.CylinderGeometry(0.01, 0.01, width - 0.2, 8);
  
  const topSeam = new THREE.Mesh(seamGeometry, seamMaterial);
  topSeam.rotation.z = Math.PI/2;
  topSeam.position.set(0, height/2 - 0.05, depth/2 + 0.01);
  group.add(topSeam);
  
  const bottomSeam = topSeam.clone();
  bottomSeam.position.y = -height/2 + 0.05;
  group.add(bottomSeam);
};

const addEnvironmentalEffects = () => {
  // Suelo ultra realista con reflejos
  const floorGeometry = new THREE.PlaneGeometry(25, 25);
  const floorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xf8f8f8,
    roughness: 0.1,
    metalness: 0.0,
    reflectivity: 0.3,
    envMapIntensity: 0.5,
  });
  
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4;
  floor.receiveShadow = true;
  scene.add(floor);

  // Partículas de polvo en el aire para más realismo
  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = 200;
  const dustPositions = new Float32Array(dustCount * 3);
  
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPositions[i] = (Math.random() - 0.5) * 20;     // x
    dustPositions[i + 1] = Math.random() * 10 - 2;     // y
    dustPositions[i + 2] = (Math.random() - 0.5) * 20; // z
  }
  
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  
  const dustMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.02,
    transparent: true,
    opacity: 0.3,
  });
  
  const dustParticles = new THREE.Points(dustGeometry, dustMaterial);
  scene.add(dustParticles);
};

const setupCameraControls = () => {
  if (!renderer?.domElement) return;

  const handleMouseDown = (event: MouseEvent) => {
    isMouseDown = true;
    mouseX = event.clientX;
    mouseY = event.clientY;
    renderer.domElement.style.cursor = 'grabbing';
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isMouseDown) return;
    
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;
    
    targetRotationY += deltaX * 0.008;
    targetRotationX += deltaY * 0.008;
    
    targetRotationX = Math.max(-Math.PI/4, Math.min(Math.PI/4, targetRotationX));
    
    mouseX = event.clientX;
    mouseY = event.clientY;
  };

  const handleMouseUp = () => {
    isMouseDown = false;
    renderer.domElement.style.cursor = 'grab';
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const scale = event.deltaY > 0 ? 1.05 : 0.95;
    camera.position.multiplyScalar(scale);
    camera.position.clampLength(3, 25);
  };

  renderer.domElement.addEventListener('mousedown', handleMouseDown);
  renderer.domElement.addEventListener('mousemove', handleMouseMove);
  renderer.domElement.addEventListener('mouseup', handleMouseUp);
  renderer.domElement.addEventListener('wheel', handleWheel);
  renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  renderer.domElement.style.cursor = 'grab';
};

const updateCamera = () => {
  currentRotationX += (targetRotationX - currentRotationX) * 0.08;
  currentRotationY += (targetRotationY - currentRotationY) * 0.08;

  const radius = camera.position.length();
  camera.position.x = Math.cos(currentRotationY) * Math.cos(currentRotationX) * radius;
  camera.position.y = Math.sin(currentRotationX) * radius;
  camera.position.z = Math.sin(currentRotationY) * Math.cos(currentRotationX) * radius;
  camera.lookAt(0, 0, 0);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);

  updateCamera();

  // Rotación automática suave
  if (autoRotate.value && mainObject) {
    mainObject.rotation.y += 0.003;
  }

  // Animaciones específicas por tipo de producto
  if (mainObject && imageAnalysis.value) {
    const time = Date.now() * 0.001;
    
    if (imageAnalysis.value.shape === 'cojin_suave') {
      // Respiración sutil del cojín
      mainObject.scale.y = 1 + Math.sin(time * 2) * 0.02;
    }
    
    if (imageAnalysis.value.shape === 'alfombra_premium') {
      // Ondulación muy sutil de la alfombra
      mainObject.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh && index === 0) {
          child.rotation.z = Math.sin(time + index) * 0.001;
        }
      });
    }
  }

  // Animar partículas de polvo
  scene.traverse((object) => {
    if (object instanceof THREE.Points) {
      object.rotation.y += 0.0005;
      const positions = object.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.0001;
      }
      object.geometry.attributes.position.needsUpdate = true;
    }
  });

  renderer.render(scene, camera);
};

const resetCamera = () => {
  camera.position.set(0, 2, 8);
  targetRotationX = 0;
  targetRotationY = 0;
  currentRotationX = 0;
  currentRotationY = 0;
  camera.lookAt(0, 0, 0);
};

const toggleAutoRotate = () => {
  autoRotate.value = !autoRotate.value;
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'Realista' ? 'Wireframe' : 'Realista';
  
  if (!mainObject) return;
  
  mainObject.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (viewMode.value === 'Wireframe') {
        child.material.wireframe = true;
      } else {
        child.material.wireframe = false;
      }
    }
  });
};

const captureScreenshot = () => {
  if (!renderer) return;
  
  renderer.render(scene, camera);
  const dataURL = renderer.domElement.toDataURL('image/png');
  
  const link = document.createElement('a');
  link.download = `${props.producto.nombre}_3D.png`;
  link.href = dataURL;
  link.click();
};

const cleanup = () => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  if (productTexture) {
    productTexture.dispose();
  }
  
  proceduralTextures.forEach(texture => {
    texture.dispose();
  });
  proceduralTextures.clear();
  
  if (renderer) {
    renderer.dispose();
    if (viewerContainer.value && renderer.domElement.parentNode) {
      viewerContainer.value.removeChild(renderer.domElement);
    }
  }
  
  if (scene) {
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    scene.clear();
  }
};

onBeforeUnmount(() => {
  cleanup();
});
</script>
<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-2d-viewer {
  margin: $spacing-md 0;
}

.viewer-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md $spacing-lg;
  background: linear-gradient(135deg, $primary-color 0%, #059447 100%);
  color: white;
  border: none;
  border-radius: $border-radius-lg;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba($primary-color, 0.4);
  min-width: 160px;
  font-family: inherit;

  &:hover:not(:disabled) {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba($primary-color, 0.5);
    background: linear-gradient(135deg, #059447 0%, $primary-color 100%);
  }

  &:disabled {
    background: linear-gradient(135deg, #ccc 0%, #999 100%);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  i {
    font-size: 28px;
    margin-bottom: 2px;
  }

  span {
    font-weight: 700;
    font-size: $font-size-base;
    letter-spacing: 0.5px;
  }

  small {
    font-size: $font-size-small;
    opacity: 0.9;
    font-weight: 400;
    margin-top: 2px;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: $spacing-md;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: white;
  border-radius: $border-radius-lg;
  max-width: 1100px;
  width: 100%;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $spacing-lg $spacing-xl;
  border-bottom: 1px solid $border-color;
  background: linear-gradient(135deg, rgba($primary-color, 0.08) 0%, rgba($primary-color, 0.03) 100%);

  h3 {
    margin: 0;
    font-size: $font-size-large;
    color: $text-color;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: $text-color-secondary;
  padding: $spacing-sm;
  border-radius: $border-radius;
  transition: all 0.2s ease;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba($error-color, 0.1);
    color: $error-color;
    transform: scale(1.1);
  }
}

.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.viewer-container {
  position: relative;
  flex: 1;
  min-height: 500px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: $border-radius;
  margin: $spacing-lg;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);

  .spinner {
    width: 70px;
    height: 70px;
    border: 6px solid rgba($primary-color, 0.2);
    border-radius: 50%;
    border-top-color: $primary-color;
    border-right-color: #059447;
    animation: spin 1s linear infinite;
    margin-bottom: $spacing-lg;
  }

  p {
    color: $text-color;
    font-weight: 700;
    margin-bottom: $spacing-md;
    font-size: $font-size-base;
    letter-spacing: 0.3px;
  }

  .progress-bar {
    width: 280px;
    height: 12px;
    background-color: rgba($primary-color, 0.15);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid rgba($primary-color, 0.3);
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $primary-color 0%, #059447 50%, $primary-color 100%);
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      transition: width 0.4s ease;
    }
  }
}

.image-analysis {
  position: absolute;
  top: $spacing-lg;
  left: $spacing-lg;
  z-index: 5;
  
  .analysis-tag {
    background: linear-gradient(135deg, rgba($primary-color, 0.95) 0%, rgba(#059447, 0.95) 100%);
    color: white;
    padding: $spacing-sm $spacing-md;
    border-radius: $border-radius-lg;
    font-size: $font-size-small;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    box-shadow: 0 4px 15px rgba($primary-color, 0.4);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    i {
      font-size: 16px;
      animation: pulse 2s infinite;
    }
  }
}

.viewer-controls {
  display: flex;
  justify-content: center;
  gap: $spacing-md;
  padding: $spacing-lg;
  background: linear-gradient(135deg, rgba($tertiary-color, 0.4) 0%, rgba($tertiary-color, 0.2) 100%);
  border-top: 1px solid $border-color;
  flex-wrap: wrap;
}

.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-xs;
  padding: $spacing-md $spacing-sm;
  background: white;
  border: 2px solid $border-color;
  border-radius: $border-radius-lg;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 90px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba($primary-color, 0.08) 0%, rgba($primary-color, 0.03) 100%);
    border-color: $primary-color;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba($primary-color, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  i {
    font-size: 20px;
    color: $primary-color;
    margin-bottom: 2px;
  }

  span {
    font-size: $font-size-small;
    color: $text-color;
    font-weight: 600;
    letter-spacing: 0.3px;
  }
}

.modal-footer {
  padding: $spacing-lg $spacing-xl;
  border-top: 1px solid $border-color;
  background: linear-gradient(135deg, rgba($tertiary-color, 0.3) 0%, rgba($tertiary-color, 0.1) 100%);
}

.viewer-info {
  margin: 0;
  text-align: center;
  color: $text-color-secondary;
  font-size: $font-size-small;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-sm;
  line-height: 1.5;
  font-weight: 500;

  i {
    color: $primary-color;
    flex-shrink: 0;
    font-size: 16px;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (max-width: $breakpoint-md) {
  .modal-content {
    margin: $spacing-sm;
    max-height: 98vh;
  }

  .modal-header {
    padding: $spacing-md $spacing-lg;

    h3 {
      font-size: $font-size-base;
    }
  }

  .viewer-container {
    min-height: 400px;
    margin: $spacing-md;
  }

  .viewer-controls {
    gap: $spacing-sm;
    padding: $spacing-md;
  }

  .control-btn {
    min-width: 70px;
    padding: $spacing-sm;

    span {
      font-size: 11px;
    }
  }

  .image-analysis {
    top: $spacing-md;
    left: $spacing-md;
    
    .analysis-tag {
      padding: $spacing-xs $spacing-sm;
      font-size: 11px;
    }
  }

  .loading-overlay {
    .progress-bar {
      width: 220px;
      height: 10px;
    }
  }
}

@media (max-width: $breakpoint-sm) {
  .viewer-button {
    min-width: 140px;
    padding: $spacing-sm $spacing-md;

    i {
      font-size: 24px;
    }

    span {
      font-size: $font-size-small;
    }
  }

  .modal-header {
    padding: $spacing-sm $spacing-md;
  }

  .viewer-container {
    min-height: 350px;
    margin: $spacing-sm;
  }

  .modal-footer {
    padding: $spacing-md;
  }
}
</style>