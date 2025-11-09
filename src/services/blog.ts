import { PrismaClient, Prisma } from '@prisma/client';
import { blogSchema } from '../models/blogs';
import { z } from 'zod';
import cloudinary from '../config/cloudinary';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Helper function to extract public_id from Cloudinary URL
const extractPublicIdFromUrl = (url: string): string | null => {
  try {
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;
    
    const pathParts = parts.slice(uploadIndex + 2);
    const fullPath = pathParts.join('/');
    
    return fullPath.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
};

export const BlogService = {
  // Create blog
  async createBlog(data: z.infer<typeof blogSchema>) {
    try {
      console.log('Validating blog data');
      const validated = blogSchema.parse(data);
      console.log('Starting Prisma transaction');
      return await prisma.$transaction(
        async (tx) => {
          console.log('Creating blog record');
          const blogData: Prisma.blogsCreateInput = {
            title: validated.title,
            description: validated.description,
            content: validated.content,
            image_url: validated.image_url ?? null,
            hero_image: validated.hero_image ?? null,
            blog_image_one: validated.blog_image_one ?? null,
            blog_image_two: validated.blog_image_two ?? null,
            blog_image_three: validated.blog_image_three ?? null,
            author_avatar: validated.author_avatar ?? null,
            epigraph: validated.epigraph ?? null,
            first_paragraph: validated.first_paragraph ?? null,
            second_paragraph: validated.second_paragraph ?? null,
            third_paragraph: validated.third_paragraph ?? null,
            fourth_paragraph: validated.fourth_paragraph ?? null,
            fifth_paragraph: validated.fifth_paragraph ?? null,
            annotation_image_one: validated.annotation_image_one ?? null,
            annotation_image_two: validated.annotation_image_two ?? null,
            annotation_image_three: validated.annotation_image_three ?? null,
            annotation_image_four: validated.annotation_image_four ?? null,
            annotation_image_five: validated.annotation_image_five ?? null,
            point_one_title: validated.point_one_title ?? null,
            point_two_title: validated.point_two_title ?? null,
            point_three_title: validated.point_three_title ?? null,
            point_four_title: validated.point_four_title ?? null,
            point_five_title: validated.point_five_title ?? null,
            point_one_description: validated.point_one_description ?? null,
            point_two_description: validated.point_two_description ?? null,
            point_three_description: validated.point_three_description ?? null,
            point_four_description: validated.point_four_description ?? null,
            point_five_description: validated.point_five_description ?? null,
            categories: validated.categories ?? null,
            more_blogs: validated.more_blogs ?? null,
            meta_description: validated.meta_description ?? null,
            keywords: validated.keywords ?? null,
            meta_author: validated.meta_author ?? null,
            meta_og_title: validated.meta_og_title ?? null,
            meta_og_url: validated.meta_og_url ?? null,
            meta_og_image: validated.meta_og_image ?? null,
            meta_facebook_id: validated.meta_facebook_id ?? null,
            meta_site_name: validated.meta_site_name ?? null,
            meta_post_twitter: validated.meta_post_twitter ?? null,
            status: validated.status ?? 'visible',
          };

          const createdBlog = await tx.blogs.create({ data: blogData });
          console.log(`✅ Created blog with ID: ${createdBlog.id}`);

          // if (validated.blog_images?.length) {
          //   console.log('Creating blog images');
          //   await tx.blog_images.createMany({
          //     data: validated.blog_images.map((img) => ({
          //       blog_id: createdBlog.id,
          //       image_url: img.image_url,
          //     })),
          //   });
          //   console.log('✅ Blog images created');
          // }

          console.log('Fetching created blog');
          const result = await tx.blogs.findUnique({
            where: { id: createdBlog.id },
            include: { blog_images: true },
          });
          console.log('✅ Transaction complete');
          return result;
        },
        { timeout: 10000 }
      );
    } catch (error) {
      console.error(`❌ Failed to create blog:`, error);
      throw new Error(`Failed to create blog: ${error}`);
    }
  },

  // Get single blog
  async getBlogById(id: number) {
    try {
      console.log(`Fetching blog with ID: ${id}`);
      return await prisma.blogs.findUnique({
        where: { id },
        include: { blog_images: true },
      });
    } catch (error) {
      console.error(`Failed to fetch blog: ${error}`);
      throw new Error(`Failed to fetch blog: ${error}`);
    }
  },

  // Get all blogs (paginated)
  async getAllBlogs(page = 1, limit = 10, status?: 'visible' | 'hidden' | 'draft') {
    try {
      console.log(`Fetching blogs: page=${page}, limit=${limit}, status=${status}`);
      const skip = (page - 1) * limit;
      const where = status ? { status } : {};

      const [blogs, total] = await Promise.all([
        prisma.blogs.findMany({
          where,
          skip,
          take: limit,
          include: { blog_images: true },
          orderBy: { created_at: 'desc' },
        }),
        prisma.blogs.count({ where }),
      ]);

      console.log(`Fetched ${blogs.length} blogs, total: ${total}`);
      return {
        data: blogs,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(`Failed to fetch blogs: ${error}`);
      throw new Error(`Failed to fetch blogs: ${error}`);
    }
  },

  // Update blog
  async updateBlog(id: number, data: Partial<z.infer<typeof blogSchema>>) {
    try {
      console.log(`Updating blog with ID: ${id}`);
      const validated = blogSchema.partial().parse(data);
      
      // Get old blog to delete old images from Cloudinary
      const oldBlog = await prisma.blogs.findUnique({ where: { id } });
      
      return await prisma.$transaction(
        async (tx) => {
          const updateData: Prisma.blogsUpdateInput = {};
          const setField = <K extends keyof typeof validated>(
            field: K,
            value: typeof validated[K]
          ) => {
            if (value !== undefined) {
              // @ts-ignore
              updateData[field] = value;
            }
          };

          setField('title', validated.title);
          setField('description', validated.description);
          setField('content', validated.content);
          setField('image_url', validated.image_url);
          setField('hero_image', validated.hero_image);
          setField('blog_image_one', validated.blog_image_one);
          setField('blog_image_two', validated.blog_image_two);
          setField('blog_image_three', validated.blog_image_three);
          setField('author_avatar', validated.author_avatar);
          setField('epigraph', validated.epigraph);
          setField('first_paragraph', validated.first_paragraph);
          setField('second_paragraph', validated.second_paragraph);
          setField('third_paragraph', validated.third_paragraph);
          setField('fourth_paragraph', validated.fourth_paragraph);
          setField('fifth_paragraph', validated.fifth_paragraph);
          setField('annotation_image_one', validated.annotation_image_one);
          setField('annotation_image_two', validated.annotation_image_two);
          setField('annotation_image_three', validated.annotation_image_three);
          setField('annotation_image_four', validated.annotation_image_four);
          setField('annotation_image_five', validated.annotation_image_five);
          setField('point_one_title', validated.point_one_title);
          setField('point_two_title', validated.point_two_title);
          setField('point_three_title', validated.point_three_title);
          setField('point_four_title', validated.point_four_title);
          setField('point_five_title', validated.point_five_title);
          setField('point_one_description', validated.point_one_description);
          setField('point_two_description', validated.point_two_description);
          setField('point_three_description', validated.point_three_description);
          setField('point_four_description', validated.point_four_description);
          setField('point_five_description', validated.point_five_description);
          setField('categories', validated.categories);
          setField('more_blogs', validated.more_blogs);
          setField('meta_description', validated.meta_description);
          setField('keywords', validated.keywords);
          setField('meta_author', validated.meta_author);
          setField('meta_og_title', validated.meta_og_title);
          setField('meta_og_url', validated.meta_og_url);
          setField('meta_og_image', validated.meta_og_image);
          setField('meta_facebook_id', validated.meta_facebook_id);
          setField('meta_site_name', validated.meta_site_name);
          setField('meta_post_twitter', validated.meta_post_twitter);
          setField('status', validated.status);

          console.log('Updating blog record');
          const updatedBlog = await tx.blogs.update({
            where: { id },
            data: updateData,
          });

          // Delete old images from Cloudinary if they were replaced
          if (oldBlog) {
            const imageFields = [
              'image_url', 'hero_image', 'blog_image_one', 'blog_image_two', 
              'blog_image_three', 'author_avatar', 'annotation_image_one', 
              'annotation_image_two', 'annotation_image_three', 
              'annotation_image_four', 'annotation_image_five', 'meta_og_image'
            ];

            for (const field of imageFields) {
              const oldUrl = oldBlog[field as keyof typeof oldBlog];
              const newUrl = validated[field as keyof typeof validated];
              
              if (oldUrl && newUrl && oldUrl !== newUrl && typeof oldUrl === 'string') {
                const publicId = extractPublicIdFromUrl(oldUrl);
                if (publicId) {
                  try {
                    await cloudinary.uploader.destroy(publicId);
                    console.log(`✅ Deleted old ${field} from Cloudinary`);
                  } catch (error) {
                    console.error(`⚠️ Failed to delete old ${field}:`, error);
                  }
                }
              }
            }
          }

          // if (validated.blog_images) {
          //   console.log('Updating blog images');
            
          //   // Get old blog_images to delete from Cloudinary
          //   const oldBlogImages = await tx.blog_images.findMany({ 
          //     where: { blog_id: id } 
          //   });
            
          //   // Delete old images from Cloudinary
          //   for (const oldImage of oldBlogImages) {
          //     const publicId = extractPublicIdFromUrl(oldImage.image_url);
          //     if (publicId) {
          //       try {
          //         await cloudinary.uploader.destroy(publicId);
          //         console.log(`✅ Deleted old blog_image from Cloudinary`);
          //       } catch (error) {
          //         console.error(`⚠️ Failed to delete old blog_image:`, error);
          //       }
          //     }
          //   }
            
          //   await tx.blog_images.deleteMany({ where: { blog_id: id } });
            
          //   if (validated.blog_images.length > 0) {
          //     await tx.blog_images.createMany({
          //       data: validated.blog_images.map((img) => ({
          //         blog_id: id,
          //         image_url: img.image_url,
          //       })),
          //     });
          //   }
          // }

          console.log('Fetching updated blog');
          return await tx.blogs.findUnique({
            where: { id },
            include: { blog_images: true },
          });
        },
        { timeout: 10000 }
      );
    } catch (error) {
      console.error(`Failed to update blog: ${error}`);
      throw new Error(`Failed to update blog: ${error}`);
    }
  },

  // Delete blog
  async deleteBlog(id: number) {
    try {
      console.log(`Deleting blog with ID: ${id}`);
      
      // Get blog to delete images from Cloudinary
      const blog = await prisma.blogs.findUnique({
        where: { id },
        include: { blog_images: true }
      });
      
      if (blog) {
        // Delete all images from Cloudinary
        const imageFields = [
          'image_url', 'hero_image', 'blog_image_one', 'blog_image_two', 
          'blog_image_three', 'author_avatar', 'annotation_image_one', 
          'annotation_image_two', 'annotation_image_three', 
          'annotation_image_four', 'annotation_image_five', 'meta_og_image'
        ];

        for (const field of imageFields) {
          const url = blog[field as keyof typeof blog];
          if (url && typeof url === 'string') {
            const publicId = extractPublicIdFromUrl(url);
            if (publicId) {
              try {
                await cloudinary.uploader.destroy(publicId);
                console.log(`✅ Deleted ${field} from Cloudinary`);
              } catch (error) {
                console.error(`⚠️ Error deleting ${field}:`, error);
              }
            }
          }
        }

        // Delete blog_images from Cloudinary
        for (const image of blog.blog_images) {
          const publicId = extractPublicIdFromUrl(image.image_url);
          if (publicId) {
            try {
              await cloudinary.uploader.destroy(publicId);
              console.log(`✅ Deleted blog_image from Cloudinary`);
            } catch (error) {
              console.error(`⚠️ Error deleting blog_image:`, error);
            }
          }
        }
      }
      
      return await prisma.blogs.delete({ where: { id } });
    } catch (error) {
      console.error(`Failed to delete blog: ${error}`);
      throw new Error(`Failed to delete blog: ${error}`);
    }
  },

  // Blog Images Helpers
  async addBlogImage(blogId: number, imageUrl: string) {
    try {
      console.log(`Adding image to blog ID: ${blogId}`);
      return await prisma.blog_images.create({
        data: {
          image_url: imageUrl,
          blogs: { connect: { id: blogId } },
        },
      });
    } catch (error) {
      console.error(`Failed to add blog image: ${error}`);
      throw new Error(`Failed to add blog image: ${error}`);
    }
  },

  async getBlogImages(blogId: number) {
    try {
      console.log(`Fetching images for blog ID: ${blogId}`);
      return await prisma.blog_images.findMany({ where: { blog_id: blogId } });
    } catch (error) {
      console.error(`Failed to fetch blog images: ${error}`);
      throw new Error(`Failed to fetch blog images: ${error}`);
    }
  },

  async deleteBlogImage(imageId: number) {
    try {
      console.log(`Deleting image ID: ${imageId}`);
      
      // Get image to delete from Cloudinary
      const image = await prisma.blog_images.findUnique({ where: { id: imageId } });
      
      if (image) {
        const publicId = extractPublicIdFromUrl(image.image_url);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`✅ Deleted image from Cloudinary`);
          } catch (error) {
            console.error(`⚠️ Error deleting image from Cloudinary:`, error);
          }
        }
      }
      
      return await prisma.blog_images.delete({ where: { id: imageId } });
    } catch (error) {
      console.error(`Failed to delete blog image: ${error}`);
      throw new Error(`Failed to delete blog image: ${error}`);
    }
  },
};


















