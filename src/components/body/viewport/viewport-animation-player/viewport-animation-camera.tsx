import { CameraControls } from "@react-three/drei";
import { useEffect } from "react";

type ViewPortAnimationCameraProps = {
  cameraControlsRef: React.RefObject<CameraControls | null>;
};

const ViewPortAnimationCamera: React.FC<ViewPortAnimationCameraProps> = ({
  cameraControlsRef,
}) => {
  useEffect(() => {
    if (!cameraControlsRef.current) return;

    cameraControlsRef.current.setLookAt(
      4,
      4,
      4, // camera position
      0,
      0,
      0, // target
      false,
    );

    cameraControlsRef.current.saveState();
  }, [cameraControlsRef]);

  return <CameraControls ref={cameraControlsRef} makeDefault />;
};

export { ViewPortAnimationCamera };
