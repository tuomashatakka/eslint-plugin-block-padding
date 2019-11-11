[![pipeline status](https://gitlab.com/tuomashatakka/eslint-plugin-block-padding/badges/master/pipeline.svg)](https://gitlab.com/tuomashatakka/eslint-plugin-block-padding/commits/master)

# eslint-plugin-block-padding


Enforce a certain amount of blank lines before class &amp; function declarations.



## Usage

1. Install
2. Add plugin to config
3. ???
4. Profit
5. ???
6. Profit some more

### Detailed instructions

First of all, install this package as a dev dependency for your package; `npm i -D eslint-plugin-block-padding`. You should have eslint already installed.

Then, add the "block-padding" to your eslint configuration:

```json
{
  ...,
  "plugins": [ ..., "block-padding" ]
}
```



## Available rules

This plugin adds 7 rules for eslint:

 - block-padding/classes
 - block-padding/methods
 - block-padding/functions
 - block-padding/arrow-functions
 - block-padding/variables
 - block-padding/default-exports
 - block-padding/exports

These rules allow you to enforce a certain number of lines before a specific block in the code. 
For example, you may force every class declaration to have exactly two blank lines before them.
Or you could force all function blocks to be preceded with 0…2 blank lines.

All of the rules follow the same schema:

```json
[
  {
    "type": "number",
    "title": "Blank lines",
    "default": 1
  },
  {
    "type": "object",
    "title": "Options",
    "properties": {
      "strategy": {
        "enum": ["exact", "at-most", "at-least"],
        "default": "exact"
      }
    }
  }
]
```

Basically, the syntax is: `[ <number_of_required_lines_before_block_of_this_type> ]` 
OR with the strategy parameter specified: `[ <number_of_required_lines_before_block_of_this_type>, { strategy: exactly|at-least|at-most } ]`


### Author's recommendations

```
{
    'block-padding/classes':          [ 1 ],
    'block-padding/methods':          [ 1 ],
    'block-padding/functions':        [ 1 ],
    'block-padding/arrow-functions':  [ 1, 2, { strategy: 'at-most' }],
    'block-padding/variables':        [ 0 ],
    'block-padding/default-exports':  [ 0 ],
    'block-padding/exports':          [ 0 ],
}
```
