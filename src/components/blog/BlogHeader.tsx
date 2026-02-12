import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import probizLogo from '@/assets/logo.png';

export function BlogHeader() {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/blogs" className="flex items-center">
          <img src={probizLogo} alt="Probiz Connect" className="h-10 md:h-12" />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/blogs"
            className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
          >
            Blogs
          </Link>
        </nav>

        {/* Admin Button */}
        <Link to="/admin">
          <Button 
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6"
          >
            Admin
          </Button>
        </Link>
      </div>
    </header>
  );
}
