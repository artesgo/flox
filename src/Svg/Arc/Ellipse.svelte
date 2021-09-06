<script>
  /**
   * @typedef {{ cx: number; cy: number; rx: number; ry: number; }} Ellipse2D
   */

   /** @type {Ellipse2D} */
  export let ellipse2D = {};
  /** @type {import("../Svg").NativeSvgProps} */
   export let svgProps = {};
</script>

<ellipse {...ellipse2D} {...svgProps} />
