<template lang="jade">
.container
  a(href="https://github.com/vue-comps/vue-resize-handle/blob/master/dev/basic.vue") source
  .rightHandleDiv(v-bind:style="{height:style1.height+'px', width:style1.width+'px'}" v-el:div1)
    span(v-el:content1) drag me on the right
    resizer(v-bind:parent-size.sync="style1.width" v-ref:resize1
    v-bind:max-size="200" v-bind:min-size="80" v-bind:content-size="contentWidth1")
  .leftHandleDiv(v-bind:style="{height:style2.height+'px', width:style2.width+'px'}"  v-el:div2)
    span(v-el:content2) drag me on the left
    resizer(v-bind:parent-size.sync="style2.width" side="left" v-ref:resize2
    v-bind:max-size="200" v-bind:min-size="80" v-bind:content-size="contentWidth2")
  .topHandleDiv(v-bind:style="{height:style3.height+'px', width:style3.width+'px'}"  v-el:div3)
    span(v-el:content3) drag me on the top
    resizer(v-bind:parent-size.sync="style3.height" side="top" v-ref:resize3
    v-bind:max-size="200" v-bind:min-size="50" v-bind:content-size="contentHeight3")
  .bottomHandleDiv(v-bind:style="{height:style4.height+'px', width:style4.width+'px'}"  v-el:div4)
    span(v-el:content4) drag me on the bottom
    resizer(v-bind:parent-size.sync="style4.height" side="bottom" v-ref:resize4
    v-bind:max-size="200" v-bind:min-size="50" v-bind:content-size="contentHeight4")
</template>

<script lang="coffee">
module.exports =
  components:
    "resizer": require "../unidirectional.js"
  data: ->
    style1:
      width: 100
      height: 40
    contentWidth1: 0
    style2:
      width: 100
      height: 40
    contentWidth2: 0
    style3:
      width: 100
      height: 100
    contentHeight3: 0
    style4:
      width: 100
      height: 100
    contentHeight4: 0
  attached: ->
    @contentWidth1 = @$els.content1.offsetWidth
    @contentWidth2 = @$els.content2.offsetWidth
    @contentHeight3 = @$els.content3.offsetHeight
    @contentHeight4 = @$els.content4.offsetHeight
</script>

<style lang="stylus">
.leftHandleDiv
  right 0
  bottom 0
.bottomHandleDiv
  right 0
.topHandleDiv
  bottom 0
.container > div
  border 1px solid black
  position absolute
.container
  width 350px
  height 350px
  position relative
.container > a
  position absolute
  line-height 350px
  text-align center
  left 0
  bottom 0
  top 0
  right 0
</style>
