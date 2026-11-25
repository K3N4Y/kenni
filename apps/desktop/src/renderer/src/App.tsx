import { SidebarIcon } from "@phosphor-icons/react";
import { Sidebar } from "@repo/ui";
import { useState } from "react";
import logo from "./assets/Logo.svg";

function App() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-[#fdfdfd]">
      <Sidebar open={open}>
        <div className="mt-3 flex h-8 items-center gap-1.5 pr-4 pl-[52px]">
          <img src={logo} alt="" className="h-5 w-auto" />
          <span className="translate-y-px text-base leading-5 font-semibold text-neutral-800">
            Code
          </span>
        </div>
      </Sidebar>
      <main className="flex-1" />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="fixed top-3 left-3 rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
      >
        <SidebarIcon size={20} />
      </button>
    </div>
  );
}

export default App;
