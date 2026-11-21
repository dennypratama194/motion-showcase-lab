import './globals.css';

export const metadata = {
  title: 'ATELIER® — Independent Architecture Practice',
  description: 'An independent architecture practice exploring the quiet intersection of form, material, and place.',
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
