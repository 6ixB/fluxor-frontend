import { TrafficConeIcon } from "lucide-react";

const AppGlobalError: React.FC = () => {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center text-center">
      <TrafficConeIcon className="size-20" />
      <h3 className="text-foreground mt-2 mb-2 text-2xl font-bold sm:text-4xl">
        Something went wrong :(
      </h3>
      <p className="text-muted-foreground max-w-xs text-sm sm:max-w-sm sm:text-base">
        Please contact the web app administrator and try again later 😭🙏.
      </p>
    </div>
  );
};

export { AppGlobalError };
