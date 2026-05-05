import { useEffect } from "react";

const REVEAL_SELECTOR = [
  ".hero",
  ".page-hero",
  ".section",
  ".home-market-card",
  ".feature-card",
  ".price-menu-category",
  ".article-card",
  ".testimonial-card",
  ".gallery-card",
  ".faq-item",
  ".contact-form",
  ".contact-aside",
].join(",");

/** מעל הקיפול — בלי opacity:0 שממתין ל־IO (משפר LCP/CLS ומפחית עבודה בציור ראשון בדסקטופ) */
const ABOVE_THE_FOLD_SELECTOR = ".hero, .page-hero";

export function useScrollReveal(routeKey: string) {
  useEffect(() => {
    const root = document.getElementById("main-content");
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileViewport = window.matchMedia("(max-width: 760px)");
    const revealImmediately = (el: Element) => {
      el.classList.add("scroll-reveal", "is-scroll-visible");
    };

    if (reduceMotion.matches || mobileViewport.matches || typeof IntersectionObserver === "undefined") {
      root.querySelectorAll(REVEAL_SELECTOR).forEach(revealImmediately);
      return;
    }

    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-scroll-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    const register = () => {
      root.querySelectorAll(ABOVE_THE_FOLD_SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        revealImmediately(el);
      });

      root.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        el.classList.add("scroll-reveal");
        observer.observe(el);
      });
    };

    let frame = window.requestAnimationFrame(register);
    /** ריכוז עדכוני DOM — פחות ריצות register בזמן React hydration (משפר TBT) */
    let mutationDebounce: number | undefined;
    const scheduleRegister = () => {
      if (mutationDebounce !== undefined) window.clearTimeout(mutationDebounce);
      mutationDebounce = window.setTimeout(() => {
        mutationDebounce = undefined;
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(register);
      }, 140);
    };

    const mutations = new MutationObserver(scheduleRegister);

    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      window.cancelAnimationFrame(frame);
      if (mutationDebounce !== undefined) window.clearTimeout(mutationDebounce);
      mutations.disconnect();
      observer.disconnect();
    };
  }, [routeKey]);
}
