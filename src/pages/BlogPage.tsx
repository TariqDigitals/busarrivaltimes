import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, TrendingUp } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  featured_image?: string;
  tags: string[];
  views: number;
  published_at: string;
  created_at: string;
}

export default function BlogPage() {
  const { theme, toggleTheme } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [selectedTag]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog</h1>
            <p className="text-xl text-gray-600">
              Insights, updates, and stories from our journey
            </p>
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedTag
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                All Posts
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600">No blog posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map(post => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {post.featured_image ? (
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-4xl font-bold text-white opacity-50">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(post.published_at || post.created_at)}</span>
                      <span className="mx-2">•</span>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>{post.views} views</span>
                    </div>

                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
