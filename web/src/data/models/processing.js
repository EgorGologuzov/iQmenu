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
  m.products = m.products && m.products.length ? m.products : undefined;
  m.menuName = m.menuName ? asInSentense(m.menuName.trim()) : undefined;
  m.companyName = m.companyName ? asInSentense(m.companyName.trim()) : undefined;
  m.categories = m.categories && m.categories.length ? m.categories : undefined;
  m.image = m.image ? m.image : undefined;

  if (m.products) {
    m.products = m.products.map(product => ({ ...product, id: undefined }));
  }

  return m;
}

export function processCategory(c) {
  if (!c) return;
  return asInSentense(c.trim());
}

export function processUser(u) {
  if (!u) return;

  u = { ...u };

  u.phone = u.phone ? u.phone.replace(/[^\d+]/g, "") : undefined;
  u.email = u.email ? u.email.trim() : undefined;
  u.name = u.name ? u.name.trim() : undefined;
  u.createAt = u.createAt ? u.createAt : undefined;
  u.apiAccessToken = u.apiAccessToken ? u.apiAccessToken : undefined;
  u.role = u.role ? u.role : undefined;
  u.avatar = u.avatar ? u.avatar : undefined;
  u.password = u.password ? u.password : undefined;
  u.passwordRepeat = u.passwordRepeat ? u.passwordRepeat : undefined;

  return u;
}
