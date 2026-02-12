export function BlogFooter() {
  return (
    <footer className="border-t border-blog-divider mt-16 py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-serif text-xl font-bold text-foreground">
            Probiz Blog
          </p>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved by Probiz Connect.
          </p>
        </div>
      </div>
    </footer>
  );
}
