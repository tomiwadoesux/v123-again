

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Add console log here to confirm component initialization
console.log('ThreeSection: Component initialized');

// Dynamic import for ThreeScene
const ThreeScene = dynamic(() => import('.//ThreeScene'), {
  ssr: false, // Disable SSR
});

const ThreeSection = () => {
  const divRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const hemiLight = new THREE.HemisphereLight("#ffffff", "#444444", 0.8);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight1 = new THREE.DirectionalLight("#ffffff", 1.2);
  dirLight1.position.set(5, 10, 7.5);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.width = 1024;
  dirLight1.shadow.mapSize.height = 1024;
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight("#ffffff", 0.6);
  dirLight2.position.set(-5, 8, -2);
  dirLight2.castShadow = true;
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight("#ffffff", 0.3);
  scene.add(ambientLight);
  // Lazy load when section enters viewport
  useEffect(() => {
    // Add console log here to confirm observer setup
    console.log('ThreeSection: Setting up IntersectionObserver');
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Add console log here to track visibility
        console.log('ThreeSection: IntersectionObserver triggered, isIntersecting:', entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          // Add console log here to confirm isVisible change
          console.log('ThreeSection: isVisible set to true, requesting ThreeScene chunk');
        }
      },
      { threshold: 0.1 }
    );
      
    if (divRef.current) {
      observer.observe(divRef.current);
      // Add console log here to confirm observation
      console.log('ThreeSection: Observing divRef');
    }

    return () => {
      // Add console log here for cleanup
      console.log('ThreeSection: Cleaning up IntersectionObserver');
      observer.disconnect();
    };
  }, []);

  // Track container size for scaling
  useEffect(() => {
    console.log('ThreeSection: Setting up resize listener');
    const updateSize = () => {
      if (divRef.current) {
        const { width, height } = divRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        // Add console log here to track size updates
        console.log('ThreeSection: Container size updated:', { width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => {
      console.log('ThreeSection: Cleaning up resize listener');
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <div
      ref={divRef}
      style={{
        width: '100%',
        height: '500px', // Adjust as needed
        position: 'relative',
      }}
    >
      {isVisible ? (
        <>
          {/* Add console log here to confirm ThreeScene render attempt */}
          {console.log('ThreeSection: Attempting to render ThreeScene with containerSize:', containerSize)}
          <ThreeScene containerSize={containerSize} />
        </>
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f0f0f0',
          }}
        >
          Loading 3D Model...
        </div>
      )}
    </div>
  );
};

export default ThreeSection;