<template lang="pug">
.container
  p works with CTRL key to keep aspect ratio
  a(href="https://github.com/vue-comps/vue-resize-handle/blob/master/dev/diagonal.vue") source
  .seDiv(v-bind:style="{width:style1.width+'px',height:style1.height+'px'}" v-el:div1)
    span(v-el:default1) drag me on the south east corner
    resizer(v-bind:size.sync="style1" v-ref:resize1 corner="se"
    v-bind:max-size="{width:200,height:200}" v-bind:min-size="{width:70,height:70}"
    v-bind:default-size="defaultSize1")
  .swDiv(v-bind:style="{height:style2.height+'px', width:style2.width+'px'}"  v-el:div2)
    span(v-el:default2) drag me on the south west corner
    resizer(v-bind:size.sync="style2" v-ref:resize2 corner="sw"
    v-bind:max-size="{width:200,height:200}" v-bind:min-size="{width:70,height:70}"
    v-bind:default-size="defaultSize2")
  .nwDiv(v-bind:style="{height:style3.height+'px', width:style3.width+'px'}"  v-el:div3)
    span(v-el:default3) drag me on the north west corner
    resizer(v-bind:size.sync="style3" v-ref:resize3 corner="nw"
    v-bind:max-size="{width:200,height:200}" v-bind:min-size="{width:70,height:70}"
    v-bind:default-size="defaultSize3")
  .neDiv(v-bind:style="{height:style4.height+'px', width:style4.width+'px'}"  v-el:div4)
    span(v-el:default4) drag me on the north east corner
    resizer(v-bind:size.sync="style4" v-ref:resize4 corner="ne"
    v-bind:max-size="{width:200,height:200}" v-bind:min-size="{width:70,height:70}"
    v-bind:default-size="defaultSize4")
</template>

<script lang="coffee">

module.exports =
  components:
    "resizer": require "../bidirectional.js"
  data: ->
    style1:
      width: 100
      height: 100
    defaultSize1: {height: 0, width: 0}
    style2:
      width: 100
      height: 100
    defaultSize2: {height: 0, width: 0}
    style3:
      width: 100
      height: 100
    defaultSize3: {height: 0, width: 0}
    style4:
      width: 100
      height: 100
    defaultSize4: {height: 0, width: 0}
  attached: ->
    @defaultSize1 =
      height: @$els.default1.offsetHeight
      width: @$els.default1.offsetWidth
    @defaultSize2 =
      height: @$els.default2.offsetHeight
      width: @$els.default2.offsetWidth
    @defaultSize3 =
      height: @$els.default3.offsetHeight
      width: @$els.default3.offsetWidth
    @defaultSize4 =
      height: @$els.default4.offsetHeight
      width: @$els.default4.offsetWidth
</script>

<style lang="stylus">
.nwDiv
  right 0
  bottom 0
.swDiv
  right 0
.neDiv
  bottom 0
.container > div
  border 1px solid black
  position absolute
.container
  width 450px
  height 450px
  position relative
.container > a
  position absolute
  line-height 450px
  text-align center
  left 0
  bottom 0
  top 0
  right 0
</style>
