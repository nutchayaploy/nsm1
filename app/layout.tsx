import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ระบบสมาชิกสะสมแต้ม NSM | NSM Dino Club',
  description: 'ระบบสมาชิกสะสมแต้มและ Gamification วิวัฒนาการไดโนเสาร์ องค์การพิพิธภัณฑ์วิทยาศาสตร์แห่งชาติ (อพวช.)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="antialiased selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
