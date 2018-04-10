
const schema = [

  {
    type: "number",
    title: "Blank lines",
    default: 1,
  },

  {
    type: "object",
    title: "Options",
    properties: {
      strategy: {
        enum:  [ "exact", "at-most", "at-least" ],
        default: "exact",
      }
    }
  },

]

module.exports = {
  schema,
  fixable: false,
}
