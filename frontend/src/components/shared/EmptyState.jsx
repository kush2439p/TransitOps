import React from "react";
import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", hint, action, icon: Icon = Inbox, testid }) {
  return (
    <div
      data-testid={testid}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0F0F0F] py-16 px-6 text-center"
    >
      <div className="rounded-full border border-white/10 bg-[#161616] p-3 mb-4">
        <Icon size={22} strokeWidth={1.5} className="text-zinc-500" />
      </div>
      <div className="font-display text-lg font-semibold text-white">{title}</div>
      {hint ? <div className="mt-1 text-sm text-zinc-500 max-w-md">{hint}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
