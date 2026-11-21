import '@fontsource-variable/inter-tight';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import './globals.css';

export const metadata = {
  title: 'Serein — The Pilates Studio',
  description: 'Small-group reformer Pilates, mat Pilates, and private sessions at Serein.',
  icons: { icon: '/serein/icon.svg' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
