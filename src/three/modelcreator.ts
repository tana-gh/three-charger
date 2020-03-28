import * as THREE from 'three'
import * as R     from 'ramda'

const modelSize  = 0.15
const boneLength = 1.0

export const createModelRootAndBone = () => {
    const models     = createModels(12)
    const modelBones = R.map(m => new THREE.Bone(), models)
    const dph = 2.0 * Math.PI / models.length

    R.pipe(
        (x: THREE.Bone[], y: THREE.Mesh[]) => R.zip(x, y),
        R.forEach(z => {
            z[0].add(z[1])
            z[0].rotateZ(dph)
        })
    )(modelBones, models)
    
    R.reduce((b1, b2) => {
        if (b1 !== null) {
            b1!.add(b2)
        }
        return b2
    }, <THREE.Bone | null>null, modelBones)

    const modelRoot = new THREE.Bone()
    modelRoot.add(modelBones[0])

    return [ modelRoot, modelBones[0] ]
}

const createModels = (count: number) => {
    return comp(count)(R.range(0, count))
}

const toHue = (count: number) => (x: number) => R.clamp(0.0, 1.0, x / count)

const toMaterial = (hue: number) => new THREE.MeshPhysicalMaterial({
    color: new THREE.Color().setHSL(hue, 1.0, 0.8),
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 0.5,
    clearcoatRoughness: 0.5,
    reflectivity: 1.0,
    fog: true
})

const geometry = () => new THREE.BoxGeometry(modelSize, modelSize, modelSize)

const toMesh = (material: THREE.Material) => new THREE.Mesh(geometry(), material)

const axis = () => new THREE.Vector3(0.0, boneLength, 0.0)

const setAttr = (model: THREE.Mesh) => {
    model.translateOnAxis(axis(), 1.0)
}

const comp = (count: number) => R.pipe(
    R.map(toHue(count)),
    R.map(toMaterial),
    R.map(toMesh),
    R.forEach(setAttr)
)