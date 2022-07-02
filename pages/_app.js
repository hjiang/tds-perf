import { CssVarsProvider } from '@mui/joy/styles';
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <CssVarsProvider><Component {...pageProps} /></CssVarsProvider>
}

export default MyApp
