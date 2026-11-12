export const tokens = {
  // colors
  color: {
    primary: "#266B68",
    primaryHover: "#1D5655",
    onPrimary: "#FFFFFF",
    primarySoft: "#D4E8E3", // tag
    error: "#B53600",
    errorHover: "#C05626",
    onError: "#FFFFFF",
    onyx: "#1B1B1B", // main text, focus ring
    textMuted: "#5F6361",
    border: "#7A7F7E",
    background: "#FBF5EE", // cream page background
    surface: "#F8F9FA", // list rows, pop-up, field fill
    disabledBg: "#ECEFE8",
    disabledText: "#6B706E",
  },

  // spacing
  space: { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 },

  // radius (px)
  radius: {
    sm: 8, // checkbox, tag
    md: 12, // inputs, list rows
    lg: 20, // pop-ups
    full: 9999, // buttons
  },
  // size (px)
  size: {
    tapTarget: 48, // buttons, checkbox area, icon buttons, delete button
    listRow: 56, // minimum list row height
    icon: 24,
    iconSmall: 16, // for eror messages icon
    focusRing: 3,
    focusRingGap: 2,
    outlineBorder: 2,
    fieldBorder: 1.5,
    fieldBorderActive: 2,
  },
  // typography
  font: {
    body: '"DM Sans", sans-serif',
    heading: '"DM Serif Display", serif',
  },
  // text (font sizes (px))
  text: {
    display: { size: 36, lineHeight: 44, weight: 400 }, // DM Serif Display
    title: { size: 28, lineHeight: 36, weight: 400 }, // DM Serif Display
    heading: { size: 20, lineHeight: 28, weight: 600 },
    item: { size: 18, lineHeight: 26, weight: 500 },
    body: { size: 16, lineHeight: 24, weight: 400 },
    label: { size: 16, lineHeight: 24, weight: 600 },
    caption: { size: 14, lineHeight: 20, weight: 500 },
  },
};
