import { SidebarIcon } from "@phosphor-icons/react";
import { Sidebar } from "@repo/ui";
import { useState } from "react";

function ToggleSidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
      className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
    >
      <SidebarIcon size={20} />
    </button>
  );
}

function App(): React.JSX.Element {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((v) => !v);

  return (
    <div className="flex h-screen bg-[#fdfdfd]">
      {open && (
        <Sidebar>
          <div className="p-3">
            <ToggleSidebar open={open} onToggle={toggle} />
          </div>
        </Sidebar>
      )}
      <main className="flex-1 p-3">{!open && <ToggleSidebar open={open} onToggle={toggle} />}</main>
    </div>
  );
}

export default App;
