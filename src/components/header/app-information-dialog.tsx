import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Item } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DroneIcon, InfoIcon } from "lucide-react";
import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";
import { TOUR_STEP_IDS } from "@/lib/tour-constants";

const AppInformationDialog = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          id={TOUR_STEP_IDS.APP_INFORMATION_DIALOG}
          variant="ghost"
          size="icon"
          aria-label="App information"
        >
          <InfoIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl space-y-4">
        <DialogHeader className="-mb-1">
          <DialogTitle className="flex items-center text-2xl font-semibold">
            <DroneIcon />
            &nbsp;Fluxor
          </DialogTitle>
          <DialogDescription>
            Fluxor is an interactive <strong>3D simulation environment</strong>
            &nbsp; for exploring the trajectory dynamics of a delivery drone
            under varying wind conditions. It builds on the mathematical model
            introduced in the &nbsp;
            <a
              href="https://iopscience.iop.org/article/10.1088/1742-6596/2890/1/012052"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary font-medium underline"
            >
              original paper
            </a>
            &nbsp;by Shiven Hu.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="quickstart" className="-mb-1">
          <TabsList className="rounded-md">
            <TabsTrigger value="quickstart" className="rounded-sm">
              🚦Quick Start
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-sm">
              ✨ Features
            </TabsTrigger>
            <TabsTrigger
              value="simulation-model-explanation"
              className="rounded-sm"
            >
              🧠 How It Works
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quickstart">
            <Item variant="outline">
              <ol className="text-muted-foreground list-decimal space-y-1 pl-6 text-sm">
                <li>
                  Pick the drone&apos;s starting position, speed, and wind
                  settings.
                </li>
                <li>Set a time step for simulation precision.</li>
                <li>
                  Click <strong>Apply</strong> to run the simulation ▶️
                </li>
                <li>
                  Use playback controls to scrub through the trajectory 🎮
                </li>
              </ol>
            </Item>
          </TabsContent>
          <TabsContent value="features">
            <Item variant="outline">
              <ul className="text-muted-foreground list-disc space-y-1 pl-6 text-sm">
                <li>Set the drone&apos;s 3D starting position and speed 🛰️</li>
                <li>Adjust the time step to control numerical accuracy ⏱️</li>
                <li>Watch real-time 3D trajectory animations 🎥</li>
                <li>Inspect data through charts and time-series views 📊</li>
                <li>
                  Recreate scenarios from the paper: autonomous, non-autonomous,
                  linear, periodic, and damped oscillation wind models 🌬️
                </li>
                <li>
                  Define your own&nbsp;
                  <strong>custom wind-velocity functions</strong> in all three
                  spatial dimensions to simulate new or extreme environments 🌪️
                </li>
              </ul>
            </Item>
          </TabsContent>
          <TabsContent value="simulation-model-explanation">
            <Item variant="outline">
              <section className="space-y-2">
                <p className="text-muted-foreground text-sm">
                  The drone follows nonlinear first-order differential equations
                  as it flies toward the delivery target. In the original 2D
                  model, the position (x, y) evolves under the combined effect
                  of drone velocity and wind components (wₓ, wᵧ). When the wind
                  varies with time, the system becomes non-autonomous, and the
                  path is computed using a&nbsp;
                  <strong>4th-order Runge-Kutta method</strong>, matching the
                  numerical approach used in the paper.
                </p>
                <div className="bg-muted text-muted-foreground mt-2 space-y-2 rounded-md px-3 py-2 text-xs">
                  <div className="pt-2 font-semibold">
                    3D extension used in Fluxor:
                  </div>
                  <TeX
                    block
                    math={String.raw`\frac{dx}{dt} = w_x - \frac{x}{\sqrt{x^2 + y^2 + z^2}}\, b`}
                  />
                  <TeX
                    block
                    math={String.raw`\frac{dy}{dt} = w_y - \frac{y}{\sqrt{x^2 + y^2 + z^2}}\, b`}
                  />
                  <TeX
                    block
                    math={String.raw`\frac{dz}{dt} = w_z - \frac{z}{\sqrt{x^2 + y^2 + z^2}}\, b`}
                  />
                </div>
              </section>
            </Item>
          </TabsContent>
        </Tabs>
        <DialogFooter className="text-muted-foreground flex items-center text-xs">
          Built by&nbsp;
          <a
            href="https://github.com/6ixB"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary font-medium underline"
          >
            6ixB
          </a>
          <Avatar>
            <AvatarImage src="https://avatars.githubusercontent.com/u/124480418?v=4" />
            <AvatarFallback>6xiB</AvatarFallback>
          </Avatar>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { AppInformationDialog };
