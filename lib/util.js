var Util = {

  bounds: function(pos) {
    var left = this.pos[0];
    var right = this.pos[0] + this.dim[0];
    var top = this.pos[1];
    var bottom = this.pos[1] + this.dim[1];

    return [left, right, top, bottom];
  },

  dim: function (rowPos) {
    if (rowPos === 400 || rowPos === 150) {
      return [100, 40];
    } else if (rowPos === 100) {
      return [175, 40];
    } else if (rowPos === 200) {
      return [225, 40];
    } else if (rowPos === 250) {
      return [125, 40];
    } else if (rowPos === 300) {
      return [150, 40];
    } else {
      return [50, 40];
    }
  },

  dist: function (pos1, dim1, pos2, dim2) {
    var center1 = [pos1[0] + (dim1[0] / 2), pos1[1] + (dim1[1] / 2)];
    var center2 = [pos2[0] + (dim2[0] / 2), pos2[1] + (dim2[1] / 2)];

    var centerDist = Math.sqrt(
      Math.pow(center2[0] - center1[0], 2) + Math.pow(center2[1] - center1[1], 2)
    );

    return centerDist;
  },

  inherits: function (ChildClass, ParentClass) {
    function Surrogate () {};
    Surrogate.prototype = ParentClass.prototype;
    ChildClass.prototype = new Surrogate();
  },

  rowVec: function (xDir, speed) {
    var velDefault = 1;

    return Util.scale([velDefault * xDir, 0], speed);
  },

  scale: function (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },


};

module.exports = Util;
