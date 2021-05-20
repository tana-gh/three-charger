import * as THREE      from 'three'
import * as R          from 'ramda'
import * as C          from '../../utils/constants'
import * as Disposable from '../disposable'

export const createCubeRootAndBones = (): [ THREE.Object3D, THREE.Object3D[], Disposable.IDisposable[] ] => {
    const geometry = createGeometry()
    const cubes    = createCubes(C.cube.count, geometry)
    const bones    = R.map(m => new THREE.Bone(), cubes)
    const dph      = 2.0 * Math.PI / cubes.length

    R.pipe(
        (x: THREE.Bone[], y: THREE.Mesh[]) => R.zip(x, y),
        R.forEach(z => {
            z[0].add(z[1])
            z[0].rotateZ(dph)
        })
    )(bones, cubes)
    
    R.reduce((b1, b2) => {
        if (b1) {
            b1.add(b2)
        }
        return b2
    }, <THREE.Bone | null>null, bones)

    const root = new THREE.Bone()
    root.add(bones[0])

    return [ root, bones, [ geometry ] ]
}

const createGeometry = () => new THREE.BoxGeometry(C.cube.size, C.cube.size, C.cube.size)

const createCubes = (count: number, geometry: THREE.BufferGeometry) =>
    composit(count, geometry)(R.range(0, count))

const toHue = (count: number) => (x: number) => R.clamp(0.0, 1.0, x / count)

const toMaterial = (hue: number) => new THREE.MeshPhysicalMaterial(C.cubeMaterial(hue))

const toMesh = (geometry: THREE.BufferGeometry) => (material: THREE.Material) => new THREE.Mesh(geometry, material)

const axis = () => new THREE.Vector3(0.0, 1.0, 0.0)

const setAttr = (mesh: THREE.Mesh) => {
    mesh.translateOnAxis(axis(), C.cube.boneLength)
}

const composit = (count: number, geometry: THREE.BufferGeometry) => R.pipe(
    R.map(toHue(count)),
    R.map(toMaterial),
    R.map(toMesh(geometry)),
    R.forEach(setAttr)
)
