import { writable } from "svelte/store";

function getEndRect(rects, connectorId) {
  return rects.find(r => r.id === connectorId);
}

function createConnector(startRect, endRect) {
  let { begin, end } = findClosestConnection(startRect, endRect);
  return {
    begin: { ...begin, id: startRect.id},
    end: { ...end, id: endRect.id},
  }
}

function initConnectors(rects, rect, connectionId) {
  let endRect = getEndRect(rects, connectionId);
  return createConnector(rect, endRect);
}

function findClosestConnection(startRect, endRect) {
  let shortest;
  for (let key of Object.keys(startRect.connectionPoints)) {
    for (let otherKey of Object.keys(endRect.connectionPoints)) {
      let begin = addCoord2D(startRect.coord2D, startRect.connectionPoints[key]);
      let end = addCoord2D(endRect.coord2D, endRect.connectionPoints[otherKey]);
      let distance = getDistance(begin, end);
      if (!shortest || distance < shortest.distance) {
        shortest = {
          begin,
          end,
          distance,
        }
      }
    }
  }
  delete shortest.distance;
  return shortest;
}

function addCoord2D(coordA, coordB) {
  return {
    x: coordA.x + coordB.x,
    y: coordA.y + coordB.y
  }
}

function getDistance(coordA, coordB) {
  let xDiff = Math.abs(coordA.x - coordB.x);
  let yDiff = Math.abs(coordA.y - coordB.y);
  return xDiff + yDiff;
}

export function createConnectionsStore(diagramStore) {
  let connections = [];
  diagramStore.map(rect => {
    if (rect.connections && rect.connections.length > 0) {
      connections = [
        ...connections,
        ...rect.connections.map(connection => initConnectors(diagramStore, rect, connection))
      ];
      // discard connections now that they are created and tracked via $connections;
      rect.connections = [];
    }
  });
  const { subscribe, set, update } = writable(connections);

  return {
    subscribe,
    set,
    update,
    updateConnection: (rect, event, zoom) => update((conns) => {
      return conns.map(conn => {
        if (conn.begin.id === rect.id) {
          conn.begin.x += (event.detail.dx * zoom / 100);
          conn.begin.y += (event.detail.dy * zoom / 100);
        } else if (conn.end.id === rect.id) {
          conn.end.x += (event.detail.dx * zoom / 100);
          conn.end.y += (event.detail.dy * zoom / 100);
        }
        return conn;
      })
    }),
    updateClosest: (store) => update((conns) => {
      return conns.map(conn => {
        let startRect = store.find(r => r.id === conn.begin.id);
        let endRect = store.find(r => r.id === conn.end.id);
        let {begin, end} = findClosestConnection(startRect, endRect);
        begin.id = conn.begin.id;
        end.id = conn.end.id;
        return {...conn, begin, end};
      })
    }),
    removePlaceholder: () => update((conns) => {
      return conns.filter(conn => {
        return conn.end.id !== -999;
      })
    }),
    createConnection: (newConnection, rect) => update((conns) => {
      // check for existing connections to the same rects
      let found = conns.find(conn => {
        if (
          (conn.begin.id === newConnection.id && conn.end.id === rect.id) ||
          (conn.begin.id === rect.id && conn.end.id === newConnection.id)
        ) {
          return conn;
        }
      });

      if (!!found) {
        return conns;
      }
  
      // cannot connect to self
      if (!!rect && rect.id !== newConnection.id) {
        let connection = createConnector(newConnection, rect);
        return [
          ...conns,
          connection
        ];
      }
      return conns;
    }),
    createPreview: (rect, point, zoom, offset, e) => update((conns) => {
      let connectionPreview = {
        begin: {
          ...addCoord2D(rect.connectionPoints[point], rect.coord2D),
          id: rect.id
        },
        end: {
          x: (e.offsetX * zoom / 100) + offset.x,
          y: (e.offsetY * zoom / 100) + offset.y,
          id: -999,
        }
      }
      return [
        ...conns,
        connectionPreview
      ];
    }),
    updatePreview: (e, zoom, offset) => update((conns) => {
      return conns.map(conn => {
        if (conn.end.id === -999) {
          conn.end.x = ((e.offsetX) * zoom / 100) + offset.x
          conn.end.y = ((e.offsetY) * zoom / 100) + offset.y
        }
        return conn;
      })
    }),
    deleteConnections: (id) => update((conns) => {
      return conns.filter(conn => conn.begin.id !== id || conn.end.id !== id);
    }),
    deleteConnection: (deletedConnection) => update((conns) => {
      return conns.filter(conn => conn.begin.id !== deletedConnection.begin.id)
    }),
    markConnectionsDeleted: (id) => {
      update(conns => {
        return conns.map(conn => {
          if (conn.begin.id === id || conn.end.id === id) {
            conn.deleted = true;
          }
          return conn;
        })
      })
    },
    unmarkConnectionsDeleted: (id) => {
      update(conns => {
        return conns.map(conn => {
          if (conn.begin.id === id || conn.end.id === id) {
            conn.deleted = false;
          }
          return conn;
        })
      })
    },
    markConnectionDeleted: (deletedConnection) => {
      update(conns => {
        return conns.map(conn => {
          if (conn.begin.id === deletedConnection.begin.id && conn.end.id === deletedConnection.end.id) {
            conn.deleted = true;
          }
          return conn;
        })
      })
    },
    unmarkConnectionDeleted: (deletedConnection) => {
      update(conns => {
        return conns.map(conn => {
          if (conn.begin.id === deletedConnection.begin.id && conn.end.id === deletedConnection.end.id) {
            conn.deleted = false;
          }
          return conn;
        })
      })
    },
  }
}
