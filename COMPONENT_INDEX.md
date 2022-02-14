# Component Index

## Components

- [`Circle`](#circle)
- [`Connector`](#connector)
- [`Diagram`](#diagram)
- [`Ellipse`](#ellipse)
- [`Grid`](#grid)
- [`GridItem`](#griditem)
- [`Image`](#image)
- [`InView`](#inview)
- [`Path`](#path)
- [`Rect`](#rect)
- [`Svg`](#svg)
- [`Text`](#text)

---

## `Circle`

### Types

```ts
export interface Circle2D {
  cx: number;
  cy: number;
  r: number;
}
```

### Props

| Prop name | Kind             | Reactive | Type                                         | Default value          | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | ---------------------- | ----------- |
| circle2D  | <code>let</code> | No       | <code>Circle2D</code>                        | <code>undefined</code> | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | <code>undefined</code> | --          |

### Slots

None.

### Events

| Event name | Type      | Detail |
| :--------- | :-------- | :----- |
| mousedown  | forwarded | --     |
| mouseup    | forwarded | --     |

## `Connector`

### Props

| Prop name  | Kind             | Reactive | Type                                         | Default value     | Description |
| :--------- | :--------------- | :------- | :------------------------------------------- | ----------------- | ----------- |
| begin      | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | <code>{}</code>   | --          |
| end        | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | <code>{}</code>   | --          |
| svgProps   | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | <code>{}</code>   | --          |
| horizontal | <code>let</code> | No       | <code>boolean</code>                         | <code>true</code> | --          |

### Slots

None.

### Events

| Event name  | Type      | Detail |
| :---------- | :-------- | :----- |
| contextmenu | forwarded | --     |
| focus       | forwarded | --     |

## `Diagram`

### Types

```ts
export type Rect2D = import("../Rect/Rect").Rect2D;

export type Coord2D = import("../Svg").Coord2D;

export type NativeSvgProps = import("../Svg").NativeSvgProps;

export interface DiagramRect {
  connections?: number[];
  id: number;
  text?: string;
  image?: string;
  rect2D: Rect2D;
  coord2D: Coord2D;
  svgProps?: NativeSvgProps;
}
```

### Props

| Prop name    | Kind             | Reactive | Type                        | Default value          | Description |
| :----------- | :--------------- | :------- | :-------------------------- | ---------------------- | ----------- |
| zoom         | <code>let</code> | Yes      | <code>number</code>         | <code>100</code>       | --          |
| rects        | <code>let</code> | No       | <code>DiagramRect[]</code>  | <code>[]</code>        | --          |
| width        | <code>let</code> | No       | <code>number</code>         | <code>0</code>         | --          |
| height       | <code>let</code> | No       | <code>number</code>         | <code>0</code>         | --          |
| svgPathProps | <code>let</code> | No       | <code>NativeSvgProps</code> | <code>undefined</code> | --          |
| templates    | <code>let</code> | No       | <code>[{                    |

     connections: [],
     rect2D: {
       width: 20,
       height: 20,
       rx: 40,
       ry: 40
     },
     coord2D: {
       x: 10,
       y: 10,
     },
     svgProps: {
       fill: '#FFCC00',
       stroke: '#333',
       'stroke-width': 2,
     }

}, {
connections: [],
rect2D: {
width: 20,
height: 20,
rx: 4,
ry: 4,
},
coord2D: {
x: 10,
y: 40,
},
svgProps: {
fill: '#FFCC00',
stroke: '#333',
'stroke-width': 2,
}
}, {
connections: [],
rect2D: {
width: 20,
height: 20,
rx: 0,
ry: 0,
},
coord2D: {
x: 10,
y: 70,
},
svgProps: {
fill: '#FFCC00',
stroke: '#333',
'stroke-width': 2,
}
}]</code> | <code>[{
connections: [],
rect2D: {
width: 20,
height: 20,
rx: 40,
ry: 40
},
coord2D: {
x: 10,
y: 10,
},
svgProps: {
fill: '#FFCC00',
stroke: '#333',
'stroke-width': 2,
}
}, {
connections: [],
rect2D: {
width: 20,
height: 20,
rx: 4,
ry: 4,
},
coord2D: {
x: 10,
y: 40,
},
svgProps: {
fill: '#FFCC00',
stroke: '#333',
'stroke-width': 2,
}
}, {
connections: [],
rect2D: {
width: 20,
height: 20,
rx: 0,
ry: 0,
},
coord2D: {
x: 10,
y: 70,
},
svgProps: {
fill: '#FFCC00',
stroke: '#333',
'stroke-width': 2,
}
}]</code> | -- |

### Slots

None.

### Events

| Event name  | Type      | Detail |
| :---------- | :-------- | :----- |
| contextmenu | forwarded | --     |

## `Ellipse`

### Types

```ts
export interface Ellipse2D {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
```

### Props

| Prop name | Kind             | Reactive | Type                                         | Default value   | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | --------------- | ----------- |
| ellipse2D | <code>let</code> | No       | <code>Ellipse2D</code>                       | <code>{}</code> | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | <code>{}</code> | --          |

### Slots

None.

### Events

None.

## `Grid`

### Props

| Prop name   | Kind             | Reactive | Type                | Default value       | Description |
| :---------- | :--------------- | :------- | :------------------ | ------------------- | ----------- |
| rowTemplate | <code>let</code> | No       | <code>string</code> | <code>'1fr'</code>  | --          |
| colTemplate | <code>let</code> | No       | <code>string</code> | <code>'1fr'</code>  | --          |
| height      | <code>let</code> | No       | <code>string</code> | <code>'auto'</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `GridItem`

### Props

| Prop name | Kind             | Reactive | Type                | Default value  | Description |
| :-------- | :--------------- | :------- | :------------------ | -------------- | ----------- |
| col       | <code>let</code> | No       | <code>number</code> | <code>1</code> | --          |
| row       | <code>let</code> | No       | <code>number</code> | <code>1</code> | --          |
| colSpan   | <code>let</code> | No       | <code>number</code> | <code>1</code> | --          |
| rowSpan   | <code>let</code> | No       | <code>number</code> | <code>1</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Image`

### Props

| Prop name | Kind             | Reactive | Type                                  | Default value | Description |
| :-------- | :--------------- | :------- | :------------------------------------ | ------------- | ----------- |
| coord2D   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | <code>{       |

     x: 0,
     y: 0,

}</code> | -- |
| rect2D | <code>let</code> | No | <code>import("../Svg").Coord2D</code> | <code>{}</code> | -- |
| image | <code>let</code> | No | <code>string</code> | <code>''</code> | -- |
| id | <code>let</code> | No | <code>string&#124;number</code> | <code>''</code> | -- |
| passThrough | <code>let</code> | No | <code>boolean</code> | <code>false</code> | -- |
| trueSize | <code>let</code> | No | <code>boolean</code> | <code>true</code> | -- |

### Slots

None.

### Events

| Event name | Type       | Detail |
| :--------- | :--------- | :----- |
| resize     | dispatched | --     |

## `InView`

### Props

| Prop name | Kind             | Reactive | Type                 | Default value      | Description |
| :-------- | :--------------- | :------- | :------------------- | ------------------ | ----------- |
| visible   | <code>let</code> | Yes      | <code>boolean</code> | <code>false</code> | --          |
| id        | <code>let</code> | No       | <code>string</code>  | <code>""</code>    | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Path`

### Props

| Prop name | Kind             | Reactive | Type                                         | Default value   | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | --------------- | ----------- |
| begin     | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | <code>{}</code> | --          |
| end       | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | <code>{}</code> | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | <code>{}</code> | --          |

### Slots

None.

### Events

None.

## `Rect`

### Types

```ts
export interface Rect2D {
  width: number;
  height: number;
  rx?: number;
  ry?: number;
}
```

### Props

| Prop name | Kind             | Reactive | Type                                         | Default value          | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | ---------------------- | ----------- |
| rect2D    | <code>let</code> | No       | <code>Rect2D</code>                          | <code>{}</code>        | --          |
| coord2D   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | <code>{}</code>        | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | <code>{}</code>        | --          |
| draggable | <code>let</code> | No       | <code>boolean</code>                         | <code>undefined</code> | --          |
| zoom      | <code>let</code> | No       | <code>number</code>                          | <code>undefined</code> | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

| Event name  | Type       | Detail |
| :---------- | :--------- | :----- |
| mouseover   | forwarded  | --     |
| focus       | forwarded  | --     |
| mouseleave  | forwarded  | --     |
| blur        | forwarded  | --     |
| mousedown   | forwarded  | --     |
| mouseup     | forwarded  | --     |
| click       | forwarded  | --     |
| dblclick    | forwarded  | --     |
| contextmenu | forwarded  | --     |
| drag        | dispatched | --     |
| dragEnd     | dispatched | --     |

## `Svg`

### Types

```ts
export interface Coord2D {
  x: number;
  y: number;
}

export type Linecap = "round" | "butt" | "square";

export interface NativeSvgProps {
  fill?: string;
  "stroke-width"?: number;
  "stroke-linecap"?: Linecap;
  stroke?: string;
}
```

### Props

| Prop name | Kind             | Reactive | Type                 | Default value          | Description |
| :-------- | :--------------- | :------- | :------------------- | ---------------------- | ----------- |
| width     | <code>let</code> | No       | <code>number</code>  | <code>undefined</code> | --          |
| height    | <code>let</code> | No       | <code>number</code>  | <code>undefined</code> | --          |
| id        | <code>let</code> | No       | <code>string</code>  | <code>undefined</code> | --          |
| zoom      | <code>let</code> | No       | <code>number</code>  | <code>undefined</code> | --          |
| offset    | <code>let</code> | No       | <code>Coord2D</code> | <code>{                |

     x: 0,
     y: 0,

}</code> | -- |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Text`

### Props

| Prop name | Kind             | Reactive | Type                                  | Default value   | Description |
| :-------- | :--------------- | :------- | :------------------------------------ | --------------- | ----------- |
| coord2D   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | <code>{}</code> | --          |
| rect2D    | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | <code>{}</code> | --          |
| text      | <code>let</code> | No       | <code>string</code>                   | <code>''</code> | --          |
| padding   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | <code>{         |

     x: 0,
     y: 0,

}</code> | -- |
| passThrough | <code>let</code> | No | <code>boolean</code> | <code>false</code> | -- |

### Slots

None.

### Events

None.
