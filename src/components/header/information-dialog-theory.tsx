import TeX from "@matejmazur/react-katex";
import "katex/dist/katex.min.css";

const InformationDialogTheory: React.FC = () => {
  return (
    <section className="space-y-2">
      <p className="text-muted-foreground text-sm">
        The drone follows nonlinear first-order differential equations as it
        flies toward the delivery target. In the original 2D model, the
        position (x, y) evolves under the combined effect of drone velocity
        and wind components (wₓ, wᵧ). When the wind varies with time, the
        system becomes non-autonomous, and the path is computed using a&nbsp;
        <strong>4th-order Runge-Kutta method</strong>, matching the numerical
        approach used in the paper.
      </p>
      <div className="bg-muted text-muted-foreground mt-2 space-y-2 rounded-md px-3 py-2 text-xs">
        <div className="pt-2 font-semibold">3D extension used in Fluxor:</div>
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
  );
};

export default InformationDialogTheory;
