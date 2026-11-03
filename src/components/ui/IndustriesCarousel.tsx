'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { industries } from '@/data/home';

// Standardized constants for IndustriesCarousel
const asset = (path: string) => `/sahilcrane/${path}`;

const CAROUSEL_SPACE_BETWEEN = 16;
const CAROUSEL_AUTOPLAY_DELAY = 5000;
const CAROUSEL_BREAKPOINTS = {
  0: { slidesPerView: 1.2 },
  640: { slidesPerView: 2.2 },
  1024: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
};
const CARD_MIN_H = "min-h-[250px]";
const CARD_IMG_TRANSITION = "transition duration-500 group-hover:scale-105 group-hover:opacity-90";
const CARD_GRADIENT = "absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent";
const CARD_TITLE = "absolute bottom-4 left-4 z-10 max-w-[150px] text-sm font-bold leading-5";
const CONTROLS_MT = "mt-8";
const CONTROLS_GAP = "gap-2";
const CONTROL_BUTTON = "border border-ink/20 p-3 text-ink transition hover:border-safety hover:bg-safety";
const CONTROL_ICON_SIZE = 17;

export function IndustriesCarousel() {
  return <div className="relative">
    <Swiper
      modules={[Autoplay, Navigation, Pagination]}
      loop
      autoplay={{ delay: CAROUSEL_AUTOPLAY_DELAY, disableOnInteraction: false }}
      pagination={{ clickable: true, el: '.industries-pagination' }}
      navigation={{ nextEl: '.industries-next', prevEl: '.industries-prev' }}
      spaceBetween={CAROUSEL_SPACE_BETWEEN}
      breakpoints={CAROUSEL_BREAKPOINTS}
      className="!overflow-visible"
    >
      {industries.map((industry) => (
        <SwiperSlide key={industry.title}>
          <article className={`group relative ${CARD_MIN_H} overflow-hidden bg-ink text-white`}>
            <img
              className={`absolute inset-0 h-full w-full object-cover opacity-70 ${CARD_IMG_TRANSITION}`}
              src={asset(`industries-we-serve/${industry.image}`)}
              alt={industry.title}
            />
            <div className={CARD_GRADIENT} />
            <h3 className={CARD_TITLE}>{industry.title}</h3>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
    <div className={`flex items-center justify-between ${CONTROLS_MT}`}>
      <div className="industries-pagination !static !w-auto" />
      <div className={`flex ${CONTROLS_GAP}`}>
        <button
          className={CONTROL_BUTTON}
          aria-label="Previous industry">
          <ArrowLeft size={CONTROL_ICON_SIZE} />
        </button>
        <button
          className={CONTROL_BUTTON}
          aria-label="Next industry">
          <ArrowRight size={CONTROL_ICON_SIZE} />
        </button>
      </div>
    </div>
  </div>;
}
