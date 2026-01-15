import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const BlogCard = ({ blog }) => {
  const router = useRouter();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      onClick={() => router.push(`/blog/${blog.id}`)}
      className="bg-white shadow-md rounded-2xl overflow-hidden border hover:shadow-lg flex flex-col cursor-pointer"
    >
      {blog.image_url && (
        <img
          src={blog.image_url}
          alt={blog.title}
          className="h-48 w-full object-cover"
        />
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {blog.content?.replace(/<[^>]*>/g, '')}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              Oleh <span className="font-semibold">{blog.author}</span>
            </p>
            <p className="text-xs text-gray-400">
              {new Date(blog.published_date).toLocaleDateString('id-ID')}
            </p>
          </div>
          <span className="text-blue-600 text-sm font-semibold hover:underline">
            Baca →
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
