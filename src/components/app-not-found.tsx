import { AppLayout } from "./app-layout";
import { Button } from "@/components/ui/button";
import { DroneIcon } from "lucide-react";
import { NavLink } from "react-router";

const AppNotFound: React.FC = () => {
  return (
    <AppLayout>
      <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative flex h-56 w-[220px] items-center justify-center rounded-2xl sm:h-[260px] sm:w-[300px] md:h-80 md:w-[380px]">
          <img
            src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
            alt="404 illustration"
            className="h-[60%] object-contain invert-100 dark:invert-0"
          />
        </div>
        <h3 className="text-foreground -mt-12 mb-2 text-2xl font-bold sm:-mt-14 sm:text-4xl">
          Whoops!
        </h3>
        <p className="text-muted-foreground max-w-xs text-sm sm:max-w-sm sm:text-base">
          The page you're looking for isn't found. We suggest going back to the
          main app.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 rounded-lg text-base shadow-sm"
        >
          <NavLink to="/" end>
            <DroneIcon className="size-4" />
            Back to app
          </NavLink>
        </Button>
      </div>
    </AppLayout>
  );
};

export { AppNotFound };
