import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Center, OrbitControls, useGLTF } from '@react-three/drei'
import { Box3, Vector3 } from 'three'

function MissileModel() {
  const { scene } = useGLTF('/models/missile_fateh_110.glb')
  const model = useMemo(() => scene.clone(), [scene])
  const normalizedScale = useMemo(() => {
    const box = new Box3().setFromObject(model)
    const size = new Vector3()
    box.getSize(size)
    const maxDimension = Math.max(size.x, size.y, size.z) || 1

    return 2.5 / maxDimension
  }, [model])

  return (
    <group position={[0.45, 0.02, 0]}>
      <Center>
        <primitive object={model} rotation={[0.06, -1.18, -0.03]} scale={normalizedScale} />
      </Center>
    </group>
  )
}

function HeroMissileViewer({ onPointerDown, onPointerUp }) {
  return (
    <div className="hero-missile-viewer">
      <Canvas
        camera={{ position: [0, 0.08, 10.8], fov: 22 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[8, 6, 10]} intensity={2.3} color="#f8fafc" />
        <directionalLight position={[-8, -3, -6]} intensity={0.75} color="#6b7280" />
        <pointLight position={[2.5, 1.5, 3.5]} intensity={1.1} color="#dbeafe" />

        <Suspense fallback={null}>
          <MissileModel />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          target={[0.35, 0, 0]}
          minPolarAngle={Math.PI / 2.7}
          maxPolarAngle={Math.PI / 1.75}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/missile_fateh_110.glb')

export default HeroMissileViewer
