function noop() { }
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function set_svg_attributes(node, attributes) {
    for (const key in attributes) {
        attr(node, key, attributes[key]);
    }
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : options.context || []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src\components\Component.svelte generated by Svelte v3.42.2 */

function create_fragment$5(ctx) {
	let h1;
	let t0;
	let t1;
	let t2;
	let t3;
	let button;
	let t4;
	let mounted;
	let dispose;

	return {
		c() {
			h1 = element("h1");
			t0 = text("Hello ");
			t1 = text(/*name*/ ctx[1]);
			t2 = text("!");
			t3 = space();
			button = element("button");
			t4 = text(/*buttonText*/ ctx[0]);
		},
		m(target, anchor) {
			insert(target, h1, anchor);
			append(h1, t0);
			append(h1, t1);
			append(h1, t2);
			insert(target, t3, anchor);
			insert(target, button, anchor);
			append(button, t4);

			if (!mounted) {
				dispose = listen(button, "click", /*handleClick*/ ctx[2]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 2) set_data(t1, /*name*/ ctx[1]);
			if (dirty & /*buttonText*/ 1) set_data(t4, /*buttonText*/ ctx[0]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(h1);
			if (detaching) detach(t3);
			if (detaching) detach(button);
			mounted = false;
			dispose();
		}
	};
}

function instance$5($$self, $$props, $$invalidate) {
	let { name } = $$props;
	let { buttonText = "Button" } = $$props;

	function handleClick() {
		$$invalidate(0, buttonText += " Clicked");
	}

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(1, name = $$props.name);
		if ('buttonText' in $$props) $$invalidate(0, buttonText = $$props.buttonText);
	};

	return [buttonText, name, handleClick];
}

class Component extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$5, create_fragment$5, safe_not_equal, { name: 1, buttonText: 0 });
	}
}

/* src\Svg\Svg.svelte generated by Svelte v3.42.2 */

function create_fragment$4(ctx) {
	let svg;
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c() {
			svg = svg_element("svg");
			if (default_slot) default_slot.c();
			attr(svg, "width", /*width*/ ctx[0]);
			attr(svg, "height", /*height*/ ctx[1]);
		},
		m(target, anchor) {
			insert(target, svg, anchor);

			if (default_slot) {
				default_slot.m(svg, null);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
					update_slot_base(
						default_slot,
						default_slot_template,
						ctx,
						/*$$scope*/ ctx[2],
						!current
						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
						null
					);
				}
			}

			if (!current || dirty & /*width*/ 1) {
				attr(svg, "width", /*width*/ ctx[0]);
			}

			if (!current || dirty & /*height*/ 2) {
				attr(svg, "height", /*height*/ ctx[1]);
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(svg);
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { width } = $$props;
	let { height } = $$props;

	$$self.$$set = $$props => {
		if ('width' in $$props) $$invalidate(0, width = $$props.width);
		if ('height' in $$props) $$invalidate(1, height = $$props.height);
		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [width, height, $$scope, slots];
}

class Svg extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$4, create_fragment$4, safe_not_equal, { width: 0, height: 1 });
	}
}

/* src\Svg\Arc\Circle.svelte generated by Svelte v3.42.2 */

function create_fragment$3(ctx) {
	let circle;
	let circle_levels = [/*circle2D*/ ctx[0], /*svgProps*/ ctx[1]];
	let circle_data = {};

	for (let i = 0; i < circle_levels.length; i += 1) {
		circle_data = assign(circle_data, circle_levels[i]);
	}

	return {
		c() {
			circle = svg_element("circle");
			set_svg_attributes(circle, circle_data);
		},
		m(target, anchor) {
			insert(target, circle, anchor);
		},
		p(ctx, [dirty]) {
			set_svg_attributes(circle, circle_data = get_spread_update(circle_levels, [
				dirty & /*circle2D*/ 1 && /*circle2D*/ ctx[0],
				dirty & /*svgProps*/ 2 && /*svgProps*/ ctx[1]
			]));
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(circle);
		}
	};
}

function instance$3($$self, $$props, $$invalidate) {
	let { circle2D } = $$props;
	let { svgProps } = $$props;

	$$self.$$set = $$props => {
		if ('circle2D' in $$props) $$invalidate(0, circle2D = $$props.circle2D);
		if ('svgProps' in $$props) $$invalidate(1, svgProps = $$props.svgProps);
	};

	return [circle2D, svgProps];
}

class Circle extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { circle2D: 0, svgProps: 1 });
	}
}

/* src\Svg\Arc\Ellipse.svelte generated by Svelte v3.42.2 */

function create_fragment$2(ctx) {
	let ellipse;
	let ellipse_levels = [/*ellipse2D*/ ctx[0], /*svgProps*/ ctx[1]];
	let ellipse_data = {};

	for (let i = 0; i < ellipse_levels.length; i += 1) {
		ellipse_data = assign(ellipse_data, ellipse_levels[i]);
	}

	return {
		c() {
			ellipse = svg_element("ellipse");
			set_svg_attributes(ellipse, ellipse_data);
		},
		m(target, anchor) {
			insert(target, ellipse, anchor);
		},
		p(ctx, [dirty]) {
			set_svg_attributes(ellipse, ellipse_data = get_spread_update(ellipse_levels, [
				dirty & /*ellipse2D*/ 1 && /*ellipse2D*/ ctx[0],
				dirty & /*svgProps*/ 2 && /*svgProps*/ ctx[1]
			]));
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(ellipse);
		}
	};
}

