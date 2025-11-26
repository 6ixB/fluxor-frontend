import { Grid } from "@react-three/drei";

const gridConfig = {
  cellSize: 0.5,
  cellThickness: 0.5,
  cellColor: "#6f6f6f",
  sectionSize: 3,
  sectionThickness: 1,
  sectionColor: "#0000ff",
  fadeDistance: 30,
  fadeStrength: 1,
  followCamera: false,
  infiniteGrid: true,
};

const ViewPortAnimationGround: React.FC = () => {
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
};

export { ViewPortAnimationGround };
