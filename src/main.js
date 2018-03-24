import * as three from 'three'
import SimplexNoise from 'simplex-noise'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

const simplex = new SimplexNoise()

const vw = window.innerWidth
const vh = window.innerHeight

const scene = new three.Scene()
const camera = new three.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000)
camera.position.z = 1
scene.add(camera)

const uniforms = {
    time: {
        type: "f",
        value: 1.0
    },
    resolution: {
        type: "v2",
        value: new three.Vector2(vw, vh)
    },
    center: {
        type: "v2",
        value: new three.Vector2()
    }
}

const screenMaterial = new three.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true
})
const screenGeometry = new three.PlaneGeometry(2, 2)
const screenMesh = new three.Mesh(screenGeometry, screenMaterial)
scene.add(screenMesh)

const blueMaterial = new three.MeshBasicMaterial({color: 0x0000FF})
const redMaterial = new three.MeshBasicMaterial({color: 0xFF0000})
const wingGeometry = new three.PlaneGeometry(0.2, 0.2)
const leftWing = new three.Mesh(wingGeometry, blueMaterial)
const rightWing = new three.Mesh(wingGeometry, redMaterial)
scene.add(leftWing)
scene.add(rightWing)

leftWing.rotateY(0.1)
rightWing.rotateY(-0.1)

const butterfly = new three.Object3D()
butterfly.add(leftWing)
butterfly.add(rightWing)
scene.add(butterfly)

const gridHelper = new three.GridHelper(2, 10, 0x00FF00, 0xFFFFFF);
gridHelper.rotateX(Math.PI / 2)
scene.add(gridHelper);

const renderer = new three.WebGLRenderer({alpha: true})
renderer.setSize(vw, vh)
document.body.appendChild(renderer.domElement)

function draw() {
    requestAnimationFrame(draw)

    const time = performance.now()
    const x = Math.sin(time * 0.00055) * 0.4
    const y = simplex.noise2D(time * 0.0001, 1000) * 0.4
    const radius = 100 + (simplex.noise2D(time * 0.001, 0) * 5)

    uniforms.time.value = performance.now()
    uniforms.center.value.x = x
    uniforms.center.value.y = y

    butterfly.position.x = x
    butterfly.position.y = y

    renderer.render(scene, camera)
}

requestAnimationFrame(draw)