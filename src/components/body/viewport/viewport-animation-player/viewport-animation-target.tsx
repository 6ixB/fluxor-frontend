const ViewPortAnimationTarget: React.FC = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
      <circleGeometry args={[0.5, 32]} />
      <meshBasicMaterial color="#ff0000" opacity={0.8} transparent />
    </mesh>
  );
};

export { ViewPortAnimationTarget };
