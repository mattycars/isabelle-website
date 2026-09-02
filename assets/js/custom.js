/* custom.js
 * Center justified-layout rows that don't fill the container width.
 * The theme's gallery.js lays items out left-aligned; when an album has only a
 * few photos the final (or only) row leaves a big gap on the right and looks
 * "cut off" against the left edge. This nudges each such row to be centered.
 */
function centerGalleryRows() {
  const gallery = document.getElementById("gallery");
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll(".gallery-item"));
  if (!items.length || !items[0].style.left) return; // layout not applied yet

  const containerWidth = gallery.getBoundingClientRect().width;

  // Group items into rows by their (rounded) top offset.
  const rows = new Map();
  for (const item of items) {
    const top = Math.round(parseFloat(item.style.top) || 0);
    if (!rows.has(top)) rows.set(top, []);
    rows.get(top).push(item);
  }

  for (const row of rows.values()) {
    let minLeft = Infinity;
    let maxRight = -Infinity;
    for (const it of row) {
      const left = parseFloat(it.style.left) || 0;
      const width = parseFloat(it.style.width) || 0;
      minLeft = Math.min(minLeft, left);
      maxRight = Math.max(maxRight, left + width);
    }
    const offset = (containerWidth - (maxRight - minLeft)) / 2 - minLeft;
    if (offset > 1) {
      for (const it of row) {
        it.style.left = (parseFloat(it.style.left) || 0) + offset + "px";
      }
    }
  }
}

const run = () => requestAnimationFrame(centerGalleryRows);

run();
window.addEventListener("load", run);
window.addEventListener("resize", run);
window.addEventListener("orientationchange", run);
