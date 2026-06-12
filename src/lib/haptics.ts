// ---------------------------------------------------------------------------
// Haptics abstraction.
//
// On the web we can only best-effort via the Vibration API (Android/Chrome).
// iOS Safari intentionally ignores `navigator.vibrate`, so on a web build these
// are silent on iPhone — but the abstraction mirrors UIKit's feedback
// generators (UIImpactFeedbackGenerator / UISelectionFeedbackGenerator /
// UINotificationFeedbackGenerator). When this is wrapped for native (Capacitor,
// React Native, or a SwiftUI port), swap the `vibrate` implementation for the
// real generators and every call site already maps 1:1.
// ---------------------------------------------------------------------------

type ImpactStyle = "light" | "medium" | "heavy" | "soft" | "rigid";

const canVibrate =
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

function vibrate(pattern: number | number[]) {
  if (canVibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* no-op */
    }
  }
}

const IMPACT: Record<ImpactStyle, number> = {
  soft: 4,
  light: 6,
  rigid: 8,
  medium: 11,
  heavy: 16,
};

export const haptics = {
  /** Light tick when a value/selection changes (UISelectionFeedbackGenerator). */
  selection() {
    vibrate(5);
  },
  /** Physical impact when something lands (UIImpactFeedbackGenerator). */
  impact(style: ImpactStyle = "light") {
    vibrate(IMPACT[style]);
  },
  /** Notification feedback — success / warning / error. */
  success() {
    vibrate([7, 45, 12]);
  },
  warning() {
    vibrate([10, 35, 10]);
  },
  error() {
    vibrate([14, 30, 14, 30, 16]);
  },
};
