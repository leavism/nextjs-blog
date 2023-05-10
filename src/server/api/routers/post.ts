import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

export const postRouter = createTRPCRouter({
  listPosts: publicProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.post.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          author: true,
          description: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }),
  postPost: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        slug: z.string(),
        authordId: z.string(),
        content: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            title: input.title,
            slug: input.slug,
            authorId: input.authordId,
            content: input.content,
            description: input.description,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
  getPostBySlug: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      try {
        await ctx.prisma.post.findUnique({
          where: {
            slug: input.slug,
          },
        });
      } catch (error) {
        console.log(error);
      }
    }),
});
