import { createTheme } from "@mui/material/styles";
import { tokens } from "./tokens";

const { color, space, radius, size, font, text } = tokens;

// Turns one text token into a MUI text style
const textStyle = (t, fontFamily = font.body) => ({
  fontFamily,
  fontSize: `${t.size}px`,
  lineHeight: `${t.lineHeight}px`,
  fontWeight: t.weight,
  letterSpacing: "normal",
});

const theme = createTheme({
  // color palette, of what is used for primary, error, background, and text.
  palette: {
    primary: {
      main: color.primary,
      dark: color.primaryHover,
      contrastText: color.onPrimary,
    },
    error: {
      main: color.error,
      dark: color.errorHover,
      contrastText: color.onError,
    },
    background: { default: color.background, paper: color.surface },
    text: { primary: color.onyx, secondary: color.textMuted },
  },

  // text styles (font sizes, line heights, weights)
  typography: {
    fontFamily: font.body,
    h1: textStyle(text.display, font.heading), // display
    h2: textStyle(text.title, font.heading), // title
    h3: textStyle(text.heading), // heading
    h4: textStyle(text.item), // item
    body1: textStyle(text.body), // body
    button: { ...textStyle(text.label), textTransform: "none" }, // label
    caption: textStyle(text.caption), // caption
  },

  // radius (border radius for buttons, inputs)
  shape: { borderRadius: radius.md },

  // component overrides (for MUI components) with our own tokens and styles.
  components: {
    // the button from MUI, but overridden to use our tokens and styles
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          minHeight: size.tapTarget,
          padding: `${space[3]}px ${space[6]}px`,
          borderRadius: `${radius.full}px`,
          "&:focus-visible": {
            outline: `${size.focusRing}px solid ${color.onyx}`,
            outlineOffset: `${size.focusRingGap}px`,
          },
          "&.Mui-disabled": {
            backgroundColor: color.disabledBg,
            color: color.disabledText,
            borderColor: color.disabledBg,
          },
        },
        outlined: {
          backgroundColor: color.surface,
          borderColor: color.border,
          borderWidth: size.outlineBorder,
          "&:hover": {
            backgroundColor: color.primarySoft,
            borderColor: color.border,
            borderWidth: size.outlineBorder,
          },
        },
      },
    },

    // the input field from MUI, but overridden to use our tokens and styles
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: size.tapTarget,
          borderRadius: `${radius.md}px`,
          backgroundColor: color.surface,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: color.border,
            borderWidth: size.fieldBorder,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: color.onyx,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: color.primary,
            borderWidth: size.fieldBorderActive,
          },
          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: color.error,
            borderWidth: size.fieldBorderActive,
          },
          "&.Mui-disabled": { backgroundColor: color.disabledBg },
          "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
            borderColor: color.disabledBg,
          },
        },
        input: {
          padding: `${space[3]}px ${space[4]}px`,
          "&::placeholder": { color: color.textMuted, opacity: 1 },
        },
      },
    },

    // the helper text below the input field from MUI, but overridden to use our tokens and styles
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          display: "flex",
          alignItems: "center",
          gap: `${space[1]}px`,
          margin: `${space[2]}px 0 0`,
          ...textStyle(text.caption),
          "&.Mui-error": { color: color.error },
        },
      },
    },

    // Pop-up frame
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiDialog-paper": {
            borderRadius: `${radius.lg}px`,
            padding: `${space[6]}px`,
            backgroundColor: color.surface,
            backgroundImage: "none",
            margin: `${space[4]}px`,
          },
        },
      },
    },

    // Icon buttons (the X in the pop-up, and later the trash and people icons)
    MuiIconButton: {
      styleOverrides: {
        root: {
          width: size.tapTarget,
          height: size.tapTarget,
          color: color.onyx,
          "&:focus-visible": {
            outline: `${size.focusRing}px solid ${color.onyx}`,
            outlineOffset: `${size.focusRingGap}px`,
          },
        },
      },
    },
  },
});

export default theme;
