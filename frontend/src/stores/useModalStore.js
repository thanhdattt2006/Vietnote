import { create } from 'zustand';

const useModalStore = create((set) => ({
  modals: {},

  openModal: (modalId, data = null) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: { isOpen: true, data } },
    })),

  closeModal: (modalId) =>
    set((state) => ({
      modals: { ...state.modals, [modalId]: { isOpen: false, data: null } },
    })),

  closeAllModals: () => set({ modals: {} }),

  getModalState: (modalId) => (state) => state.modals[modalId] || { isOpen: false, data: null },
}));

export default useModalStore;
