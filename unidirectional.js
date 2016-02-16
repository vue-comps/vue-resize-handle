module.exports = {
  filters: {
    "notPrevented": require("vue-filters/notPrevented"),
    "prevent": require("vue-filters/prevent")
  },
  mixins: [require("vue-mixins/onDocument"), require("vue-mixins/onceDocument")],
  props: {
    "offset": {
      type: Number,
      "default": 0
    },
    "size": {
      type: Number,
      "default": 10
    },
    "minSize": {
      type: Number,
      "default": 0
    },
    "defaultSize": {
      type: Number,
      "default": -1
    },
    "maxSize": {
      type: Number,
      "default": Number.MAX_VALUE
    },
    "side": {
      type: String,
      "default": "right"
    },
    "parentSize": {
      type: Number,
      required: true
    }
  },
  data: function() {
    return {
      startPos: 0,
      startSize: 0,
      removeMoveListener: null,
      removeEndListener: null,
      horizontal: true,
      plus: true,
      oldCursor: null,
      style: {
        position: "absolute",
        width: null,
        height: null,
        top: null,
        left: null,
        right: null,
        bottom: null,
        cursor: "auto"
      }
    };
  },
  methods: {
    resetSize: function(e) {
      if (this.defaultSize > -1) {
        if (this.defaultSize < this.minSize) {
          return this.parentSize = this.minSize;
        } else if (this.defaultSize > this.maxSize) {
          return this.parentSize = this.maxSize;
        } else {
          return this.parentSize = this.defaultSize;
        }
      }
    },
    dragStart: function(e) {
      this.startSize = this.parentSize;
      if (this.horizontal) {
        this.startPos = e.clientX;
      } else {
        this.startPos = e.clientY;
      }
      if (document.body.style.cursor != null) {
        this.oldCursor = document.body.style.cursor;
      } else {
        this.oldCursor = null;
      }
      document.body.style.cursor = this.style.cursor;
      this.removeMoveListener = this.onDocument("mousemove", this.drag);
      return this.removeEndListener = this.onceDocument("mouseup", this.dragEnd);
    },
    drag: function(e) {
      var moved, newSize, pos;
      if (this.horizontal) {
        pos = e.clientX;
      } else {
        pos = e.clientY;
      }
      moved = pos - this.startPos;
      if (!this.plus) {
        moved = -moved;
      }
      newSize = this.startSize + moved;
      if (newSize < this.minSize) {
        newSize = this.minSize;
      } else if (newSize > this.maxSize) {
        newSize = this.maxSize;
      }
      this.parentSize = newSize;
      return e.preventDefault();
    },
    dragEnd: function(e) {
      document.body.style.cursor = this.oldCursor;
      if (typeof this.removeMoveListener === "function") {
        this.removeMoveListener();
      }
      if (typeof this.removeEndListener === "function") {
        this.removeEndListener();
      }
      e.preventDefault();
      return true;
    },
    setStyle: function() {
      this.horizontal = this.side === "left" || this.side === "right";
      this.plus = this.side === "right" || this.side === "bottom";
      this.style.right = null;
      this.style.bottom = null;
      if (this.horizontal) {
        this.style.width = this.size + "px";
        this.style.height = "100%";
        this.style.top = "0";
        this.style.left = null;
        this.style.cursor = "ew-resize";
      } else {
        this.style.width = "100%";
        this.style.height = this.size + "px";
        this.style.top = null;
        this.style.left = "0";
        this.style.cursor = "ns-resize";
      }
      return this.style[this.side] = -this.offset + "px";
    }
  },
  compiled: function() {
    return this.setStyle();
  },
  watch: {
    "minSize": function(val) {
      if (this.parentSize < val) {
        return this.parentSize = val;
      }
    },
    "maxSize": function(val) {
      if (this.parentSize > val) {
        return this.parentSize = val;
      }
    },
    "side": "setStyle",
    "size": "setStyle"
  }
};

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<div v-bind:style=style @mousedown=\"dragStart | notPrevented | prevent\" @dblclick=\"resetSize | notPrevented | prevent\" v-bind:class=\"'resize-handle-'+side\" class=resize-handle></div>"
