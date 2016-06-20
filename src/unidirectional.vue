// out: ..
<template lang="pug">
.resize-handle(
  v-bind:style="style"
  style="position: absolute"
  @mousedown="dragStart"
  @dblclick="resetSize"
  v-bind:class="'resize-handle-'+side"
  )
</template>

<script lang="coffee">
module.exports =

  mixins:[
    require("vue-mixins/onDocument")
    require("vue-mixins/onceDocument")
  ]


  props:
    "offset":
      type: Number
      default: 0
    "extent":
      type: Number
      default: 10
    "minSize":
      type: Number
      default: 0
    "defaultSize":
      type: Number
      default: -1
    "maxSize":
      type: Number
      default: Number.MAX_VALUE
    "side":
      type: String
      default: "right"
    "size":
      type: Number
      required: true

  computed:
    horizontal: ->
      return @side == "left" or @side == "right"
    plus: ->
      return @side == "right" or @side == "bottom"
    style: ->
      if @horizontal
        style =
          width: @extent+"px"
          height: "100%"
          top: "0"
          cursor: "ew-resize"
      else
        style =
          width: "100%"
          height: @extent+"px"
          left: "0"
          cursor: "ns-resize"
      style[@side]= -@offset+"px"
      return style

  methods:
    resetSize: (e) ->
      unless e.defaultPrevented
        e.preventDefault()
        if @defaultSize > -1
          oldSize = @size
          if @defaultSize < @minSize
            @size = @minSize
          else if @defaultSize > @maxSize
            @size = @maxSize
          else
            @size = @defaultSize
          @$emit "resize", @size, oldSize, @
          @$emit "reset-size"

    dragStart: (e) ->
      unless e.defaultPrevented
        e.preventDefault()
        @startSize = @size
        if @horizontal
          @startPos = e.clientX
        else
          @startPos = e.clientY
        if document.body.style.cursor?
          @oldCursor = document.body.style.cursor
        else
          @oldCursor = null
        document.body.style.cursor = @style.cursor
        @removeMoveListener = @onDocument("mousemove",@drag)
        @removeEndListener = @onceDocument("mouseup",@dragEnd)
        @$emit "resize-start", @size, @

    drag: (e) ->
      e.preventDefault()
      if @horizontal
        pos = e.clientX
      else
        pos = e.clientY
      moved = pos - @startPos
      unless @plus
        moved = -moved
      newSize = @startSize + moved
      if newSize < @minSize
        newSize = @minSize
      else if newSize > @maxSize
          newSize = @maxSize
      oldSize = @size
      @size = newSize
      @$emit "resize", @size, oldSize, @

    dragEnd: (e) ->
      e.preventDefault()
      document.body.style.cursor = @oldCursor
      @removeMoveListener?()
      @removeEndListener?()
      @$emit "resize-end", @size, @
      true

  watch:
    "minSize": (val) ->
      if @size < val
        @size = val
    "maxSize": (val) ->
      if @size > val
        @size = val
</script>