// import { PrismaClient, Prisma } from '@prisma/client';
// import { blogSchema } from '../models/blogs';
// import { z } from 'zod';

// const prisma = new PrismaClient({
//   log: ['query', 'info', 'warn', 'error'], // Enable Prisma query logging
// });

// export const BlogService = {
//   // Create blog
//   async createBlog(data: z.infer<typeof blogSchema>) {
//     try {
//       console.log('Validating blog data');
//       const validated = blogSchema.parse(data);
//       console.log('Starting Prisma transaction');
//       return await prisma.$transaction(
//         async (tx) => {
//           console.log('Creating blog record');
//           const blogData: Prisma.blogsCreateInput = {
//             title: validated.title,
//             description: validated.description,
//             content: validated.content,
//             image_url: validated.image_url ?? null,
//             hero_image: validated.hero_image ?? null,
//             blog_image_one: validated.blog_image_one ?? null,
//             blog_image_two: validated.blog_image_two ?? null,
//             blog_image_three: validated.blog_image_three ?? null,
//             author_avatar: validated.author_avatar ?? null,
//             epigraph: validated.epigraph ?? null,
//             first_paragraph: validated.first_paragraph ?? null,
//             second_paragraph: validated.second_paragraph ?? null,
//             third_paragraph: validated.third_paragraph ?? null,
//             fourth_paragraph: validated.fourth_paragraph ?? null,
//             fifth_paragraph: validated.fifth_paragraph ?? null,
//             annotation_image_one: validated.annotation_image_one ?? null,
//             annotation_image_two: validated.annotation_image_two ?? null,
//             annotation_image_three: validated.annotation_image_three ?? null,
//             annotation_image_four: validated.annotation_image_four ?? null,
//             annotation_image_five: validated.annotation_image_five ?? null,
//             point_one_title: validated.point_one_title ?? null,
//             point_two_title: validated.point_two_title ?? null,
//             point_three_title: validated.point_three_title ?? null,
//             point_four_title: validated.point_four_title ?? null,
//             point_five_title: validated.point_five_title ?? null,
//             point_one_description: validated.point_one_description ?? null,
//             point_two_description: validated.point_two_description ?? null,
//             point_three_description: validated.point_three_description ?? null,
//             point_four_description: validated.point_four_description ?? null,
//             point_five_description: validated.point_five_description ?? null,
//             categories: validated.categories ?? null,
//             more_blogs: validated.more_blogs ?? null,
//             meta_description: validated.meta_description ?? null,
//             keywords: validated.keywords ?? null,
//             meta_author: validated.meta_author ?? null,
//             meta_og_title: validated.meta_og_title ?? null,
//             meta_og_url: validated.meta_og_url ?? null,
//             meta_og_image: validated.meta_og_image ?? null,
//             meta_facebook_id: validated.meta_facebook_id ?? null,
//             meta_site_name: validated.meta_site_name ?? null,
//             meta_post_twitter: validated.meta_post_twitter ?? null,
//             status: validated.status ?? 'visible',
//           };