function instance$2($$self, $$props, $$invalidate) {
	let { ellipse2D } = $$props;
	let { svgProps } = $$props;

	$$self.$$set = $$props => {
		if ('ellipse2D' in $$props) $$invalidate(0, ellipse2D = $$props.ellipse2D);
		if ('svgProps' in $$props) $$invalidate(1, svgProps = $$props.svgProps);
	};

	return [ellipse2D, svgProps];
}

class Ellipse extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$2, create_fragment$2, safe_not_equal, { ellipse2D: 0, svgProps: 1 });
	}
}

/* src\Svg\Path\Connector.svelte generated by Svelte v3.42.2 */

function create_fragment$1(ctx) {
	let path_1;
	let path_1_levels = [{ d: /*path*/ ctx[1] }, /*svgProps*/ ctx[0]];
	let path_1_data = {};

	for (let i = 0; i < path_1_levels.length; i += 1) {
		path_1_data = assign(path_1_data, path_1_levels[i]);
	}

	return {
		c() {
			path_1 = svg_element("path");
			set_svg_attributes(path_1, path_1_data);
		},
		m(target, anchor) {
			insert(target, path_1, anchor);
		},
		p(ctx, [dirty]) {
			set_svg_attributes(path_1, path_1_data = get_spread_update(path_1_levels, [
				dirty & /*path*/ 2 && { d: /*path*/ ctx[1] },
				dirty & /*svgProps*/ 1 && /*svgProps*/ ctx[0]
			]));
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(path_1);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { begin } = $$props;
	let { end } = $$props;
	let { svgProps } = $$props;
	let { horizontal = true } = $$props;
	let path;

	onMount(() => {
		// calculate thirds
		(end.x - begin.x) / 3;

		// let twoThirdX = thirdX * 2;
		(end.y - begin.y) / 3;

		// let twoThirdY = thirdY * 2;
		if (horizontal) {
			let oneHalfX = (end.x - begin.x) / 2;
			$$invalidate(1, path = `M${begin.x},${begin.y} L${begin.x + oneHalfX},${begin.y} L${begin.x + oneHalfX},${end.y} L${end.x},${end.y}`);
		} else {
			let oneHalfY = (end.y - begin.y) / 2;
			$$invalidate(1, path = `M${begin.x},${begin.y} L${begin.x},${begin.y + oneHalfY} L${end.x},${begin.y + oneHalfY} L${end.x},${end.y}`);
		}
	});

	$$self.$$set = $$props => {
		if ('begin' in $$props) $$invalidate(2, begin = $$props.begin);
		if ('end' in $$props) $$invalidate(3, end = $$props.end);
		if ('svgProps' in $$props) $$invalidate(0, svgProps = $$props.svgProps);
		if ('horizontal' in $$props) $$invalidate(4, horizontal = $$props.horizontal);
	};

	return [svgProps, path, begin, end, horizontal];
}

class Connector extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			begin: 2,
			end: 3,
			svgProps: 0,
			horizontal: 4
		});
	}
}

/* src\Svg\Path\Path.svelte generated by Svelte v3.42.2 */

function create_fragment(ctx) {
	let path_1;
	let path_1_levels = [{ d: /*path*/ ctx[1] }, /*svgProps*/ ctx[0]];
	let path_1_data = {};

	for (let i = 0; i < path_1_levels.length; i += 1) {
		path_1_data = assign(path_1_data, path_1_levels[i]);
	}

	return {
		c() {
			path_1 = svg_element("path");
			set_svg_attributes(path_1, path_1_data);
		},
		m(target, anchor) {
			insert(target, path_1, anchor);
		},
		p(ctx, [dirty]) {
			set_svg_attributes(path_1, path_1_data = get_spread_update(path_1_levels, [
				dirty & /*path*/ 2 && { d: /*path*/ ctx[1] },
				dirty & /*svgProps*/ 1 && /*svgProps*/ ctx[0]
			]));
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(path_1);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { begin } = $$props;
	let { end } = $$props;
	let { svgProps } = $$props;
	let path;

	onMount(() => {
		$$invalidate(1, path = `M${begin.x},${begin.y} L${end.x},${end.y}`);
	});

	$$self.$$set = $$props => {
		if ('begin' in $$props) $$invalidate(2, begin = $$props.begin);
		if ('end' in $$props) $$invalidate(3, end = $$props.end);
		if ('svgProps' in $$props) $$invalidate(0, svgProps = $$props.svgProps);
	};

	return [svgProps, path, begin, end];
}

class Path extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { begin: 2, end: 3, svgProps: 0 });
	}
}

export { Circle, Component as Componenta, Connector, Ellipse, Path, Svg };
