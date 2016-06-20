// out: ..
<template lang="pug">
.resize-handle(
  v-bind:style="style"
  style="position: absolute"
  @mousedown="dragStart"
  @dblclick="resetSize"
  v-bind:class="'resize-handle-'+corner"
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
      type: Object
      default: -> {height:0, width:0}
    "defaultSize":
      type: Object
      default: -> {height:-1, width:-1}
    "maxSize":
      type: Object
      default: -> {height:Number.MAX_VALUE, width:Number.MAX_VALUE}
    "keepRatio":
      type: Boolean
      default: false
    "corner":
      type: String
      default: "se"
    "size":
      type: Object
      required: true

  computed:
    direction: ->
      return {
        x: if @corner[1] == "e" then 1 else -1
        y: if @corner[0] == "n" then -1 else 1
      }

    style: ->
      style =
        cursor: "#{@corner}-resize"
        width: @extent+"px"
        height: @extent+"px"
      horz = if @direction.x == 1 then "right" else "left"
      vert = if @direction.y == 1 then "bottom" else "top"
      style[vert] = -@offset+"px"
      style[horz] = -@offset+"px"
      return style

  methods:
    resetSize: (e) ->
      unless e.defaultPrevented
        e.preventDefault()
        if @defaultSize? and (@defaultSize.height > -1 or @defaultSize.width > -1)
          newSize = {}
          if @defaultSize.height > -1
            newSize.height = @defaultSize.height
          else
            newSize.height = @size.height
          if @defaultSize.width > -1
            newSize.width = @defaultSize.width
          else
            newSize.width = @size.width
          newSize = @processMinMax(newSize)
          newSize = @processRatio(newSize) if @keepRatio
          oldSize =
            height: @size.height
            width: @size.width
          @size.height = newSize.height
          @size.width = newSize.width
          @$emit "resize", @size, oldSize, @
          @$emit "reset-size"

    dragStart: (e) ->
      unless e.defaultPrevented
        e.preventDefault()
        if e.ctrlKey and not @keepRatio
          @setRatio()
        @startSize =
          width: @size.width
          height: @size.height
        @dragging = true
        @startPos = x: e.clientX, y: e.clientY
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
      diff =
        x: (e.clientX - @startPos.x)*@direction.x
        y: (e.clientY - @startPos.y)*@direction.y
      newSize =
        width: @startSize.width + diff.x
        height: @startSize.height + diff.y
      if (e.ctrlKey or @keepRatio)
        if diff.y*@ratio > diff.x
          newSize.width = newSize.height * @ratio
        else
          newSize.height = newSize.width / @ratio
      newSize = @processMinMax(newSize)
      newSize = @processRatio(newSize) if (e.ctrlKey or @keepRatio)
      oldSize =
        height: @size.height
        width: @size.width
      @size.height = newSize.height
      @size.width = newSize.width
      @$emit "resize", @size, oldSize, @


    dragEnd: (e) ->
      e.preventDefault()
      document.body.style.cursor = @oldCursor
      @dragging = false
      @removeMoveListener?()
      @removeEndListener?()
      @$emit "resize-end", @size, @
      true

    setRatio: ->
      @ratio = @size.width / @size.height

    processMinMax: (size) ->
      if size.width < @minSize.width
        size.width = @minSize.width
      else if size.width > @maxSize.width
        size.width = @maxSize.width
      if size.height < @minSize.height
        size.height = @minSize.height
      else if size.height > @maxSize.height
        size.height = @maxSize.height
      return size

    processRatio: (size) ->
      if size.height == @maxSize.height && @ratio < 1
        size.width = size.height * @ratio
      else if size.width == @maxSize.width && @ratio > 1
        size.height = size.width / @ratio
      else if size.height == @minSize.height && @ratio > 1
        size.width = size.height * @ratio
      else if size.width == @minSize.width && @ratio < 1
        size.height = size.width / @ratio
      return size

    saveRatio: (e) ->
      if not @ratioSet and e.keyCode == 17 and @dragging and not @keepRatio
        @setRatio()
        @ratioSet = true

    releaseSaveRatio: (e) ->
      if e.keyCode == 17
        @ratioSet = false

  ready: ->
    @setRatio() if @keepRatio
    @removeKeydownListener = @onDocument("keydown",@saveRatio)
    @removeKeyupListener = @onDocument("keyup",@releaseSaveRatio)

  beforeDestroy: ->
    @removeKeydownListener?()
    @removeKeyupListener?()

  watch:
    "minSize.width": (val) ->
      if @size.width < val.width
        @size.width = val.width
    "minSize.height": (val) ->
      if @size.height < val.height
        @size.height = val.height
    "maxSize.width": (val) ->
      if @size.width > val.width
        @size.width = val.width
    "maxSize.height": (val) ->
      if @size.height > val.height
        @size.height = val.height
    "keepRatio": (val) ->
      @setRatio() if @val
</script>
