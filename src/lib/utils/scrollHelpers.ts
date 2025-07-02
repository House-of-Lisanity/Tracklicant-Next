export function scrollToTopIfNeeded(threshold = 100) {
  if (window.scrollY > threshold) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
