'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { industries } from '@/data/home';

const asset = (path: string) => `/sahilcrane/${path}`;

export function IndustriesCarousel() {
  return <div className="relative">
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      loop
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true, el: '.industries-pagination' }}
      navigation={{ nextEl: '.industries-next', prevEl: '.industries-prev' }}
      spaceBetween={16}
      breakpoints={{
        0: { slidesPerView: 1.2 },
        640: { slidesPerView: 2.2 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
      className="!overflow-visible"
    >
      {industries.map((industry) => <SwiperSlide key={industry.title}>
        <article className="group relative min-h-[250px] overflow-hidden bg-ink text-white">
          <img className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-500 group-hover:scale-105 group-hover:opacity-90" src={asset(`industries-we-serve/${industry.image}`)} alt={industry.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
          <h3 className="absolute bottom-4 left-4 z-10 max-w-[150px] text-sm font-bold leading-5">{industry.title}</h3>
        </article>
      </SwiperSlide>)}
    </Swiper>
    <div className="mt-8 flex items-center justify-between"><div className="industries-pagination !static !w-auto" /><div className="flex gap-2"><button className="industries-prev border border-ink/20 p-3 text-ink transition hover:border-safety hover:bg-safety" aria-label="Previous industry"><ArrowLeft size={17} /></button><button className="industries-next border border-ink/20 p-3 text-ink transition hover:border-safety hover:bg-safety" aria-label="Next industry"><ArrowRight size={17} /></button></div></div>
  </div>;
}
