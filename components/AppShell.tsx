interface AppShellProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}

export default function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {sidebar}
      <main className="flex-1 bg-[var(--color-arena)] p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}