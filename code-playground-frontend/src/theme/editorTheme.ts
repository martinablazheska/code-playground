export const editorTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6A9955" },
    { token: "keyword", foreground: "569CD6" },
    { token: "string", foreground: "CE9178" },
    // Add more token rules here
  ],
  colors: {
    "editor.background": "#27272a",
    "editor.foreground": "#D4D4D4",
    "editorCursor.foreground": "#FFFFFF",
    "editor.lineHighlightBackground": "#2F2F2F",
    "editorLineNumber.foreground": "#858585",
    "editor.selectionBackground": "#264F78",
    "editor.inactiveSelectionBackground": "#3A3D41",
    // Add more color rules here
  },
};
