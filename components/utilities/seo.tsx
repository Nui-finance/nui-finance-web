import ogImage from 'assets/og-image.png';
import Head from 'next/head';

const defaultTitle = 'nui finance | Win Big Rewards Weekly';
const defaultDescription =
  'A decentralized, user-friendly, no-loss protocol that gives users the opportunity to win amplified rewards weekly.';
const defaultImage = ogImage;

const SEO = ({
  title: originalTitle,
  description = defaultDescription,
  imageUrl = defaultImage.src,
}: {
  title?: string;
  description?: string;
  imageUrl?: string;
}) => {
  const prefix = originalTitle ? `${originalTitle} | ` : '';
  const title = `${prefix}${defaultTitle}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="og:type" content="website" />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={imageUrl} />
      <meta name="og:image:alt" content={description} />
      <meta name="og:image:width" content="1200" />
      <meta name="og:site_name" content="Nui Finance" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
};

export default SEO;
