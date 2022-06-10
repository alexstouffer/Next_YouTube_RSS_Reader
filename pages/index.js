import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import '@apollo/client';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export default function Home({ posts }) {
  console.log('2nd Console Statement: ', posts);
  return (
    <div className={styles.container}>
      <Head>
        <title>Stoubord's Next Picks (GraphQL/Next)</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Stoubord's Next Picks</h1>

        <p className={styles.description}>
          Latest Curated Videos:
        </p>

        <div className={styles.grid}>
          { posts.map((post) => {
            console.log("Map Console Statement: ", post.node)
            return (
              <a
                key={post.node.id}
                href={post.node.link}
                className={styles.card}
              >
                <div>
                  <Image
                    src={post.node.featuredImage.node.mediaItemUrl}
                    alt="Landscape picture"
                    width={500}
                    height={500}
                  />
                </div>

                <h3>{post.node.title}</h3>
                <p>
                  <strong>Published:</strong>{' '}
                  {new Date(
                    post.node.date
                  ).toLocaleDateString('en-US')}
                </p>
              </a>
            );
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const client = new ApolloClient({
    uri: 'http://picks.stoubord.com/graphql/',
    cache: new InMemoryCache(),
    onError: ({ networkError, graphQLErrors }) => {
      console.log('graphQLErrors', graphQLErrors);
      console.log('networkError', networkError);
    },
  });

  const { data } = await client.query({
    query: gql`
      query ytQuery {
        youtubePosts(first: 16) {
          edges {
            node {
              title
              link
              id
              date
              featuredImage {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
    `
  });

  console.log('1st Console Statement :', data.youtubePosts.edges[0].node);

  return {
    props: {
      posts: data.youtubePosts.edges,
    },
  };
}
