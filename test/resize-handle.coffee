env = null
resizers =[]
divs = []
side = ["right","left","top","bottom"]
describe "resize-handle", ->


  describe "basic env", ->

    before ->
      env = loadComp(require("../dev/basic.vue"))
      for i in [1..4]
        resizers.push env.$refs["resize"+i]
        divs.push env.$els["div"+i]
    after ->
      unloadComp(env)

    it "should render clusterize", ->
      resizers.length.should.equal 4
      for i in [0..3]
        divs[i].should.contain "div.resize-handle"

    it "should have right classes", ->
      for i in [0..3]
        divs[i].should.contain "div.resize-handle-#{side[i]}"