//           const createdBlog = await tx.blogs.create({ data: blogData });
//           console.log(`Created blog with ID: ${createdBlog.id}`);

//           if (validated.blog_images?.length) {
//             console.log('Creating blog images');
//             await tx.blog_images.createMany({
//               data: validated.blog_images.map((img) => ({
//                 blog_id: createdBlog.id,
//                 image_url: img.image_url,
//               })),
//             });
//             console.log('Blog images created');
//           }

//           console.log('Fetching created blog');
//           const result = await tx.blogs.findUnique({
//             where: { id: createdBlog.id },
//             include: { blog_images: true },
//           });
//           console.log('Transaction complete');
//           return result;
//         },
//         { timeout: 10000 } // 10-second transaction timeout
//       );
//     } catch (error) {
//       console.error(`Failed to create blog: ${error}`);
//       throw new Error(`Failed to create blog: ${error}`);
//     }
//   },

//   // Get single blog
//   async getBlogById(id: number) {
//     try {
//       console.log(`Fetching blog with ID: ${id}`);
//       return await prisma.blogs.findUnique({
//         where: { id },
//         include: { blog_images: true },
//       });
//     } catch (error) {
//       console.error(`Failed to fetch blog: ${error}`);
//       throw new Error(`Failed to fetch blog: ${error}`);
//     }
//   },

