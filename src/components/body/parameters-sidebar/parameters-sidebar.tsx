import { ParametersForm } from "@/components/body/parameters-sidebar/parameters-form";

const ParametersSidebar: React.FC = () => {
  return (
    <div className="bg-background h-full w-96 border-r border-neutral-200 dark:border-neutral-800">
      <ParametersForm />
    </div>
  );
};

export { ParametersSidebar };
