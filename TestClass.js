
import asd from './spec/inline-functions'

function decor (a) {
  return a
}

@decor @decor export class TestClass {

  constructor () {

  }
}

class TestClasscx { }

export default class TestClassTwo {

}

// lol

class TestClassThree {

}

export function asd () {}

export const xd = function basd () {}

const arr = []

arr.map(() => {})

const xds = () => {
  let asd = 2
  return asd
}


if (1 === 2) {
  xds("KSD")
}

module.exports.asde = function () {}
