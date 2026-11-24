export function Sidebar({ open, children }: { open: boolean; children?: React.ReactNode }) {
  return (
    <aside
      className={`overflow-hidden transition-[width] duration-200 ease-out ${
        open ? "w-[260px]" : "w-0"
      }`}
    >
      <div className="flex h-full w-[260px] shrink-0 flex-col bg-[#eeeef1] shadow-[inset_-6px_0_16px_-8px_rgba(0,0,0,0.18)]">
        {children}
      </div>
    </aside>
  );
}
