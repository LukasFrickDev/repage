import { useEffect } from 'react';

export function useAlignTitlesByRow(
  cardSelector: string,
  titleSelector: string,
  descriptionSelector?: string,
) {
  useEffect(() => {
    function align() {
      // Reset minHeight for all titles and descriptions
      document.querySelectorAll(titleSelector).forEach((el) => {
        (el as HTMLElement).style.minHeight = '';
      });
      if (descriptionSelector) {
        document.querySelectorAll(descriptionSelector).forEach((el) => {
          (el as HTMLElement).style.minHeight = '';
        });
      }
      const cards = Array.from(document.querySelectorAll(cardSelector));
      const rowTops: {
        [top: number]: { titles: HTMLElement[]; descs: HTMLElement[] };
      } = {};
      cards.forEach((card) => {
        const title = card.querySelector(titleSelector) as HTMLElement;
        const desc = descriptionSelector
          ? (card.querySelector(descriptionSelector) as HTMLElement)
          : null;
        if (!title) return;
        const top = card.getBoundingClientRect().top;
        if (!rowTops[top]) rowTops[top] = { titles: [], descs: [] };
        rowTops[top].titles.push(title);
        if (desc) rowTops[top].descs.push(desc);
      });
      Object.values(rowTops).forEach(({ titles, descs }) => {
        if (titles.length) {
          const maxTitle = Math.max(...titles.map((t) => t.offsetHeight));
          titles.forEach((t) => (t.style.minHeight = `${maxTitle}px`));
        }
        if (descs.length) {
          const maxDesc = Math.max(...descs.map((d) => d.offsetHeight));
          descs.forEach((d) => (d.style.minHeight = `${maxDesc}px`));
        }
      });
    }
    align();
    window.addEventListener('resize', align);
    return () => window.removeEventListener('resize', align);
  }, [cardSelector, titleSelector, descriptionSelector]);
}
