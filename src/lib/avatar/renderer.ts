import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { AVATAR_CONFIG } from "../../constants/avatars"

export class AvatarRenderer {
  private _scene: THREE.Scene
  private _camera: THREE.PerspectiveCamera
  private renderer: THREE.WebGLRenderer

  private _avatar: THREE.Group | null = null
  private mixer: THREE.AnimationMixer | null = null

  constructor(canvas: HTMLCanvasElement) {
    this._scene = new THREE.Scene()
    this._camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })

    this.setupScene()
    this.setupLighting()
  }

  private setupScene(): void {
    this._camera.position.set(...AVATAR_CONFIG.cameraPosition)

    this.renderer.setSize(400, 400)
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  private setupLighting(): void {
    this._scene.add(new THREE.AmbientLight(0x404040, 0.6))

    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(1, 1, 1)
    dir.castShadow = true
    this._scene.add(dir)

    const point = new THREE.PointLight(0xffffff, 0.4)
    point.position.set(-1, 1, 1)
    this._scene.add(point)
  }

  async loadAvatar(modelUrl: string = AVATAR_CONFIG.modelUrl): Promise<void> {
    const loader = new GLTFLoader()

    return new Promise((resolve, reject) => {
      loader.load(
        modelUrl,
        (gltf) => {
          if (this._avatar) this._scene.remove(this._avatar)

          this._avatar = gltf.scene
          this._scene.add(this._avatar)

          this._avatar.scale.set(...AVATAR_CONFIG.scale)
          this._avatar.position.set(...AVATAR_CONFIG.position)

          if (gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this._avatar)
          }

          this.setupMorphTargets(this._avatar)
          resolve()
        },
        undefined,
        reject
      )
    })
  }

  private setupMorphTargets(avatar: THREE.Group): void {
    avatar.traverse((child) => {
      if (child instanceof THREE.Mesh && child.morphTargetInfluences) {
        child.morphTargetInfluences.fill(0)
      }
    })
  }

  update(deltaTime: number): void {
    this.mixer?.update(deltaTime)
  }

  render(): void {
    this.renderer.render(this._scene, this._camera)
  }

  dispose(): void {
    this.mixer?.stopAllAction()
    this.renderer.dispose()
  }

  // Add playAnimation method inside the class
  playAnimation(animationName: string): boolean {
    if (!this.mixer || !this._avatar) return false

    // Find animation clip by name
    const clip = THREE.AnimationClip.findByName(this._avatar.animations || [], animationName)
    if (!clip) return false

    // Stop current animation
    this.mixer.stopAllAction()

    // Play new animation
    const action = this.mixer.clipAction(clip)
    action.play()

    return true
  }

  // getters
  get avatar(): THREE.Group | null {
    return this._avatar
  }

  get mixerInstance(): THREE.AnimationMixer | null {
    return this.mixer
  }

  get camera(): THREE.PerspectiveCamera {
    return this._camera
  }

  get scene(): THREE.Scene {
    return this._scene
  }
}