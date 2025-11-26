import { ViewPort } from "@/components/body/viewport/viewport";

const Body: React.FC = () => {
  return (
    <div className="flex h-full w-full flex-1 overflow-y-hidden">
      <ViewPort />
    </div>
  );
};

export { Body };
