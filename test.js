const { rules }   = require(".")
const RuleTester  = require("eslint").RuleTester

const ruler       = new RuleTester()

ruler.run("block-padding/classes", rules.classes, {
  valid: [ 
    {
      code: `
      var x;
      
      class X {}
      `,
      options:  [ 1, { strategy: 'exact' }],
      parserOptions: { ecmaVersion: 7 }
    },
  ],
  invalid: [ 
    {
      code: `
      var x;
      class X {}


      class Y {}
      `,
      options:  [ 1, { strategy: 'exact' }],
      parserOptions: { ecmaVersion: 7 },
      errors: [
        { message: "Too few blank lines before the block. Expected 1, got 0." },
        { message: "Too many blank lines before the block. Expected 1, got 2." },
      ]
    },
  ],
})
