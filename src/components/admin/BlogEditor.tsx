import { useState, useCallback, useRef } from 'react';
import { Plus, Trash2, GripVertical, Image, Type, Heading2, Heading3, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useImageUpload } from '@/hooks/useImageUpload';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ContentBlockType = 'paragraph' | 'heading2' | 'heading3' | 'image';

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string;
  alt?: string;
}

interface BlogEditorProps {
  initialData?: {
    id?: string;
    title?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    author?: string;
    published?: boolean;
    content?: ContentBlock[];
  };
  onSave: (data: {
    title: string;
    slug: string;
    description: string;
    coverImage: string;
    content: ContentBlock[];
    published: boolean;
    author: string;
    readingTime: string;
  }) => void;
  isLoading?: boolean;
}

export function BlogEditor({ initialData, onSave, isLoading }: BlogEditorProps) {
  const { uploadImage, isUploading } = useImageUpload();
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [author, setAuthor] = useState(initialData?.author || '');
  const [content, setContent] = useState<ContentBlock[]>(initialData?.content || []);
  const [published, setPublished] = useState(initialData?.published || false);

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        setCoverImage(url);
      }
    }
  };

  const handleContentImageUpload = async (blockId: string, file: File) => {
    const url = await uploadImage(file);
    if (url) {
      updateContentBlock(blockId, { content: url });
    }
  };

  const generateSlug = useCallback((text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!initialData?.slug) {
      setSlug(generateSlug(value));
    }
  };

  const addContentBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
    };
    setContent(prev => [...prev, newBlock]);
  };

  const updateContentBlock = (id: string, updates: Partial<ContentBlock>) => {
    setContent(prev =>
      prev.map(block =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
  };

  const removeContentBlock = (id: string) => {
    setContent(prev => prev.filter(block => block.id !== id));
  };

  const moveContentBlock = (id: string, direction: 'up' | 'down') => {
    setContent(prev => {
      const index = prev.findIndex(block => block.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const newContent = [...prev];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newContent[index], newContent[swapIndex]] = [newContent[swapIndex], newContent[index]];
      return newContent;
    });
  };

  const calculateReadingTime = () => {
    const wordCount = content
      .filter(block => block.type === 'paragraph')
      .reduce((acc, block) => acc + block.content.split(/\s+/).length, 0);
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      slug,
      description,
      coverImage,
      content,
      published,
      author,
      readingTime: calculateReadingTime(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Meta Section */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-6">
        <h2 className="font-serif text-xl font-semibold text-foreground">Post Details</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title *</label>
            <Input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Enter blog title"
              className="admin-input"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">URL Slug</label>
            <Input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="url-friendly-slug"
              className="admin-input"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Short Description *</label>
          <Textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Brief description for listing pages"
            className="admin-input min-h-[80px]"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Cover Image *</label>
          <div className="flex gap-2">
            <Input
              value={coverImage}
              onChange={e => setCoverImage(e.target.value)}
              placeholder="https://example.com/image.jpg or upload"
              className="admin-input flex-1"
              required
            />
            <input
              ref={coverImageInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => coverImageInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </Button>
          </div>
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover preview"
              className="mt-2 rounded-lg h-32 w-full object-cover"
            />
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Author</label>
          <Input
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Author name"
            className="admin-input"
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-semibold text-foreground">Content</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => addContentBlock('paragraph')}>
                <Type className="w-4 h-4 mr-2" />
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addContentBlock('heading2')}>
                <Heading2 className="w-4 h-4 mr-2" />
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addContentBlock('heading3')}>
                <Heading3 className="w-4 h-4 mr-2" />
                Heading 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addContentBlock('image')}>
                <Image className="w-4 h-4 mr-2" />
                Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {content.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-lg">
              <p>No content blocks yet. Click "Add Block" to start writing.</p>
            </div>
          )}
          
          {content.map((block, index) => (
            <div
              key={block.id}
              className="group flex gap-3 p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => moveContentBlock(block.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  ↑
                </button>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => moveContentBlock(block.id, 'down')}
                  disabled={index === content.length - 1}
                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide">
                  {block.type === 'paragraph' && <><Type className="w-3 h-3" /> Paragraph</>}
                  {block.type === 'heading2' && <><Heading2 className="w-3 h-3" /> Heading 2</>}
                  {block.type === 'heading3' && <><Heading3 className="w-3 h-3" /> Heading 3</>}
                  {block.type === 'image' && <><Image className="w-3 h-3" /> Image</>}
                </div>
                
                {block.type === 'paragraph' ? (
                  <Textarea
                    value={block.content}
                    onChange={e => updateContentBlock(block.id, { content: e.target.value })}
                    placeholder="Write your paragraph..."
                    className="admin-input min-h-[100px]"
                  />
                ) : block.type === 'image' ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={block.content}
                        onChange={e => updateContentBlock(block.id, { content: e.target.value })}
                        placeholder="Image URL or upload"
                        className="admin-input flex-1"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleContentImageUpload(block.id, file);
                          }}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          asChild
                          disabled={isUploading}
                        >
                          <span>
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          </span>
                        </Button>
                      </label>
                    </div>
                    <Input
                      value={block.alt || ''}
                      onChange={e => updateContentBlock(block.id, { alt: e.target.value })}
                      placeholder="Alt text (optional)"
                      className="admin-input"
                    />
                    {block.content && (
                      <img
                        src={block.content}
                        alt={block.alt || 'Preview'}
                        className="rounded-lg h-32 w-full object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <Input
                    value={block.content}
                    onChange={e => updateContentBlock(block.id, { content: e.target.value })}
                    placeholder={block.type === 'heading2' ? 'Heading 2 text...' : 'Heading 3 text...'}
                    className="admin-input font-serif text-lg"
                  />
                )}
              </div>
              
              <button
                type="button"
                onClick={() => removeContentBlock(block.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between p-6 bg-card rounded-lg border border-border">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
          />
          <span className="font-medium text-foreground">Publish immediately</span>
        </label>
        
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="admin-button">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              initialData?.id ? 'Update Post' : 'Create Post'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
