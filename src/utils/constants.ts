import * as THREE from 'three'

export const orthographic = {
    near: -100.0,
    far :  100.0,
    z   :  3.0
}

export const perspective = {
    fov : 60.0,
    near: 0.1,
    far : 100.0,
    z   : 3.0
}

export const interactiveRotation = {
    coefficient: 1.0,
    theta      : 2.0
}

export const cube = {
    coefficient: 1.0,
    phi        : -0.2,
    count      : 12,
    size       : 0.15,
    boneLength : 1.0
}

export const cubeMaterial = (hue: number): THREE.MeshPhysicalMaterialParameters => ({
    color             : new THREE.Color().setHSL(hue, 1.0, 0.8),
    metalness         : 0.5,
    roughness         : 0.5,
    clearcoat         : 0.5,
    clearcoatRoughness: 0.5,
    reflectivity      : 1.0,
    fog               : true
})

export const light = {
    coefficient: 1.0,
    phi        : 0.1,
    count      : 12,
    radius     : 5.0,
    hsl: {
        s: 0.5,
        l: 0.5
    }
}

export const fps = {
    updateDelta: 100.0
}

export const cursor = {
    width : 0.2,
    height: 0.2
}

export const cursorUniforms = {
    lineWeight: {
        type : 'float',
        value: 0.01
    },
    lineInner: {
        type : 'float',
        value: 0.4,
    },
    lineOuter: {
        type : 'float',
        value: 1.0
    }
}

export const classNames = {
    three: 'three',
    fps  : 'fps'
}
