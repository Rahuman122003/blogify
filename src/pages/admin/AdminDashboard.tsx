import { Link } from 'react-router-dom';
import { useAllBlogs, useDeleteBlog, useTogglePublish } from '@/hooks/useBlogs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { format } from 'date-fns';
import { Edit, Trash2, Eye, EyeOff, PlusCircle, Home, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AdminDashboard() {
  const { data: blogs = [], isLoading } = useAllBlogs();
  const deleteBlog = useDeleteBlog();
  const togglePublish = useTogglePublish();

  const handleDelete = (id: string) => {
    deleteBlog.mutate(id);
  };

  const handleTogglePublish = (id: string, currentStatus: boolean) => {
    togglePublish.mutate({ id, published: !currentStatus });
  };

  const publishedCount = blogs.filter(b => b.published).length;
  const draftCount = blogs.filter(b => !b.published).length;

  return (
    <AdminLayout>
      <div className="fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your blog posts</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/blogs">
              <Button variant="outline" className="admin-button-secondary">
                <Home className="w-4 h-4 mr-2" />
                Blog Home
              </Button>
            </Link>
            <Link to="/admin/blogs/new">
              <Button className="admin-button">
                <PlusCircle className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Posts</p>
            <p className="text-3xl font-bold text-foreground mt-2">{blogs.length}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Published</p>
            <p className="text-3xl font-bold text-admin-success mt-2">{publishedCount}</p>
          </div>
          <div className="bg-card rounded-lg p-6 border border-border">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Drafts</p>
            <p className="text-3xl font-bold text-admin-warning mt-2">{draftCount}</p>
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Post</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground text-sm">Date</th>
                    <th className="text-right p-4 font-medium text-muted-foreground text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {blogs.map(blog => (
                    <tr key={blog.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={blog.cover_image || '/placeholder.svg'}
                            alt={blog.title}
                            className="w-16 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-foreground line-clamp-1">{blog.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">{blog.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          blog.published
                            ? 'bg-admin-success/10 text-admin-success'
                            : 'bg-admin-warning/10 text-admin-warning'
                        }`}>
                          {blog.published ? (
                            <>
                              <Eye className="w-3 h-3" />
                              Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" />
                              Draft
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(new Date(blog.created_at), 'MMM d, yyyy')}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePublish(blog.id, blog.published)}
                            disabled={togglePublish.isPending}
                            title={blog.published ? 'Unpublish' : 'Publish'}
                          >
                            {blog.published ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Link to={`/admin/blogs/${blog.id}/edit`}>
                            <Button variant="ghost" size="sm" title="Edit">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" title="Delete">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(blog.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {blogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-muted-foreground">
                        No posts yet. Create your first post to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
