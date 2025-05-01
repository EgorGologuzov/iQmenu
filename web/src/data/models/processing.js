import { asInSentense } from "../../utils/utils";

export function processProduct(p) {
  if (!p) return;

  p = { ...p };

  p.name = p.name ? asInSentense(p.name.trim()) : undefined;
  p.price = p.price ? Math.round(+p.price) : undefined;
  p.isActive = !!p.isActive;
  p.categories = p.categories && p.categories.length ? p.categories : undefined;
  p.weight = p.weight ? Math.round(+p.weight) : undefined;
  p.composition = p.composition ? asInSentense(p.composition.trim()) : undefined;
  p.description = p.description ? asInSentense(p.description.trim()) : undefined;
  p.image = p.image ? p.image : undefined;

  return p;
}

export function processMenu(m) {
  if (!m) return;

  m = { ...m };

  m.isActive = !!m.isActive;
  m.menuName = m.menuName ? asInSentense(m.menuName.trim()) : undefined;
  m.companyName = m.companyName ? asInSentense(m.companyName.trim()) : undefined;
  m.categories = m.categories && m.categories.length ? m.categories : undefined;
  m.image = m.image ? m.image : undefined;

  return m;
}

export function processCategory(c) {
  if (!c) return;
  return asInSentense(c.trim());
}
