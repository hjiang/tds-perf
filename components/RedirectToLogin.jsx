import Head from 'next/head';

export default function RedirectToLogin() {
  return (
    <div>
      <Head>
        <meta httpEquiv="refresh" content="0; URL='/login'" />
      </Head>
      Redirecting you to the login page.
    </div>
  );
}
