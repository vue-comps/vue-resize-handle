// out: ..
<template lang="jade">
.resize-handle(
  v-bind:style="style"
  @mousedown="dragStart | notPrevented | prevent"
  @dblclick="resetSize | notPrevented | prevent"
  v-bind:class="'resize-handle-'+corner"
  )
</template>

<script lang="coffee">
module.exports =
  filters:
    "notPrevented": require("vue-filters/notPrevented")
    "prevent": require("vue-filters/prevent")

  mixins:[
    require("vue-mixins/onDocument")
    require("vue-mixins/onceDocument")
  ]


  props:
    "offset":
      type: Number
      default: 0
    "size":
      type: Number
      default: 10
    "minSize":
      type: Object
      default: {height:0, width:0}
    "defaultSize":
      type: Object
      default: {height:-1, width:-1}
    "maxSize":
      type: Object
      default: {height:Number.MAX_VALUE, width:Number.MAX_VALUE}
    "keepRatio":
      type: Boolean
      default: false
    "corner":
      type: String
      default: "se"
    "parentSize":
      type: Object
      required: {height:0, width:0}


  data: ->
    oldCursor: null
    ratio: null
    ratioSet: false
    removeMoveListener: null
    removeEndListener: null
    removeKeydownListener: null
    removeKeyupListener: null
    dragging: false
    firstLimit: null

    startPos:
      x: 0
      y: 0

    startSize:
      width: 0
      height: 0

    direction:
      x: 1
      y: 1

    style:
      position: "absolute"
      width:null
      height:null
      top:null
      left:null
      right:null
      bottom:null
      cursor: "auto"


  methods:

    resetSize: (e) ->
      if @defaultSize? and (@defaultSize.height > -1 or @defaultSize.width > -1)
        newSize = {}
        if @defaultSize.height > -1
          newSize.height = @defaultSize.height
        else
          newSize.height = @parentSize.height
        if @defaultSize.width > -1
          newSize.width = @defaultSize.width
        else
          newSize.width = @parentSize.width
        newSize = @processMinMax(newSize)
        newSize = @processRatio(newSize) if @keepRatio
        @parentSize = newSize

    dragStart: (e) ->
      if e.ctrlKey and not @keepRatio
        @setRatio()
      @startSize.width = @parentSize.width
      @startSize.height = @parentSize.height
      @dragging = true
      @startPos = x: e.clientX, y: e.clientY
      if document.body.style.cursor?
        @oldCursor = document.body.style.cursor
      else
        @oldCursor = null
      document.body.style.cursor = @style.cursor
      @removeMoveListener = @onDocument("mousemove",@drag)
      @removeEndListener = @onceDocument("mouseup",@dragEnd)

    drag: (e) ->
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
      @parentSize = newSize
      e.preventDefault()

    dragEnd: (e) ->
      document.body.style.cursor = @oldCursor
      @dragging = false
      @removeMoveListener?()
      @removeEndListener?()
      e.preventDefault()
      true

    setCorner: ->
      @style.cursor = "#{@corner}-resize"
      if @corner[0] == "n"
        @direction.y = -1
        @style.top = -@offset+"px"
        @style.bottom = null
      else
        @direction.y = 1
        @style.top = null
        @style.bottom = -@offset+"px"
      if @corner[1] == "e"
        @direction.x = 1
        @style.left = null
        @style.right = -@offset+"px"
      else
        @direction.x = -1
        @style.left = -@offset+"px"
        @style.right = null

    setSize: ->
      @style.width = @size+"px"
      @style.height = @size+"px"

    setRatio: ->
      @ratio = @parentSize.width / @parentSize.height

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

  compiled: ->
    @setCorner()
    @setSize()
    @setRatio() if @keepRatio
    @resetSize()
    @removeKeydownListener = @onDocument("keydown",@saveRatio)
    @removeKeyupListener = @onDocument("keyup",@releaseSaveRatio)

  beforeDestroy: ->
    @removeKeydownListener?()
    @removeKeyupListener?()

  watch:
    "minSize.width": (val) ->
      if @parentSize.width < val.width
        @parentSize.width = val.width
    "minSize.height": (val) ->
      if @parentSize.height < val.height
        @parentSize.height = val.height
    "maxSize.width": (val) ->
      if @parentSize.width > val.width
        @parentSize.width = val.width
    "maxSize.height": (val) ->
      if @parentSize.height > val.height
        @parentSize.height = val.height
    "corner": "setCorner"
    "size": "setSize"
    "keepRatio": (val) ->
      @setRatio() if @val
</script>
