import type { SVGProps } from "react";

/** Ikon versi "fill" (lucide hanya menyediakan versi garis). */
type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & { size?: number };

function svgProps({ size = 24, ...rest }: IconProps): SVGProps<SVGSVGElement> {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export function TicketFill(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        fillRule="evenodd"
        d="M5 5h14a2 2 0 0 1 2 2v2.5a2.5 2.5 0 0 0 0 5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2.5a2.5 2.5 0 0 0 0-5V7a2 2 0 0 1 2-2Zm9 2.2v2h1.6v-2H14Zm0 3.8v2h1.6v-2H14Zm0 3.8v2h1.6v-2H14Z"
      />
    </svg>
  );
}

export function PinFill(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        fillRule="evenodd"
        d="M12 2a7.5 7.5 0 0 0-7.5 7.5C4.5 15 12 22 12 22s7.5-7 7.5-12.5A7.5 7.5 0 0 0 12 2Zm0 10.2a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4Z"
      />
    </svg>
  );
}

export function HomeFill(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path d="M2.8 10.4 12 3l9.2 7.4a.9.9 0 0 1-.56 1.6H19.5v7.8a1.2 1.2 0 0 1-1.2 1.2h-3.8v-5.6a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1V21H5.7a1.2 1.2 0 0 1-1.2-1.2V12H3.36a.9.9 0 0 1-.56-1.6Z" />
    </svg>
  );
}

export function CompassFill(props: IconProps) {
  return (
    <svg {...svgProps(props)}>
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.4 5.6-2.3 6.5-6.5 2.3 2.3-6.5 6.5-2.3ZM12 13.3a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Z"
      />
    </svg>
  );
}
