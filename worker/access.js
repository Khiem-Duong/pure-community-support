/* What each signed-in person can open and change in the admin.

   Roles (users.role):
     superadmin  every page, can change everything, and the only role with People & roles
     editor      every page except People & roles, can change everything
     viewer      every page except People & roles, view only
     custom      only the pages listed in users.permissions, each 'view' or 'edit',
                 e.g. {"products":"edit","tags":"view"}
   Home is open to everyone. The admin page hides what a person can't use; the Worker
   checks again on every data request. */

/* Pages a custom role can be given, by their /admin/<page> name. */
export const PAGES = ['review', 'products', 'tags', 'orders', 'campaigns', 'impact', 'money'];

/* Keeps only known pages with 'view' or 'edit'; anything unreadable gives no access. */
export function parsePermissions(raw) {
  let data;
  try { data = JSON.parse(raw || '{}'); } catch { return {}; }
  const out = {};
  if (!data || typeof data !== 'object') return out;
  for (const page of PAGES) if (data[page] === 'view' || data[page] === 'edit') out[page] = data[page];
  return out;
}

/* { page: 'view' | 'edit' } for every page this person can open. */
export function accessMap(user) {
  const map = { home: 'view' };
  if (user.role === 'superadmin' || user.role === 'editor') PAGES.forEach(page => map[page] = 'edit');
  else if (user.role === 'viewer') PAGES.forEach(page => map[page] = 'view');
  else if (user.role === 'custom') Object.assign(map, parsePermissions(user.permissions));
  if (user.role === 'superadmin') map.people = 'edit';
  return map;
}

export const canView = (user, page) => Boolean(accessMap(user)[page]);
export const canEdit = (user, page) => accessMap(user)[page] === 'edit';
