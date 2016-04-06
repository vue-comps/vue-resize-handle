# vue-resize-handle

When you want to able to resize an element uni- or bidirectional, you need a resize-handle.

### [See it in action](https://vue-comps.github.io/vue-resize-handle)


# Install

```sh
npm install --save-dev vue-resize-handle
```
or include `build/bundle.js`

## Usage
```coffee
# link the components up
components:
  "resizer": require "vue-resize-handle/unidirectional"
  # or:
  "resizer": require "vue-resize-handle/bidirectional"

# when using the bundle
components:
  "resizer": window.vueComps.resizeHandle.uni
  # or:
  "resizer": window.vueComps.resizeHandle.bi

data: ->
  width: 200
  # or:
  style:
    width: 200
    height: 200
```
```jade
# in the template
.elementToResize(v-bind:style="{width:width+'px'}")
  resizer(v-bind:parent-size.sync="width")
# or
.elementToResize(v-bind:style="style")
  resizer(v-bind:parent-size.sync="style")
```
see `dev/` folder for more examples

#### Props
##### Both
| Name | type | default | description |
| ---:| --- | ---| --- |
| offset | Number | 0 | how far the handle overlaps the parent |
| size | Number | 10 | size of the handle in px |
##### Unidirectional
| Name | type | default | description |
| ---:| --- | ---| --- |
| minSize | Number | 0 | minimal size of the parent |
| defaultSize | Number | -1 | default size of the parent (will be set if dblclick on handle) |
| maxSize | Number | Number.MAX_VALUE | maximal size of the parent |
| side | String | "right" | one of "top","right","bottom","left" |
| parentSize | Number | - | will be updated on resize |
##### Bidirectional
| Name | type | default | description |
| ---:| --- | ---| --- |
| minSize | Object | {height:0, width:0} | minimal size of the parent |
| defaultSize | Object | {height:-1, width:-1}| default size of the parent (will be set if dblclick on handle) |
| maxSize | Object | {height:Number.MAX_VALUE, width:Number.MAX_VALUE} | maximal size of the parent |
| keepRatio | Boolean | false | enforce aspect ratio |
| corner | String | "se" | one of "se","sw","ne","nw" (cardinal points) |
| parentSize | Object | {height:0, width:0} | will be updated on resize |


# Development
Clone repository
```sh
npm install
npm run dev
```
Browse to `http://localhost:8080/`

## License
Copyright (c) 2016 Paul Pflugradt
Licensed under the MIT license.
