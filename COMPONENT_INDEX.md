# Component Index

## Components

- [`Circle`](#circle)
- [`Connector`](#connector)
- [`Ellipse`](#ellipse)
- [`Path`](#path)
- [`Svg`](#svg)

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

None.

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
