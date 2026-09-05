import { useState } from "react";
import { Toaster } from "sonner";
import { MemoApp } from "@/components/notes/memo-app";
import { ThemeProvider, useTheme } from "@/components/theme";

export function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}

function Shell() {
  const [selectedId, setSelectedId] = useState<string>();
  const { theme } = useTheme();
  return (
    <>
      <MemoApp selectedId={selectedId} onSelect={setSelectedId} />
      <Toaster theme={theme} position="bottom-right" richColors={false} />
    </>
  );
}
