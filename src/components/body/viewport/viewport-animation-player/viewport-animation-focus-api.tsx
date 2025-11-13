import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

export type FocusAPI = {
  focus: (
    pos?: [number, number, number],
    target?: [number, number, number],
  ) => void;
};

export const ViewportFocusApi: React.FC<{
  apiRef: React.RefObject<FocusAPI | null>;
}> = ({ apiRef }) => {
  const { camera } = useThree();

  useEffect(() => {
    apiRef.current = {
      focus: (pos = [5, 5, 5], target = [0, 0, 0]) => {
        camera.position.set(...pos);
        camera.lookAt(...target);
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, camera]);

  return null;
};
