const isBigWindow = window && window.innerWidth > 800;

export default {
    showCube: false,
    dimension: "3D",
    velocity: 1.5,
    lines: {
        colorMode: "rainbow",
        color: "#351CCB",
        transparency: 0.9,
        limitConnections: true,
        maxConnections: 8,
        minDistance: 175,
        visible: true
    },
    particles: {
        colorMode: "rainbow",
        color: "#623fb5",
        transparency: 0.9,
        shape: "circle",
        boundingBox: "canvas",
        count: isBigWindow ? 500 : 250,
        minSize: 10,
        maxSize: 50,
        visible: true
    },
    cameraControls: {
        enabled: false,
        enableDamping: true,
        dampingFactor: 0.85,
        enableZoom: false,
        autoRotate: true,
        autoRotateSpeed: 0.4
    }
};
