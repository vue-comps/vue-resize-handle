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
      type: Object,
      "default": {
        height: 0,
        width: 0
      }
    },
    "defaultSize": {
      type: Object,
      "default": {
        height: -1,
        width: -1
      }
    },
    "maxSize": {
      type: Object,
      "default": {
        height: Number.MAX_VALUE,
        width: Number.MAX_VALUE
      }
    },
    "keepRatio": {
      type: Boolean,
      "default": false
    },
    "corner": {
      type: String,
      "default": "se"
    },
    "parentSize": {
      type: Object,
      required: {
        height: 0,
        width: 0
      }
    }
  },
  data: function() {
    return {
      oldCursor: null,
      ratio: null,
      ratioSet: false,
      removeMoveListener: null,
      removeEndListener: null,
      removeKeydownListener: null,
      removeKeyupListener: null,
      dragging: false,
      firstLimit: null,
      startPos: {
        x: 0,
        y: 0
      },
      startSize: {
        width: 0,
        height: 0
      },
      direction: {
        x: 1,
        y: 1
      },
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
      var newSize;
      if ((this.defaultSize != null) && (this.defaultSize.height > -1 || this.defaultSize.width > -1)) {
        newSize = {};
        if (this.defaultSize.height > -1) {
          newSize.height = this.defaultSize.height;
        } else {
          newSize.height = this.parentSize.height;
        }
        if (this.defaultSize.width > -1) {
          newSize.width = this.defaultSize.width;
        } else {
          newSize.width = this.parentSize.width;
        }
        newSize = this.processMinMax(newSize);
        if (this.keepRatio) {
          newSize = this.processRatio(newSize);
        }
        return this.parentSize = newSize;
      }
    },
    dragStart: function(e) {
      if (e.ctrlKey && !this.keepRatio) {
        this.setRatio();
      }
      this.startSize.width = this.parentSize.width;
      this.startSize.height = this.parentSize.height;
      this.dragging = true;
      this.startPos = {
        x: e.clientX,
        y: e.clientY
      };
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
      var diff, newSize;
      diff = {
        x: (e.clientX - this.startPos.x) * this.direction.x,
        y: (e.clientY - this.startPos.y) * this.direction.y
      };
      newSize = {
        width: this.startSize.width + diff.x,
        height: this.startSize.height + diff.y
      };
      if (e.ctrlKey || this.keepRatio) {
        if (diff.y * this.ratio > diff.x) {
          newSize.width = newSize.height * this.ratio;
        } else {
          newSize.height = newSize.width / this.ratio;
        }
      }
      newSize = this.processMinMax(newSize);
      if (e.ctrlKey || this.keepRatio) {
        newSize = this.processRatio(newSize);
      }
      this.parentSize = newSize;
      return e.preventDefault();
    },
    dragEnd: function(e) {
      document.body.style.cursor = this.oldCursor;
      this.dragging = false;
      if (typeof this.removeMoveListener === "function") {
        this.removeMoveListener();
      }
      if (typeof this.removeEndListener === "function") {
        this.removeEndListener();
      }
      e.preventDefault();
      return true;
    },
    setCorner: function() {
      this.style.cursor = this.corner + "-resize";
      if (this.corner[0] === "n") {
        this.direction.y = -1;
        this.style.top = -this.offset + "px";
        this.style.bottom = null;
      } else {
        this.direction.y = 1;
        this.style.top = null;
        this.style.bottom = -this.offset + "px";
      }
      if (this.corner[1] === "e") {
        this.direction.x = 1;
        this.style.left = null;
        return this.style.right = -this.offset + "px";
      } else {
        this.direction.x = -1;
        this.style.left = -this.offset + "px";
        return this.style.right = null;
      }
    },
    setSize: function() {
      this.style.width = this.size + "px";
      return this.style.height = this.size + "px";
    },
    setRatio: function() {
      return this.ratio = this.parentSize.width / this.parentSize.height;
    },
    processMinMax: function(size) {
      if (size.width < this.minSize.width) {
        size.width = this.minSize.width;
      } else if (size.width > this.maxSize.width) {
        size.width = this.maxSize.width;
      }
      if (size.height < this.minSize.height) {
        size.height = this.minSize.height;
      } else if (size.height > this.maxSize.height) {
        size.height = this.maxSize.height;
      }
      return size;
    },
    processRatio: function(size) {
      if (size.height === this.maxSize.height && this.ratio < 1) {
        size.width = size.height * this.ratio;
      } else if (size.width === this.maxSize.width && this.ratio > 1) {
        size.height = size.width / this.ratio;
      } else if (size.height === this.minSize.height && this.ratio > 1) {
        size.width = size.height * this.ratio;
      } else if (size.width === this.minSize.width && this.ratio < 1) {
        size.height = size.width / this.ratio;
      }
      return size;
    },
    saveRatio: function(e) {
      if (!this.ratioSet && e.keyCode === 17 && this.dragging && !this.keepRatio) {
        this.setRatio();
        return this.ratioSet = true;
      }
    },
    releaseSaveRatio: function(e) {
      if (e.keyCode === 17) {
        return this.ratioSet = false;
      }
    }
  },
  compiled: function() {
    this.setCorner();
    this.setSize();
    if (this.keepRatio) {
      this.setRatio();
    }
    this.resetSize();
    this.removeKeydownListener = this.onDocument("keydown", this.saveRatio);
    return this.removeKeyupListener = this.onDocument("keyup", this.releaseSaveRatio);
  },
  beforeDestroy: function() {
    if (typeof this.removeKeydownListener === "function") {
      this.removeKeydownListener();
    }
    return typeof this.removeKeyupListener === "function" ? this.removeKeyupListener() : void 0;
  },
  watch: {
    "minSize.width": function(val) {
      if (this.parentSize.width < val.width) {
        return this.parentSize.width = val.width;
      }
    },
    "minSize.height": function(val) {
      if (this.parentSize.height < val.height) {
        return this.parentSize.height = val.height;
      }
    },
    "maxSize.width": function(val) {
      if (this.parentSize.width > val.width) {
        return this.parentSize.width = val.width;
      }
    },
    "maxSize.height": function(val) {
      if (this.parentSize.height > val.height) {
        return this.parentSize.height = val.height;
      }
    },
    "corner": "setCorner",
    "size": "setSize",
    "keepRatio": function(val) {
      if (this.val) {
        return this.setRatio();
      }
    }
  }
};

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function"? module.exports.options: module.exports).template = "<div v-bind:style=style @mousedown=\"dragStart | notPrevented | prevent\" @dblclick=\"resetSize | notPrevented | prevent\" v-bind:class=\"'resize-handle-'+corner\" class=resize-handle></div>"
