import { SidebarSimple } from "@phosphor-icons/react";
import { Sidebar } from "@repo/ui";
import { useState } from "react";

function App(): React.JSX.Element {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#fdfdfd]">
      <Sidebar open={open} />
      <main className="flex-1" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="fixed top-3 left-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
      >
        <SidebarSimple size={20} />
      </button>
    </div>
  );
}

export default App;
