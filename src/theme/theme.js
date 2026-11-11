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
        outlinedPrimary: {
          borderColor: color.border,
          borderWidth: 2,
          "&:hover": {
            backgroundColor: color.primarySoft,
            borderColor: color.border,
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export default theme;
