import * as THREE      from 'three'
import * as Rx         from 'rxjs'
import * as R          from 'ramda'
import * as Animation  from '../utils/animation'
import * as SceneState from './scenestate'
import * as Disposable from './disposable'
import { WebGLMultisampleRenderTarget, WebGLBufferRenderer } from 'three'

export interface IRendererState extends Disposable.IDisposable {
    renderer : THREE.WebGLRenderer
    scenes   : Set<SceneState.ISceneState>
    aspectObj: IAspect
    render   : (animationState: Animation.IAnimationState) => void
    resize   : (width: number, height: number) => void
}

export interface IAspect {
    value     : number
    observable: Rx.Observable<number>
}

export const create = (
    width : number,
    height: number
): IRendererState => {
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    
    renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0), 0.0)
    renderer.setSize(width, height)
    renderer.autoClear = false

    return {
        renderer,
        scenes   : new Set(),
        aspectObj: {
            value     : width / height,
            observable: new Rx.BehaviorSubject<number>(width / height)
        },
        render(animationState) {
            render(this, animationState)
        },
        resize(width, height) {
            resize(this, width, height)
        },
        dispose() {
            dispose(this)
        }
    }
}

export const addScenes = (renderer: IRendererState, ...scenes: SceneState.ISceneState[]): void => {
    R.forEach((s: SceneState.ISceneState) => renderer.scenes.add(s))(scenes)
}

const resize = (rendererState: IRendererState, width: number, height: number) => {
    setStyle(rendererState.renderer.domElement, width, height)
    setRendererSize(rendererState)
    
    rendererState.aspectObj.value = width / height
    const subject = <Rx.Subject<number>>rendererState.aspectObj.observable
    subject.next(width / height)
}

const setStyle = (element: HTMLElement, width: number, height: number) => {
    element.style.width  = `${width }px`
    element.style.height = `${height}px`
}

const setRendererSize = (rendererState: IRendererState) => {
    const canvas = rendererState.renderer.domElement
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    
    if (w != canvas.width || h != canvas.height) {
        rendererState.renderer.setSize(w, h)
        const aspect = w / h
        R.forEach(
            (s: SceneState.ISceneState) => SceneState.setCameraSize(s.camera, aspect)
        )(Array.from(rendererState.scenes))
    }
}

const render = (rendererState: IRendererState, animationState: Animation.IAnimationState) => {
    rendererState.renderer.clear()
    R.forEach(
        (s: SceneState.ISceneState) => s.render(rendererState.renderer, animationState)
    )(Array.from(rendererState.scenes))
}

const dispose = (rendererState: IRendererState) => {
    rendererState.renderer.dispose()
    R.forEach((s: SceneState.ISceneState) => s.dispose())(Array.from(rendererState.scenes))
}
