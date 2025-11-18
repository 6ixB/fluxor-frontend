import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router";
import { DroneIcon } from "lucide-react";

const AppNotFound: React.FC = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <div className="relative mb-4">
          <motion.div
            initial={{ scale: 0.7, filter: "blur(10px)" }}
            animate={{
              scale: 1,
              filter: "blur(0px)",
              y: [0, -8, 0],
              rotate: [42, 48, 42],
            }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
              y: {
                duration: 2.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              rotate: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          >
            <DroneIcon className="text-primary size-32 stroke-1" />
          </motion.div>
        </div>
        <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
        <h3 className="mb-1.5 text-3xl font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The page you&apos;re looking for isn&apos;t found, we suggest you back
          to home.
        </p>
        <Button asChild size="lg" className="rounded-lg text-base shadow-sm">
          <NavLink to="/" end>
            Back to home page
          </NavLink>
        </Button>
      </div>
      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-2xl bg-black"></div>
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
          alt="404 illustration"
          className="absolute top-1/2 left-1/2 h-[clamp(260px,25vw,406px)] -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export { AppNotFound };
