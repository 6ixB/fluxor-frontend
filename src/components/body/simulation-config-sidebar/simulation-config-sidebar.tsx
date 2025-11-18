import { SimulationConfigForm } from "@/components/body/simulation-config-sidebar/simulation-config-form";

const SimulationConfigSidebar: React.FC = () => {
  return (
    <div className="bg-background h-full w-96 border-r border-neutral-200 dark:border-neutral-800">
      <SimulationConfigForm />
    </div>
  );
};

export { SimulationConfigSidebar };
