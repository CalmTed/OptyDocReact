export const colorModes = [
  ["Auto",
    "auto"],
  ["Dark",
    "dark"],
  ["Light",
    "light"]
];
export const templateSizes = {
  "A4":["210mm",
    "297.1mm"],
  "A3":["297mm",
    "419.9mm"],
  "A5":["148mm",
    "209.9mm"]
};
export const templateOrientations = {
  "portrait": ["Portrait",
    "portrait"],
  "landscape": ["Landscape",
    "landscape"]
};

export const TAB_NAMES = {
  edit:"edit",
  copy:"copy",
  print:"print"
};

const capilalize = (str) => {
  return  str.charAt(0).toUpperCase() + str.substr(1);
};
export const tabOptions = Object.values(TAB_NAMES).map(tabName => {
  return [capilalize(tabName),
    tabName];
});

export const MI_INPUT_TYPES = {
  size:"size",
  selector:"selector",
  color:"color",
  text:"text",
  textarea:"textarea",
  file:"file",
  button:"button"
};

export const NO_BLOCK_SELECTED = null;
export const NO_COPY_SELECTED = null;

export const TAB_INDEXES = {
  tabs: 1,
  topButton:7,
  stack: 8,
  block: 10
};