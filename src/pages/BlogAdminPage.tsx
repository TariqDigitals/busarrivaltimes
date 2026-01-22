import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, TrendingUp, LogOut } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export default function BlogAdminPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/blog/login', { state: { from: '/blog/admin' } });
      return;
    }
    setUser(user);
    fetchPosts(user.email!);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/blog/login');
  };

  const fetchPosts = async (email: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, published, views, created_at, updated_at')
        .eq('author_email', email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== id));
      alert('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ published: !post.published })
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.map(p =>
        p.id === post.id ? { ...p, published: !p.published } : p
      ));
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert('Failed to update post');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 py-12 mt-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600">Please sign in to access the blog admin panel.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog Admin</h1>
              <p className="text-gray-600">
                Logged in as: <span className="font-medium">{user?.email}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              <Link
                to="/blog/admin/new"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Post
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-xl text-gray-600 mb-4">No blog posts yet</p>
              <Link
                to="/blog/admin/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Your First Post
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {post.title}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            post.published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(post.created_at)}</span>
                        <span className="mx-2">•</span>
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span>{post.views} views</span>
                        <span className="mx-2">•</span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          /blog/{post.slug}
                        </code>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.published
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        {post.published ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>

                      <Link
                        to={`/blog/admin/${post.id}`}
                        className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
