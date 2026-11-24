export function Sidebar({ open, children }: { open: boolean; children?: React.ReactNode }) {
  return (
    <aside
      className={`overflow-hidden transition-[width] duration-200 ease-out ${
        open ? "w-[260px]" : "w-0"
      }`}
    >
      <div className="flex h-full w-[260px] shrink-0 flex-col bg-[#eeeef1]">{children}</div>
    </aside>
  );
}
