<script>
  /**
   * @typedef {{ cx: number; cy: number; r: number; }} Circle2D
   */

  /**
   * @type {Circle2D}
   */
  export let circle2D;

  /**
   * @type {import("../Svg").NativeSvgProps}
   */
  export let svgProps;
</script>

<circle {...circle2D} {...svgProps} />