//   // Get all blogs (paginated)
//   async getAllBlogs(page = 1, limit = 10, status?: 'visible' | 'hidden' | 'draft') {
//     try {
//       console.log(`Fetching blogs: page=${page}, limit=${limit}, status=${status}`);
//       const skip = (page - 1) * limit;
//       const where = status ? { status } : {};

//       const [blogs, total] = await Promise.all([
//         prisma.blogs.findMany({
//           where,
//           skip,
//           take: limit,
//           include: { blog_images: true },
//           orderBy: { created_at: 'desc' },
//         }),
//         prisma.blogs.count({ where }),
//       ]);

//       console.log(`Fetched ${blogs.length} blogs, total: ${total}`);
//       return {
//         data: blogs,
//         meta: {
//           total,
//           page,
//           limit,
//           totalPages: Math.ceil(total / limit),
//         },
//       };
//     } catch (error) {
//       console.error(`Failed to fetch blogs: ${error}`);
//       throw new Error(`Failed to fetch blogs: ${error}`);
//     }
//   },

//   // Update blog
//   async updateBlog(id: number, data: Partial<z.infer<typeof blogSchema>>) {
//     try {
//       console.log(`Updating blog with ID: ${id}`);
//       const validated = blogSchema.partial().parse(data);
//       return await prisma.$transaction(
//         async (tx) => {
//           const updateData: Prisma.blogsUpdateInput = {};
//           const setField = <K extends keyof typeof validated>(
//             field: K,
//             value: typeof validated[K]
//           ) => {
//             if (value !== undefined) {
//               // @ts-ignore
//               updateData[field] = value;
//             }
//           };

