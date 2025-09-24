export function transformToHtml(text) {
  return text.replace(/\n/g, "<br>");
}

export function getBackgroundImage(imageUrl) {
  return {
    backgroundImage: `url(${imageUrl})`,
  };
}

export function getStrokeColor(color) {
  return {
    borderColor: color,
  };
}

export function getBackgroundColor(color) {
  return {
    backgroundColor: color,
  };
}
