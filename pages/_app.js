import { CssVarsProvider } from '@mui/joy/styles';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <CssVarsProvider>
      <Head>
        <title>TDS Perf Review</title>
        <meta name="description" content="TDS Perf Review App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </CssVarsProvider>
  );
}

export default MyApp;
