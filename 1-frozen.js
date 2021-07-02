// a mini demonstration of Proxy's to freeze things, then add recursive freezing
// Proxy documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

// a sample object to experiment with
const person = {
  name: "kim",
  address: {
    state: "dc",
  }
}

const quasiFrozenHandler = {
  set(target, prop, value) {
    console.log(`<<Not setting '${prop}', frozen: ${JSON.stringify(target)}>>`)
    return true
  }
}

console.log("[create a quasiFrozen proxy1]")
//=> ["creates a quasiFrozen proxy1"]
// the above introduces the //=> nomenclature: a comment showing expected output
// we will only use this for non-obvious/non-static console.log()'s from this point on

const proxy1 = new Proxy(person, quasiFrozenHandler)
console.log({proxy1, person})
//=> { proxy1: { name: 'kim', address: { state: 'dc' } },
//=>   person: { name: 'kim', address: { state: 'dc' } } }

// THIS IS IT! We are frozen!
console.log("[failing proxy1.name = 'kimberly' on frozen proxy1]")
proxy1.name = "kimberly";
//=> <<Not setting 'name', frozen: {"name":"kim","address":{"state":"dc"}}>>
// wow did you see that! quasiFrozenHandler's set handler just ran!
console.log({proxy1})
//=> { proxy1: { name: 'kim', address: { state: 'dc' } } }

console.log("[successful person.name = 'kimmy' showing person not frozen (also reflects on proxy1)]");
person.name = "kimmy";
console.log({proxy1, person})
//=> { proxy1: { name: 'kimmy', address: { state: 'dc' } },
//=>   person: { name: 'kimmy', address: { state: 'dc' } } }

console.log("[successful proxy1.address.state = 'ky' showing address is not deeply frozen]")
proxy1.address.state = "ky"
console.log({proxy1, person})
//=> { proxy1: { name: 'kimmy', address: { state: 'ky' } },
//=>   person: { name: 'kimmy', address: { state: 'ky' } } }

module.exports.quasiFrozenHandler = quasiFrozenHandler