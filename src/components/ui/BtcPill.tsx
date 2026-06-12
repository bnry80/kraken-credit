export function BtcPill({ className }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        background:
          "linear-gradient(165deg, #e2f5b8 0%, #c5e876 35%, #a8d85a 65%, #8fc94a 100%)",
        boxShadow:
          "0 14px 28px rgba(120,170,60,0.25), inset 0 3px 6px rgba(255,255,255,0.55), inset 0 -4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <span className="font-diatype text-[15px] font-bold tracking-[0.12em] text-[#4a6b28]">
        BTC
      </span>
    </div>
  );
}
