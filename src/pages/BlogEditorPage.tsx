import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Eye, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { Header } from '../components/Header';
import { useTheme } from '../hooks/useTheme';

interface BlogPostForm {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  tags: string;
  published: boolean;
}

export default function BlogEditorPage() {
  const { theme, toggleTheme } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogPostForm>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    tags: '',
    published: false,
  });

  useEffect(() => {
    checkAuth();
  }, [id]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/blog/login', { state: { from: `/blog/admin/${id}` } });
      return;
    }
    setUser(user);

    if (id && id !== 'new') {
      loadPost(id);
    }
  };

  const loadPost = async (postId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', postId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setForm({
          title: data.title,
          slug: data.slug,
          content: data.content,
          excerpt: data.excerpt,
          featured_image: data.featured_image || '',
          tags: data.tags.join(', '),
          published: data.published,
        });
      }
    } catch (error) {
      console.error('Error loading post:', error);
      alert('Failed to load post');
      navigate('/blog/admin');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: generateSlug(title) });
  };

  const handleSave = async (publish: boolean) => {
    if (!form.title || !form.content || !form.excerpt) {
      alert('Please fill in title, content, and excerpt');
      return;
    }

    if (!user) return;

    setSaving(true);
    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

      const postData = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        featured_image: form.featured_image || null,
        tags,
        published: publish,
        author_name: 'Admin',
        author_email: user.email,
      };

      if (id && id !== 'new') {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        alert('Post updated successfully!');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        alert('Post created successfully!');
      }

      navigate('/blog/admin');
    } catch (error: any) {
      console.error('Error saving post:', error);
      if (error.code === '23505') {
        alert('A post with this slug already exists. Please use a different title.');
      } else {
        alert('Failed to save post');
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 py-12 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/blog/admin')}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                {form.published ? 'Update & Publish' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              {id === 'new' ? 'Create New Post' : 'Edit Post'}
            </h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug (URL) *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">/blog/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="post-url-slug"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt (Summary) *
                </label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of your post (shown in listings)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={form.featured_image}
                      onChange={(e) => setForm({ ...form, featured_image: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                {form.featured_image && (
                  <img
                    src={form.featured_image}
                    alt="Preview"
                    className="mt-2 w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content * (HTML supported)
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your post content here... You can use HTML tags like <p>, <h2>, <strong>, <em>, <ul>, <ol>, etc."
                />
                <p className="mt-2 text-sm text-gray-500">
                  Tip: You can use HTML formatting. Example: &lt;p&gt;Paragraph&lt;/p&gt; &lt;h2&gt;Heading&lt;/h2&gt;
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="technology, tutorial, news"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
