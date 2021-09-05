# Component Index

## Components

- [`Circle`](#circle)
- [`Connector`](#connector)
- [`Diagram`](#diagram)
- [`Ellipse`](#ellipse)
- [`Image`](#image)
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

| Prop name | Kind             | Reactive | Type                                         | Default value | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | ------------- | ----------- |
| circle2D  | <code>let</code> | No       | <code>Circle2D</code>                        | --            | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | --            | --          |

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
| begin      | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | --                | --          |
| end        | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | --                | --          |
| svgProps   | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | --                | --          |
| horizontal | <code>let</code> | No       | <code>boolean</code>                         | <code>true</code> | --          |

### Slots

None.

### Events

| Event name  | Type      | Detail |
| :---------- | :-------- | :----- |
| contextmenu | forwarded | --     |
| focus       | forwarded | --     |

## `Diagram`

### Props

| Prop name       | Kind             | Reactive | Type    | Default value | Description |
| :-------------- | :--------------- | :------- | :------ | ------------- | ----------- |
| rects           | <code>let</code> | No       | --      | --            | --          |
| width           | <code>let</code> | No       | --      | --            | --          |
| height          | <code>let</code> | No       | --      | --            | --          |
| svgPathProps    | <code>let</code> | No       | --      | --            | --          |
| svgPropTemplate | <code>let</code> | No       | <code>{ |

     fill: '#FC0',
     stroke: '#333',
     'stroke-width': 2,

}</code> | <code>{
fill: '#FC0',
stroke: '#333',
'stroke-width': 2,
}</code> | -- |
| templates | <code>let</code> | No | <code>[{
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
svgProps: svgPropTemplate
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
svgProps: svgPropTemplate
}, {
connections: [],
rect2D: {
width: 20,
height: 20,
},
coord2D: {
x: 10,
y: 70,
},
svgProps: svgPropTemplate
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
svgProps: svgPropTemplate
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
svgProps: svgPropTemplate
}, {
connections: [],
rect2D: {
width: 20,
height: 20,
},
coord2D: {
x: 10,
y: 70,
},
svgProps: svgPropTemplate
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

| Prop name | Kind             | Reactive | Type                                         | Default value | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | ------------- | ----------- |
| ellipse2D | <code>let</code> | No       | <code>Ellipse2D</code>                       | --            | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | --            | --          |

### Slots

None.

### Events

None.

## `Image`

### Props

| Prop name   | Kind             | Reactive | Type                                  | Default value      | Description |
| :---------- | :--------------- | :------- | :------------------------------------ | ------------------ | ----------- |
| coord2D     | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | --                 | --          |
| rect2D      | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | --                 | --          |
| image       | <code>let</code> | No       | <code>string</code>                   | --                 | --          |
| passThrough | <code>let</code> | No       | <code>boolean</code>                  | <code>false</code> | --          |

### Slots

None.

### Events

None.

## `Path`

### Props

| Prop name | Kind             | Reactive | Type                                         | Default value | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | ------------- | ----------- |
| begin     | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | --            | --          |
| end       | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | --            | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | --            | --          |

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
  rx: number;
  ry: number;
}
```

### Props

| Prop name | Kind             | Reactive | Type                                         | Default value | Description |
| :-------- | :--------------- | :------- | :------------------------------------------- | ------------- | ----------- |
| rect2D    | <code>let</code> | No       | <code>Rect2D</code>                          | --            | --          |
| coord2D   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code>        | --            | --          |
| svgProps  | <code>let</code> | No       | <code>import("../Svg").NativeSvgProps</code> | --            | --          |
| draggable | <code>let</code> | No       | <code>boolean</code>                         | --            | --          |

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
  fill: string;
  "stroke-width": number;
  "stroke-linecap": Linecap;
  stroke: string;
}
```

### Props

| Prop name | Kind             | Reactive | Type | Default value | Description |
| :-------- | :--------------- | :------- | :--- | ------------- | ----------- |
| width     | <code>let</code> | No       | --   | --            | --          |
| height    | <code>let</code> | No       | --   | --            | --          |
| id        | <code>let</code> | No       | --   | --            | --          |

### Slots

| Slot name | Default | Props | Fallback |
| :-------- | :------ | :---- | :------- |
| --        | Yes     | --    | --       |

### Events

None.

## `Text`

### Props

| Prop name | Kind             | Reactive | Type                                  | Default value | Description |
| :-------- | :--------------- | :------- | :------------------------------------ | ------------- | ----------- |
| coord2D   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | --            | --          |
| rect2D    | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | --            | --          |
| text      | <code>let</code> | No       | <code>string</code>                   | --            | --          |
| padding   | <code>let</code> | No       | <code>import("../Svg").Coord2D</code> | <code>{       |

     x: 0,
     y: 0,

}</code> | -- |
| passThrough | <code>let</code> | No | <code>boolean</code> | <code>false</code> | -- |

### Slots

None.

### Events

None.
