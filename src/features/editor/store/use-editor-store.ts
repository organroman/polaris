import { create } from "zustand";
import { Id } from "../../../../convex/_generated/dataModel";

interface TabState {
  openTabs: Id<"files">[];
  activeTab: Id<"files"> | null;
  previewTab: Id<"files"> | null;
}

const defaultTabState: TabState = {
  openTabs: [],
  activeTab: null,
  previewTab: null,
};

interface EditorStore {
  tabs: Map<Id<"projects">, TabState>;
  getTabState: (projectId: Id<"projects">) => TabState;
  openFile: (
    projectId: Id<"projects">,
    fileId: Id<"files">,
    options: { pinned: boolean }
  ) => void;
  closeTab: (projectId: Id<"projects">, fileId: Id<"files">) => void;
  closeAllTabs: (projectId: Id<"projects">) => void;
  setActiveTab: (projectId: Id<"projects">, fileId: Id<"files">) => void;
}

export const useEditorStore = create<EditorStore>()((set, get) => ({
  tabs: new Map(),
  getTabState: (projectId) => {
    return get().tabs.get(projectId) || defaultTabState;
  },
  openFile: (projectId, fileId, { pinned }) => {
    const tabs = new Map(get().tabs);
    const tabState = tabs.get(projectId) ?? defaultTabState;

    const { openTabs, previewTab } = tabState;

    const isOpen = openTabs.includes(fileId);

    if (!isOpen && !pinned) {
      const newTabs = previewTab
        ? openTabs.map((tab) => (tab === previewTab ? fileId : tab))
        : [...openTabs, fileId];

      tabs.set(projectId, {
        openTabs: newTabs,
        activeTab: fileId,
        previewTab: fileId,
      });
      set({ tabs });
      return;
    }

    if (!isOpen && pinned) {
      tabs.set(projectId, {
        ...tabState,
        openTabs: [...openTabs, fileId],
        activeTab: fileId,
      });

      set({ tabs });
      return;
    }

    const shouldPin = pinned && previewTab === fileId;
    tabs.set(projectId, {
      ...tabState,
      previewTab: shouldPin ? null : tabState.previewTab,
      activeTab: fileId,
    });
    set({ tabs });
  },
  closeTab: (projectId, fileId) => {
    const tabs = new Map(get().tabs);
    const tabState = tabs.get(projectId) ?? defaultTabState;

    const { openTabs, activeTab, previewTab } = tabState;
    const tabIndex = openTabs.indexOf(fileId);

    if (tabIndex === -1) {
      return;
    }

    const newTabs = openTabs.filter((tab) => tab !== fileId);

    let newActiveTab = activeTab;
    if (activeTab === fileId) {
      if (newTabs.length === 0) {
        newActiveTab = null;
      } else if (tabIndex >= newTabs.length) {
        newActiveTab = newTabs[newTabs.length - 1];
      } else {
        newActiveTab = newTabs[tabIndex];
      }
    }

    tabs.set(projectId, {
      openTabs: newTabs,
      activeTab: newActiveTab,
      previewTab: previewTab === fileId ? null : previewTab,
    });

    set({ tabs });
  },
  closeAllTabs: (projectId) => {
    const tabs = new Map(get().tabs);
    tabs.set(projectId, defaultTabState);
    set({ tabs });
  },
  setActiveTab: (projectId, fileId) => {
    const tabs = new Map(get().tabs);
    const tabState = tabs.get(projectId) ?? defaultTabState;
    tabs.set(projectId, { ...tabState, activeTab: fileId });
    set({ tabs });
  },
}));
