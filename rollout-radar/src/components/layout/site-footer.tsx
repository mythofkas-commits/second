export function SiteFooter() {
  return (
    <footer className="border-t bg-background/90">
      <div className="container flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} Rollout Radar. Stay ahead of feature rollouts.</p>
        <nav className="flex gap-4">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">
            GitHub
          </a>
          <a href="/deploy" className="hover:text-foreground">
            Deploy guide
          </a>
        </nav>
      </div>
    </footer>
  );
}
