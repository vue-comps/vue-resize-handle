// out: ..
<template lang="jade">
.resize-handle(
  v-bind:style="style"
  @mousedown="dragStart | notPrevented | prevent"
  @dblclick="resetSize | notPrevented | prevent"
  v-bind:class="'resize-handle-'+side"
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
    "parentSize":
      type: Number
      required: true


  data: ->
    startPos: 0
    startSize: 0
    removeMoveListener: null
    removeEndListener: null
    horizontal: true
    plus: true
    oldCursor: null

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
      if @defaultSize > -1
        if @defaultSize < @minSize
          @parentSize = @minSize
        else if @defaultSize > @maxSize
          @parentSize = @maxSize
        else
          @parentSize = @defaultSize

    dragStart: (e) ->
      @startSize = @parentSize
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

    drag: (e) ->
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
      @parentSize = newSize
      e.preventDefault()

    dragEnd: (e) ->
      document.body.style.cursor = @oldCursor
      @removeMoveListener?()
      @removeEndListener?()
      e.preventDefault()
      true

    setStyle: ->
      @horizontal = @side == "left" or @side == "right"
      @plus = @side == "right" or @side == "bottom"
      @style.right = null
      @style.bottom = null
      if @horizontal
        @style.width = @size+"px"
        @style.height = "100%"
        @style.top = "0"
        @style.left = null
        @style.cursor = "ew-resize"
      else
        @style.width = "100%"
        @style.height = @size+"px"
        @style.top = null
        @style.left = "0"
        @style.cursor = "ns-resize"
      @style[@side]= -@offset+"px"


  compiled: -> @setStyle()


  watch:
    "minSize": (val) ->
      if @parentSize < val
        @parentSize = val
    "maxSize": (val) ->
      if @parentSize > val
        @parentSize = val
    "side": "setStyle"
    "size": "setStyle"
</script>
