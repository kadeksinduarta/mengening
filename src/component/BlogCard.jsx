import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogCard = ({ blog }) => {
  const router = useRouter();

  // Function to strip HTML tags and decode basic entities
  const cleanContent = (html) => {
    if (!html) return '';
    return html
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => router.push(`/blog/${blog.id}`)}
      className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col cursor-pointer transition-all duration-500 h-full"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {blog.image_url ? (
          <>
            <img
              src={blog.image_url}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full bg-slate-50 flex items-center justify-center">
            <div className="text-slate-200">No Image</div>
          </div>
        )}
        <div className="absolute bottom-6 left-6">
          <span className="px-5 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 shadow-xl border border-white/50">
            Article
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 md:p-10 flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Calendar size={13} className="text-blue-500/60" />
            {new Date(blog.published_date || blog.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </div>
          <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
          <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <User size={13} className="text-blue-500/60" />
            {blog.author || 'Admin'}
          </div>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-4 line-clamp-2 min-h-[4rem] group-hover:text-blue-600 transition-colors leading-tight tracking-tight">
          {blog.title}
        </h2>

        <p className="text-slate-400 text-sm font-bold line-clamp-3 mb-8 leading-relaxed italic opacity-80 flex-grow">
          "{cleanContent(blog.content)}"
        </p>

        <div className="pt-8 border-t border-dashed border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
            Read Full Story <ArrowRight size={16} />
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all">
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
