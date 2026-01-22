import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Tag, TrendingUp, ArrowLeft, Share2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author_name: string;
  author_email: string;
  featured_image?: string;
  tags: string[];
  views: number;
  published_at: string;
  created_at: string;
  updated_at: string;
}

export default function BlogPostPage() {
  const { theme, toggleTheme } = useTheme();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/blog');
        return;
      }

      setPost(data);

      await supabase
        .from('blog_posts')
        .update({ views: data.views + 1 })
        .eq('id', data.id);

      if (data.tags.length > 0) {
        const { data: related } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('published', true)
          .neq('id', data.id)
          .contains('tags', data.tags.slice(0, 1))
          .limit(3);

        if (related) {
          setRelatedPosts(related);
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <main className="container mx-auto px-4 py-12 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="container mx-auto px-4 py-12 mt-16">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>

          <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {post.featured_image && (
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-96 object-cover"
              />
            )}

            <div className="p-8 md:p-12">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {post.title}
              </h1>

              <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-lg text-gray-700 font-medium mb-2">
                    {post.author_name}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                    <span className="mx-2">•</span>
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>{post.views} views</span>
                  </div>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <div className="prose prose-lg max-w-none blog-content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>
          </article>

          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Posts</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    to={`/blog/${relatedPost.slug}`}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    {relatedPost.featured_image ? (
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-3xl font-bold text-white opacity-50">
                          {relatedPost.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
