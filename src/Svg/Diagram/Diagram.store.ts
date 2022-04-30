import { writable } from "svelte/store";

let _nextId = 0;

let overSize = {
  x: 0,
  y: 0,
}

function calculateAspectRatioFit(src, max) {
  const ratio = Math.min(max.width / src.width, max.height / src.height);
  return { width: src.width * ratio, height: src.height * ratio };
}

function createConnectionPointOffsets(rect) {
  let ret = {
    left: {x: 0, y: 0},
    right: {x: 0, y: 0},
    top: {x: 0, y: 0},
    bottom: {x: 0, y: 0},
  };
  if (!(rect.coord2D && rect.rect2D)) {
    console.error('')
  } else {
    let { width, height } = updateGridPoints(rect);
    // connectionPointOffsets
    ret.left = { x: 0, y: height / 2};
    ret.right = { x: width, y: height / 2};
    ret.top = { x: width / 2, y: 0};
    ret.bottom = { x: width / 2, y: height};
  }
  return ret;
}

function createResizingPointOffsets(rect) {
  let ret = {
    // 'top-left': {x: 0, y: 0},
    // 'top-right': {x: 0, y: 0},
    // 'bottom-left': {x: 0, y: 0},
    // 'bottom-right': {x: 0, y: 0},
  };
  if (!(rect.coord2D && rect.rect2D)) {
    console.error('')
  } else {
    let { width, height } = updateGridPoints(rect);
    // TODO: find a way to allow top left resize that maps closer to actual cursor position
    ret['top-left'] = { x: 0, y: 0};
    ret['top-right'] = { x: width, y: 0};
    ret['bottom-left'] = { x: 0, y: height};
    ret['bottom-right'] = { x: width, y: height};
  }
  return ret;
}

function updateGridPoints(rect) {
  let width = rect.rect2D.width;
  let height = rect.rect2D.height;
  // if (grid > 0) {
  //   width = Math.floor(width / grid) * grid;
  //   height = Math.floor(height / grid) * grid;
  // }
  return {
    width, height
  }
}

function updatePoints(rect) {
  const connectionPoints = createConnectionPointOffsets(rect);
  const resizePoints = {
    // ...connectionPoints,
    ...createResizingPointOffsets(rect)
  };
  return {
    connectionPoints,
    resizePoints
  }
}

export function createDiagramStore(rects) {
  const { subscribe, update, set } = writable([
    ...rects.map(r => {
      if (r.id >= _nextId) {
        _nextId = r.id;
        _nextId++;
      }
      r.connectionPoints = createConnectionPointOffsets(r);
      r.resizePoints = {
        ...createResizingPointOffsets(r)
      };
      return r;
    })
  ]);

  return {
    subscribe,
    set,
    moveRect: (rect, event, zoom) => update((rects) => {
      return rects.map(r => {
        if (rect.id === r.id) {
          r.coord2D.x += (event.detail.dx * zoom / 100);
          r.coord2D.y += (event.detail.dy * zoom / 100);
        }
        return r;
      })
    }),
    addRect: (coord, template) => update((rects) => {
      //#region prevents fuzzy connections
      if (coord.x % 2 === 1) coord.x--;
      if (coord.y % 2 === 1) coord.y--;
      //#endregion
      let newRect = {
        ...template,
        rect2D: {
          width: template.rect2D.width * 5,
          height: template.rect2D.height * 5,
          rx: template.rect2D.rx * 5,
          ry: template.rect2D.ry * 5,
        },
      }
      newRect = {
        ...newRect,
        ...updatePoints(newRect)
      }
      newRect.coord2D = coord;
      newRect.id = _nextId++;
      return [...rects, newRect];
    }),
    updateText: (rect, text) => update((rects) => {
      return rects.map(r => {
        if (r.id === rect.id) {
          r.text = text;
        }
        return r;
      })
    }),
    updateImage: (rect, image) => update((rects) => {
      return rects.map(r => {
        if (r.id === rect.id) {
          r.image = image;
        }
        return r;
      })
    }),
    deleteRect: (id) => update((rects) => {
      return rects.filter(r => r.id !== id)
    }),
    resizeRect: (target, resizeFrom, mouseCoord, zoom, e) => update((rects) => {
      return rects.map(rect => {
        if (rect.id === target.id) {
          const stayAtX = rect.coord2D.x + rect.rect2D.width;
          const stayAtY = rect.coord2D.y + rect.rect2D.height;
          if (resizeFrom.indexOf('top') > -1) {
            if (rect.rect2D.height - overSize.y > 100) {
              rect.coord2D.y = mouseCoord.y;
              rect.rect2D.height -= e.detail.dy * zoom / 100;
            } else {
              overSize.y += e.detail.dy;
            }
          }
          if (resizeFrom.indexOf('left') > -1) {
            if (rect.rect2D.width - overSize.x > 100) {
              rect.coord2D.x = mouseCoord.x;
              rect.rect2D.width -= e.detail.dx * zoom / 100;
            } else {
              overSize.x += e.detail.dx;
            }
          }
          if (resizeFrom.indexOf('right') > -1) {
            const width = mouseCoord.x - target.coord2D.x;
            if (width > 100) {
              rect.rect2D.width = width;
            } else {
              rect.rect2D.width = 100;
            }
          }
          if (resizeFrom.indexOf('bottom') > -1) {
            const height = mouseCoord.y - rect.coord2D.y;
            if (height > 100) {
              rect.rect2D.height = height;
            } else {
              rect.rect2D.height = 100;
            }
          }
          // get aspect ratio
          if (rect.aspectRatio) {
            rect.rect2D = calculateAspectRatioFit(rect.aspectRatio, {
              // 10k makes it so that we prioritize height
              width: rect.rect2D.width + 10000,
              height: rect.rect2D.height,
            });
            if (resizeFrom.indexOf('top') > -1) {
              rect.coord2D = {
                ...rect.coord2D,
                y: stayAtY - rect.rect2D.height
              }
            }
            if (resizeFrom.indexOf('left') > -1) {
              rect.coord2D = {
                ...rect.coord2D,
                x: stayAtX - rect.rect2D.width
              }
            }
          }
          rect = {
            ...rect,
            ...updatePoints(rect)
          }
        }
        return rect;
      })
    }),
    setRectAspectRatio: (rect, detail) => update((rects) => {
      return rects.map(r => {
        if (r.id === rect.id) {
          r.aspectRatio = detail;
        }
        return r;
      })
    }),
    resetOversize: () => overSize = {
      x: 0,
      y: 0,
    },
  }
}