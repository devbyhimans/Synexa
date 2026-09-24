import {create} from "zustand";

// This is the zustand style for the management of the global state of the theme 
// Here we also use the localStorage for saving the theme so that it should not reset to the "coffee" when we relod the page

export const useThemeStore = create((set) => ({

  theme : localStorage.getItem("nexus-theme") || "coffee",  // when page load( or reload) take theme value from the localStorage if not there use "coffee"

  setTheme : (theme) => {
    localStorage.setItem("nexus-theme", theme);
    set({theme});
  },
}))