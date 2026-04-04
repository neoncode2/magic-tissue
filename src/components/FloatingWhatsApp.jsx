'use client';

function getWhatsAppLink() {
  const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '601164444944';
  const digits = rawNumber.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export default function FloatingWhatsApp() {
  const whatsappLink = getWhatsAppLink();

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="whatsapp-float group fixed bottom-5 right-4 z-50 flex items-center gap-2 md:bottom-6 md:right-6 md:gap-3"
    >

      <span className="whatsapp-shell flex h-16 w-16 items-center justify-center rounded-full">
        <span className="whatsapp-ripple" />
        <span className="whatsapp-core flex h-[4.1rem] w-[4.1rem] items-center justify-center rounded-full border border-white/20 bg-[linear-gradient(180deg,#34d399_0%,#16a34a_55%,#15803d_100%)] shadow-[0_24px_36px_rgba(22,163,74,0.36),0_8px_0_rgba(5,90,38,0.9),inset_0_2px_0_rgba(255,255,255,0.25)]">
          <svg viewBox="0 0 32 32" className="h-8 w-8 fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" aria-hidden="true">
            <path d="M27.3 4.7A15 15 0 0 0 3.8 22.8L2 30l7.4-1.8A15 15 0 1 0 27.3 4.7Zm-11.2 24a12.5 12.5 0 0 1-6.4-1.8l-.5-.3-4.4 1.1 1.2-4.3-.3-.5a12.5 12.5 0 1 1 10.4 5.8Zm6.9-9.4c-.4-.2-2.3-1.1-2.7-1.2-.4-.2-.6-.2-.9.2-.3.4-1 1.2-1.2 1.4-.2.2-.5.3-.9.1-.4-.2-1.6-.6-3.1-1.9-1.1-1-1.9-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.7.1-.2.1-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .5-.4.4-1.4 1.4-1.4 3.4s1.4 3.9 1.6 4.2c.2.3 2.7 4.2 6.7 5.8 4 1.6 4 1.1 4.8 1 .8-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.1-.4-.2-.8-.4Z" />
          </svg>
        </span>
      </span>
    </a>
  );
}
