"use client";

import CountUp from "react-countup";
import { useInView } from "framer-motion";
import { useMemo, useRef } from "react";

type AnimatedCounterProps = {
  value: string;
  className?: string;
};

function parseCounter(value: string) {
  const match = value.match(/([\d,.]+)/);
  const numericValue = match ? Number(match[1].replace(/,/g, "")) : 0;
  const prefix = match ? value.slice(0, match.index) : "";
  const suffix = match ? value.slice((match.index ?? 0) + match[0].length) : value;
  return { numericValue, prefix, suffix };
}

export default function AnimatedCounter({
  value,
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const { numericValue, prefix, suffix } = useMemo(() => parseCounter(value), [value]);

  return (
    <span ref={ref} className={className}>
      {inView ? (
        <CountUp
          end={numericValue}
          duration={2.2}
          separator=","
          decimals={Number.isInteger(numericValue) ? 0 : 1}
          prefix={prefix}
          suffix={suffix}
        />
      ) : (
        `${prefix}0${suffix}`
      )}
    </span>
  );
}
