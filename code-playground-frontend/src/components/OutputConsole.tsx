import React, { useEffect } from "react";
import { useRoom } from "@/hooks/useRoom";
import { ChevronRight } from "lucide-react";

const OutputConsole: React.FC<{ roomId: string | undefined }> = ({
  roomId,
}) => {
  const { consoleEntries } = useRoom(roomId!);

  useEffect(() => console.log(consoleEntries), [consoleEntries]);

  return (
    <div className="h-[45%] flex-1 bg-zinc-800 rounded-lg py-4">
      <div className="font-semibold text-md px-4 pb-2 border-b border-b-zinc-600">
        Console
      </div>
      <div className="p-4 text-xs text-zinc-300 overflow-y-scroll scrollbar-hide flex flex-col items-stretch gap-3 font-firaCode ">
        {consoleEntries.length === 0
          ? "Nothing to show yet. Run your code first."
          : consoleEntries.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-red-700">
                <ChevronRight size={12} strokeWidth={3} />
                <span className="text-zinc-400">{entry}</span>
              </div>
            ))}
      </div>
    </div>
  );
};

export default OutputConsole;