//           setField('title', validated.title);
//           setField('description', validated.description);
//           setField('content', validated.content);
//           setField('image_url', validated.image_url);
//           setField('hero_image', validated.hero_image);
//           setField('blog_image_one', validated.blog_image_one);
//           setField('blog_image_two', validated.blog_image_two);
//           setField('blog_image_three', validated.blog_image_three);
//           setField('author_avatar', validated.author_avatar);
//           setField('epigraph', validated.epigraph);
//           setField('first_paragraph', validated.first_paragraph);
//           setField('second_paragraph', validated.second_paragraph);
//           setField('third_paragraph', validated.third_paragraph);
//           setField('fourth_paragraph', validated.fourth_paragraph);
//           setField('fifth_paragraph', validated.fifth_paragraph);
//           setField('annotation_image_one', validated.annotation_image_one);
//           setField('annotation_image_two', validated.annotation_image_two);
//           setField('annotation_image_three', validated.annotation_image_three);
//           setField('annotation_image_four', validated.annotation_image_four);
//           setField('annotation_image_five', validated.annotation_image_five);
//           setField('point_one_title', validated.point_one_title);
//           setField('point_two_title', validated.point_two_title);
//           setField('point_three_title', validated.point_three_title);
//           setField('point_four_title', validated.point_four_title);
//           setField('point_five_title', validated.point_five_title);
//           setField('point_one_description', validated.point_one_description);
//           setField('point_two_description', validated.point_two_description);
//           setField('point_three_description', validated.point_three_description);
//           setField('point_four_description', validated.point_four_description);
//           setField('point_five_description', validated.point_five_description);
//           setField('categories', validated.categories);
//           setField('more_blogs', validated.more_blogs);
//           setField('meta_description', validated.meta_description);
//           setField('keywords', validated.keywords);
//           setField('meta_author', validated.meta_author);
//           setField('meta_og_title', validated.meta_og_title);
//           setField('meta_og_url', validated.meta_og_url);
//           setField('meta_og_image', validated.meta_og_image);
//           setField('meta_facebook_id', validated.meta_facebook_id);
//           setField('meta_site_name', validated.meta_site_name);
//           setField('meta_post_twitter', validated.meta_post_twitter);
//           setField('status', validated.status);

