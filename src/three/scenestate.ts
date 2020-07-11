import * as THREE         from 'three'
import * as R             from 'ramda'
import * as Animation     from '../utils/animation'
import * as Behaviour     from './behaviour'
import * as DisplayObject from './displayobject'

export interface ISceneState {
    scene     : THREE.Scene
    camera    : THREE.Camera
    behaviours: Set<Behaviour.IBehaviour>
    objects   : Set<DisplayObject.IDisplayObject>
    render    : (renderer: THREE.WebGLRenderer, animation: Animation.IAnimationState) => void
    dispose   : () => void
}

export const setCameraSize = (camera: THREE.Camera, aspect: number) => {
    if (camera instanceof THREE.PerspectiveCamera) {
        camera.aspect = aspect
        camera.updateProjectionMatrix()
    }
}

export const dispose = (sceneState: ISceneState) => {
    R.forEach((obj: Behaviour    .IBehaviour    ) => obj.dispose())(Array.from(sceneState.behaviours))
    R.forEach((obj: DisplayObject.IDisplayObject) => obj.dispose())(Array.from(sceneState.objects))
}
