import { type NextRouter, useRouter } from 'next/router';
import ErrorPage from 'next/error';
import distanceToNow from 'lib/util/dateRelative';
import { api } from '~/utils/api';
import Comment from 'components/Comment';
import Container from 'components/Container';
import BlogView from 'components/Blog/BlogView';
import { BlogLoader, DarkPostLoader } from 'components/BlogLoader';
import { useTheme } from 'next-themes';

export default function PostPage() {
  const router: NextRouter = useRouter();
  const postSlug = api.post.getBlogBySlug;
  const { data: post, isLoading } = postSlug.useQuery({
    slug: router.query.slug as string,
  });
  const { systemTheme } = useTheme();

  if (isLoading) {
    if (systemTheme === 'light') return <BlogLoader />;
    else if (systemTheme === 'dark') return <DarkPostLoader />;
  }
  if (!post) return <ErrorPage statusCode={404} />;

  return (
    <Container>
      <div>
        <article>
          <header className="prose-base prose-zinc sm:prose-lg md:prose-xl lg:prose-2xl">
            <h1 className="!mb-0 font-bold">{post?.title}</h1>
            {post?.description ? (
              <p className="!my-2">{post?.description}</p>
            ) : null}

            {post?.createdAt ? (
              <time className="!mt-2 flex text-base text-gray-400">
                {distanceToNow(new Date(post?.createdAt))}
              </time>
            ) : null}
          </header>

          <section className="prose-base prose-neutral mt-10 sm:prose-base md:prose-lg lg:prose-lg prose-a:underline">
            <BlogView post={post} />
          </section>
        </article>

        <Comment />
      </div>
    </Container>
  );
}
