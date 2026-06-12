import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { Delete } from "lucide-react";
import { springs } from "../../lib/springs";
import { haptics } from "../../lib/haptics";
import { Pressable } from "./Pressable";

interface Props {
  open: boolean;
  onKey: (digit: string) => void;
  onDelete: () => void;
  onDone: () => void;
  onClose: () => void;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function Keypad({ open, onKey, onDelete, onDone, onClose }: Props) {
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 520) {
      haptics.impact("light");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="absolute inset-0 z-40 bg-[rgba(57,57,57,0.25)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 flex flex-col items-center gap-[45px] rounded-t-[46px] bg-white px-2 pb-[max(24px,env(safe-area-inset-bottom))] pt-3 drop-shadow-[0_-6px_15.9px_rgba(0,0,0,0.25)]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springs.nav}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={onDragEnd}
          >
            <div className="h-[4px] w-[50px] rounded-[10px] bg-[#404040]" />

            <div className="flex w-full flex-col gap-[6px]">
              {[DIGITS.slice(0, 3), DIGITS.slice(3, 6), DIGITS.slice(6, 9)].map(
                (row, i) => (
                  <div key={i} className="flex gap-[6px]">
                    {row.map((d) => (
                      <Key key={d} onPress={() => onKey(d)}>
                        {d}
                      </Key>
                    ))}
                  </div>
                ),
              )}
              <div className="flex gap-[6px]">
                <div className="flex-1" />
                <Key onPress={() => onKey("0")}>0</Key>
                <Key onPress={onDelete} haptic="light" plain>
                  <Delete className="h-[26px] w-[26px] text-[#595959]" strokeWidth={1.6} />
                </Key>
              </div>
            </div>

            <div className="flex w-full justify-end px-[11px]">
              <Pressable
                onClick={onDone}
                haptic="medium"
                scale={0.96}
                className="flex items-center gap-[10px] rounded-[40px] bg-black px-[28px] py-[20px] text-[16px] font-medium tracking-[-0.04em] text-white"
              >
                Next
                <span className="text-[15px]">→</span>
              </Pressable>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Key({
  children,
  onPress,
  plain,
  haptic = "selection",
}: {
  children: React.ReactNode;
  onPress: () => void;
  plain?: boolean;
  haptic?: "selection" | "light";
}) {
  return (
    <Pressable
      onClick={onPress}
      haptic={haptic}
      scale={0.93}
      dim={false}
      className={[
        "flex h-[50px] flex-1 items-center justify-center rounded-[8.5px] text-[23px] font-medium tracking-[-0.01em] text-black",
        plain ? "" : "bg-[#f1f1f3] active:bg-[#e3e3e7]",
      ].join(" ")}
    >
      {children}
    </Pressable>
  );
}
