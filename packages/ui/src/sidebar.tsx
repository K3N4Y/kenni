export function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col bg-[#eeeef1]">
      {children}
    </aside>
  );
}
