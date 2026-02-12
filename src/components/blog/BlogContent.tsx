interface BlogContentBlock {
  id: string;
  type: 'paragraph' | 'heading2' | 'heading3' | 'image';
  content: string;
  alt?: string;
}

interface BlogContentProps {
  content: BlogContentBlock[];
}

export function BlogContentRenderer({ content }: BlogContentProps) {
  return (
    <div className="blog-content">
      {content.map((block, index) => {
        const delay = `${index * 100}ms`;
        
        switch (block.type) {
          case 'heading2':
            return (
              <h2 
                key={block.id} 
                className="slide-up"
                style={{ animationDelay: delay }}
              >
                {block.content}
              </h2>
            );
          case 'heading3':
            return (
              <h3 
                key={block.id}
                className="slide-up"
                style={{ animationDelay: delay }}
              >
                {block.content}
              </h3>
            );
          case 'paragraph':
            return (
              <p 
                key={block.id}
                className="slide-up"
                style={{ animationDelay: delay }}
              >
                {block.content}
              </p>
            );
          case 'image':
            return (
              <figure 
                key={block.id}
                className="slide-up"
                style={{ animationDelay: delay }}
              >
                <img
                  src={block.content}
                  alt={block.alt || 'Blog image'}
                  className="rounded-lg shadow-md"
                />
                {block.alt && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-3">
                    {block.alt}
                  </figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
