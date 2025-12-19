'use client'

import React, { useEffect, useRef } from 'react'

interface Avatar3DSceneProps {
  isSpeaking: boolean
  isListening: boolean
  audioLevel: number
  onLipSyncData?: (data: any) => void
}

export const Avatar3DScene: React.FC<Avatar3DSceneProps> = ({
  isSpeaking,
  isListening,
  audioLevel,
  onLipSyncData
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const mixerRef = useRef<any>(null)
  const morphTargetsRef = useRef<{ [key: string]: any }>({})
  const animationIdRef = useRef<number | null>(null)
  const animationsRef = useRef<any[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const initThreeJS = async () => {
      try {
        // Correct Three.js imports
        const { 
          Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, DirectionalLight, 
          PointLight, Color, Vector3, Spherical, AnimationMixer, PCFSoftShadowMap,
          CapsuleGeometry, MeshLambertMaterial, Mesh
        } = await import('three')
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js')

        // Scene setup
        const scene = new Scene()
        

        // Camera - positioned to see the avatar clearly
        const camera = new PerspectiveCamera(50, 1, 0.1, 1000)
        camera.position.set(0, 1.2, 1.5) // Closer position for better visibility
        camera.lookAt(0, 0.5, 0) // Look at avatar's face area

        // Renderer
        const renderer = new WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(400, 384)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = PCFSoftShadowMap

        // Enhanced Lighting for visibility
        const ambientLight = new AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new DirectionalLight(0xffffff, 2.0) // Increased intensity
        directionalLight.position.set(1, 1, 1)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 2048
        directionalLight.shadow.mapSize.height = 2048
        scene.add(directionalLight)

        // Fill light for better visibility
        const fillLight = new DirectionalLight(0x87ceeb, 0.8)
        fillLight.position.set(-1, 0.5, 1)
        scene.add(fillLight)

        const pointLight1 = new PointLight(0x4f46e5, 0.5)
        pointLight1.position.set(-2, 1, 1)
        scene.add(pointLight1)

        const pointLight2 = new PointLight(0x7c3aed, 0.3)
        pointLight2.position.set(2, -1, 1)
        scene.add(pointLight2)

        // Load GLTF model
        const loader = new GLTFLoader()
        loader.load(
          '/models/avatar.glb',
          (gltf) => {
            const avatar = gltf.scene
            avatar.scale.setScalar(0.6) // Ensure good visible size
            avatar.position.set(0, 0, 0) // Center position for visibility
            
            // Rotate avatar: 90° to the right side and upside down
             // 90° rotation to the right (Y-axis)
            
            scene.add(avatar)

            console.log('Avatar loaded successfully:', gltf)
            console.log('Avatar position:', avatar.position)
            console.log('Avatar rotation:', avatar.rotation)
            console.log('Avatar scale:', avatar.scale)

            // Store animations for later use
            animationsRef.current = gltf.animations || []

            // Set up animations
            if (animationsRef.current.length > 0) {
              mixerRef.current = new AnimationMixer(avatar)
              
              // Find and play idle animation
              const idleClip = animationsRef.current.find((clip: any) =>
                clip.name.toLowerCase().includes('idle') ||
                clip.name.toLowerCase().includes('rest')
              )

              if (idleClip && mixerRef.current) {
                const action = mixerRef.current.clipAction(idleClip)
                action.play()
              }
            }

            // Find morph targets for lip-sync
            avatar.traverse((child: any) => {
              if (child.isMesh && child.morphTargetDictionary) {
                morphTargetsRef.current[child.name] = child
                console.log('Found morph targets:', child.morphTargetDictionary)
              }
            })
          },
          (progress) => {
            console.log('Avatar loading progress:', (progress.loaded / progress.total * 100) + '%')
          },
          (error) => {
            console.error('Error loading GLTF avatar:', error)
            
            // Create fallback avatar (capsule shape)
            const geometry = new CapsuleGeometry(0.3, 0.6, 4, 8)
            const material = new MeshLambertMaterial({ color: 0xf59e0b }) // Orange color
            const fallbackAvatar = new Mesh(geometry, material)
            fallbackAvatar.position.set(0, 0, 0)
            // Apply same rotation to fallback avatar
            fallbackAvatar.rotation.y = Math.PI / 2
            fallbackAvatar.rotation.x = Math.PI
            scene.add(fallbackAvatar)
            
            console.log('Using fallback avatar due to loading error')
          }
        )

        // Simple orbit controls
        const controls = {
          enabled: true,
          target: new Vector3(0, 0.5, 0), // Target avatar's face area
          spherical: new Spherical(1.5, Math.PI / 2.5, 0), // Better initial position
          update: function() {
            camera.position.setFromSpherical(this.spherical)
            camera.lookAt(this.target)
          }
        }

        // Mouse controls
        let isMouseDown = false
        let lastMouseX = 0
        let lastMouseY = 0

        const onMouseDown = (event: MouseEvent) => {
          isMouseDown = true
          lastMouseX = event.clientX
          lastMouseY = event.clientY
        }

        const onMouseMove = (event: MouseEvent) => {
          if (!isMouseDown) return

          const deltaX = event.clientX - lastMouseX
          const deltaY = event.clientY - lastMouseY

          controls.spherical.theta -= deltaX * 0.01
          controls.spherical.phi += deltaY * 0.01
          controls.spherical.phi = Math.max(Math.PI / 4, Math.min(Math.PI / 1.8, controls.spherical.phi))

          controls.update()

          lastMouseX = event.clientX
          lastMouseY = event.clientY
        }

        const onMouseUp = () => {
          isMouseDown = false
        }

        renderer.domElement.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)

        // Animation loop
        const animate = () => {
          animationIdRef.current = requestAnimationFrame(animate)

          if (mixerRef.current) {
            mixerRef.current.update(1/60)
          }

          renderer.render(scene, camera)
        }
        animate()

        // Store references
        sceneRef.current = scene
        rendererRef.current = renderer
        cameraRef.current = camera

        // Add to DOM (with null check)
        if (containerRef.current) {
          containerRef.current.appendChild(renderer.domElement)
        }

        // Handle resize
        const handleResize = () => {
          if (containerRef.current && camera && renderer) {
            const rect = containerRef.current.getBoundingClientRect()
            camera.aspect = rect.width / rect.height
            camera.updateProjectionMatrix()
            renderer.setSize(rect.width, rect.height)
          }
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
          if (renderer.domElement) {
            renderer.domElement.removeEventListener('mousedown', onMouseDown)
          }
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('mouseup', onMouseUp)
          
          // Safe DOM removal
          if (rendererRef.current && containerRef.current) {
            try {
              containerRef.current.removeChild(rendererRef.current.domElement)
              rendererRef.current.dispose()
            } catch (e) {
              // Element might already be removed
            }
          }
        }

      } catch (error) {
        console.error('Failed to initialize Three.js:', error)
      }
    }

    initThreeJS()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (rendererRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement)
          rendererRef.current.dispose()
        } catch (e) {
          // Element might already be removed
        }
      }
    }
  }, [])

  // Handle animation state changes
  useEffect(() => {
    if (!mixerRef.current || !animationsRef.current.length) return

    // Stop all current animations
    mixerRef.current.stopAllAction()

    let targetAnimation: any = null

    if (isListening) {
      targetAnimation = animationsRef.current.find((clip: any) => 
        clip.name.toLowerCase().includes('listen') || 
        clip.name.toLowerCase().includes('listening')
      )
    } else if (isSpeaking) {
      targetAnimation = animationsRef.current.find((clip: any) => 
        clip.name.toLowerCase().includes('talk') || 
        clip.name.toLowerCase().includes('speak') ||
        clip.name.toLowerCase().includes('speaking')
      )
    } else {
      // Play idle animation
      targetAnimation = animationsRef.current.find((clip: any) => 
        clip.name.toLowerCase().includes('idle') || 
        clip.name.toLowerCase().includes('rest')
      )
    }

    if (targetAnimation && mixerRef.current) {
      const action = mixerRef.current.clipAction(targetAnimation)
      action.play()
    }
  }, [isListening, isSpeaking])

  // Enhanced Lip-sync using morph targets
  useEffect(() => {
    if (isSpeaking && onLipSyncData) {
      console.log('🎭 Starting lip-sync animation')
      
      const lipSyncInterval = setInterval(() => {
        // Create more varied mouth movements for realistic speech
        const baseIntensity = Math.random() * 0.6 + 0.3 // 0.3 to 0.9 range
        const intensity = baseIntensity + Math.sin(Date.now() * 0.01) * 0.2 // Add some wave motion
        
        // Apply morph targets to all meshes with morph data
        let morphFound = false
        Object.values(morphTargetsRef.current).forEach((mesh: any) => {
          if (mesh.morphTargetInfluences && mesh.morphTargetDictionary) {
            // Try multiple common morph target names
            const morphNames = [
              'mouth_open', 'Jaw_Open', 'mouthOpen', 'jaw_open',
              'Mouth_Open', 'JAW_OPEN', 'mouth open', 'jaw open',
              'viseme_sil', 'viseme_PP', 'viseme_FF', 'viseme_TH',
              'viseme_DD', 'viseme_kk', 'viseme_CH', 'viseme_SS',
              'viseme_nn', 'viseme_RR', 'viseme_aa', 'viseme_E',
              'viseme_I', 'viseme_O', 'viseme_U'
            ]
            
            for (const morphName of morphNames) {
              const morphIndex = mesh.morphTargetDictionary[morphName]
              if (morphIndex !== undefined) {
                // Apply different intensities based on phoneme type
                let finalIntensity = intensity
                if (morphName.includes('open') || morphName.includes('Open')) {
                  finalIntensity = Math.max(intensity, 0.5) // Ensure mouth opens noticeably
                }
                
                mesh.morphTargetInfluences[morphIndex] = finalIntensity
                morphFound = true
                console.log(`🎭 Applied morph target: ${morphName} = ${finalIntensity.toFixed(2)}`)
                break
              }
            }
          }
        })

        if (!morphFound) {
          console.warn('🎭 No morph targets found for lip-sync')
        }

        onLipSyncData({
          intensity,
          phoneme: intensity > 0.6 ? 'open' : intensity > 0.3 ? 'mid' : 'closed'
        })
      }, 80) // Faster updates for smoother animation

      return () => {
        console.log('🎭 Stopping lip-sync animation')
        clearInterval(lipSyncInterval)
      }
    } else {
      // Reset all morph targets when not speaking
      console.log('🎭 Resetting morph targets')
      Object.values(morphTargetsRef.current).forEach((mesh: any) => {
        if (mesh.morphTargetInfluences) {
          mesh.morphTargetInfluences.fill(0)
        }
      })
    }
  }, [isSpeaking, onLipSyncData])

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden relative">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ position: 'relative' }}
      />

      {/* Lip-sync indicator */}
      {isSpeaking && (
        <div className="absolute top-4 left-4">
          <div className="bg-purple-500/90 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Lip-sync Active
          </div>
        </div>
      )}

      {/* Status indicators */}
      <div className="absolute bottom-4 left-4 flex gap-2">
        {isListening && (
          <div className="bg-green-500/90 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Listening
          </div>
        )}
        {isSpeaking && (
          <div className="bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Speaking
          </div>
        )}
      </div>

      {/* Audio level indicator */}
      <div className="absolute bottom-4 right-4">
        <div className="text-xs text-white/80 mb-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">Audio Level</div>
        <div className="w-20 h-2 bg-black/50 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}