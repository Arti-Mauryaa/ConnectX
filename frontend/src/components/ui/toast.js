// Tiny event-based toast system: toaster.create({ title, description, type })
export const listeners = new Set();
let nextId = 1;

export const toaster = {
  create({ title, description, type = "info", duration = 4000 }) {
    const toast = { id: nextId++, title, description, type };
    listeners.forEach((fn) => fn({ add: toast }));
    setTimeout(() => listeners.forEach((fn) => fn({ remove: toast.id })), duration);
  },
};
