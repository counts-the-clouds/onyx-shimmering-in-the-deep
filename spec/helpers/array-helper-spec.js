describe("Array Helper", function() {

  describe("differenceInElements()", function() {
    it("when identical", function() {
      const diff = ArrayHelper.differenceInElements([1,2,3],[1,2,3]);
      expect(diff.removed.length).to.equal(0);
      expect(diff.added.length).to.equal(0);
    });

    it("when different", function() {
      const diff = ArrayHelper.differenceInElements([1,2,3,4],[3,4,5,6]);
      expect(diff.removed).to.have.members([1,2]);
      expect(diff.added).to.have.members([5,6]);
    });
  });

});