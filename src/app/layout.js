import { Inter, Poppins, Hind_Siliguri } from 'next/font/google';
import './globals.css';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] });
const poppins = Poppins({ variable: '--font-poppins', subsets: ['latin'], weight: ['400', '600', '700', '800'] });
const hindSiliguri = Hind_Siliguri({ variable: '--font-hind', subsets: ['bengali'], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: 'Magic Tissue - Premium Confidence',
  description: 'High conversion landing page for Magic Tissue',
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${inter.variable} ${poppins.variable} ${hindSiliguri.variable} scroll-smooth`}>
      <body className="bg-[#080808] text-white antialiased overflow-x-hidden font-hind">
        {children}
      </body>
    </html>
  );
}