// ---------------------------------------------------------------------------
// iOS-native spring system.
//
// Apple (UIKit `UISpringTimingParameters`, SwiftUI `Spring(response:dampingFraction:)`)
// describes springs with two intuitive numbers rather than raw stiffness/damping:
//   - response:        ~ how long the spring takes to settle (seconds)
//   - dampingFraction: 0 = bouncy forever, 1 = no overshoot (critically damped)
//
// framer-motion wants stiffness/damping/mass, so we convert with the exact
// physics Apple uses (mass = 1):
//   stiffness k = (2π / response)²
//   damping   c = 4π · dampingFraction / response
//
// Using these means our web motion is numerically identical to a SwiftUI/UIKit
// spring with the same parameters — the whole point of "feels native".
// ---------------------------------------------------------------------------

export interface SpringConfig {
  type: "spring";
  stiffness: number;
  damping: number;
  mass: number;
}

export function iosSpring(
  response: number,
  dampingFraction: number,
  mass = 1,
): SpringConfig {
  const stiffness = ((2 * Math.PI) / response) ** 2 * mass;
  const damping = ((4 * Math.PI * dampingFraction) / response) * mass;
  return { type: "spring", stiffness, damping, mass };
}

export const springs = {
  /** SwiftUI `.smooth` — no overshoot. Default for most state changes. */
  smooth: iosSpring(0.4, 1),
  /** SwiftUI `.snappy` — tiny overshoot, crisp. Great for taps & selections. */
  snappy: iosSpring(0.34, 0.86),
  /** SwiftUI `.bouncy` — playful overshoot. Eggs, celebratory pops. */
  bouncy: iosSpring(0.5, 0.7),
  /** Soft settle for content entrances. */
  gentle: iosSpring(0.5, 0.95),
  /** Fast, near-instant press feedback (UIButton highlight). */
  press: iosSpring(0.22, 0.86),
  /** UIKit navigation push/pop feel. */
  nav: iosSpring(0.46, 0.92),
  /** Quick snap-back when a gesture is cancelled. */
  cancel: iosSpring(0.3, 0.9),
} as const;
