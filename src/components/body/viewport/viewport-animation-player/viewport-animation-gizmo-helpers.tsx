import { GizmoHelper, GizmoViewport } from "@react-three/drei";

const ViewPortAnimationGizmoHelpers: React.FC = () => {
  return (
    <GizmoHelper alignment="top-right" margin={[80, 120]}>
      <GizmoViewport axisColors={["red", "green", "blue"]} labelColor="white" />
    </GizmoHelper>
  );
};

export { ViewPortAnimationGizmoHelpers };
