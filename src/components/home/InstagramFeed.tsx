
import Image from "next/image";
import Link from "next/link";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const POSTS = [
  { id: 1, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600", aspect: "aspect-square" },
  { id: 2, image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600", aspect: "aspect-[3/4]" },
  { id: 3, image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&q=80&w=600", aspect: "aspect-[4/5]" },
  { id: 4, image: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600", aspect: "aspect-[4/3]" },
  { id: 5, image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=600", aspect: "aspect-[3/4]" },
];

export function InstagramFeed() {
  return (
    <section className="py-24 bg-brand-secondary overflow-hidden">
      <div className="text-center mb-16">
        <Link 
          href="https://instagram.com" 
          target="_blank"
          className="inline-flex flex-col items-center group"
        >
          <InstagramIcon className="w-8 h-8 text-brand-text mb-4 group-hover:text-brand-gold transition-colors" />
          <h2 className="font-heading text-3xl md:text-4xl text-brand-text mb-2">
            @decornish
          </h2>
          <span className="text-sm font-sans uppercase tracking-widest border-b border-transparent group-hover:border-brand-text transition-colors">
            Follow our journey
          </span>
        </Link>
      </div>

      <div className="flex gap-4 md:gap-6 px-4 md:px-12 w-max max-w-[200vw] animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
        {/* We duplicate posts for infinite scroll effect */}
        {[...POSTS, ...POSTS].map((post, idx) => (
          <div 
            key={`${post.id}-${idx}`}
            className={`relative w-[280px] md:w-[320px] ${post.aspect} flex-shrink-0 overflow-hidden group`}
          >
            <Image
              src={post.image}
              alt="Instagram post"
              fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <InstagramIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
