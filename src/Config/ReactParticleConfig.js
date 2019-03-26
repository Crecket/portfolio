export default {
    showCube: false,
    dimension: "3D",
    velocity: 1.5,
    lines: {
        colorMode: "rainbow",
        color: "#351CCB",
        transparency: 0.9,
        limitConnections: true,
        maxConnections: 20,
        minDistance: 150,
        visible: true
    },
    particles: {
        colorMode: "rainbow",
        color: "#623fb5",
        transparency: 0.9,
        shape: "square",
        boundingBox: "canvas",
        count: 500,
        minSize: 10,
        maxSize: 50,
        visible: true
    },
    cameraControls: {
        enabled: false,
        enableDamping: true,
        dampingFactor: 0.85,
        enableZoom: true,
        autoRotate: true,
        autoRotateSpeed: 0.1,
        resetCameraFlag: false
    }
};