//           console.log('Updating blog record');
//           const updatedBlog = await tx.blogs.update({
//             where: { id },
//             data: updateData,
//           });

//           if (validated.blog_images) {
//             console.log('Updating blog images');
//             await tx.blog_images.deleteMany({ where: { blog_id: id } });
//             if (validated.blog_images.length > 0) {
//               await tx.blog_images.createMany({
//                 data: validated.blog_images.map((img) => ({
//                   blog_id: id,
//                   image_url: img.image_url,
//                 })),
//               });
//             }
//           }

//           console.log('Fetching updated blog');
//           return await tx.blogs.findUnique({
//             where: { id },
//             include: { blog_images: true },
//           });
//         },
//         { timeout: 10000 }
//       );
//     } catch (error) {
//       console.error(`Failed to update blog: ${error}`);
//       throw new Error(`Failed to update blog: ${error}`);
//     }
//   },

//   // Delete blog
//   async deleteBlog(id: number) {
//     try {
//       console.log(`Deleting blog with ID: ${id}`);
//       return await prisma.blogs.delete({ where: { id } });
//     } catch (error) {
//       console.error(`Failed to delete blog: ${error}`);
//       throw new Error(`Failed to delete blog: ${error}`);
//     }
//   },

//   // Blog Images Helpers
//   async addBlogImage(blogId: number, imageUrl: string) {
//     try {
//       console.log(`Adding image to blog ID: ${blogId}`);
//       return await prisma.blog_images.create({
//         data: {
//           image_url: imageUrl,
//           blogs: { connect: { id: blogId } },
//         },
//       });
//     } catch (error) {
//       console.error(`Failed to add blog image: ${error}`);
//       throw new Error(`Failed to add blog image: ${error}`);
//     }
//   },

//   async getBlogImages(blogId: number) {
//     try {
//       console.log(`Fetching images for blog ID: ${blogId}`);
//       return await prisma.blog_images.findMany({ where: { blog_id: blogId } });
//     } catch (error) {
//       console.error(`Failed to fetch blog images: ${error}`);
//       throw new Error(`Failed to fetch blog images: ${error}`);
//     }
//   },

//   async deleteBlogImage(imageId: number) {
//     try {
//       console.log(`Deleting image ID: ${imageId}`);
//       return await prisma.blog_images.delete({ where: { id: imageId } });
//     } catch (error) {
//       console.error(`Failed to delete blog image: ${error}`);
//       throw new Error(`Failed to delete blog image: ${error}`);
//     }
//   },
// };