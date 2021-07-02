// a mini demonstration of Proxy's to freeze things, then add recursive freezing
// Proxy documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
const { quasiFrozenHandler } = require("./1-frozen")

// a sample object to experiment with
const person = {
  name: "kim",
  address: {
    state: "dc",
  }
}

const quasiDeepFrozenHandler = {

  // use the frozen setter to ignore changes to this object
  ...quasiFrozenHandler,

  // and add a getter that (recursively) applies quasiDeepFrozenHandler proxies to everything asked for
  get(target, prop, receiver){
    // get the thing we would have gotten 
    const got = target[prop];
    console.log(`<<get handler, looked up '${prop}', found ${JSON.stringify(got)}>>`)

    // now we will decide what really is returned off the object:

    //return got; // default behavior of an object
    //return "ok" // if we wanted to meddle we could

    // here comes the magic: we return what we would have returned, but first we wrap it in a quasiDeepFrozenHandler Proxy!
    return new Proxy(got, quasiDeepFrozenHandler);
  }
};

console.log(["proxy2 created as a new quasiDeepFrozen person"])
const proxy2 = new Proxy(person, quasiDeepFrozenHandler)
console.log({proxy2, person})
//=> { proxy2: { name: 'kim', address: { state: 'dc' } },
//=>   person: { name: 'kim', address: { state: 'dc' } } }

// DEEP FREEZE ALERT!
console.log("[proxy2.address.state = 'ri' blocked, because address is deeply frozen]")
proxy2.address.state = "ri"
//=> <<get handler, looked up 'address', found {"state":"dc"}>>
//=> <<Not setting 'state', frozen: {"state":"dc"}>>
// unlike quasiFreezeHandler, our frozen is recursive!
// get handler ran creating a frozen address, then the set handler ran on that new address 
console.log({proxy2})
//=> { proxy2: { name: 'kim', address: { state: 'dc' } } }
// so nothing changed!

// note that a Proxy'd 'complex' refers to the same object
console.log()
const origPersonAddress = person.address
const origProxy2Address = proxy2.address
//=> <<get handler, looked up 'address', found {"state":"dc"}>>
console.log("[person.address.state normal, as person isn't proxied/frozen]")
person.address.state = "nd"
console.log({proxy2, person})
//=> { proxy2: { name: 'kim', address: { state: 'nd' } },
//=>   person: { name: 'kim', address: { state: 'nd' } } }
// proxy affected as expected

console.log("[person.address = {country: 'ca'} normal, seen on proxy2 too]")
person.address = {country: "ca"}
console.log({proxy2, person, origProxy2Address})
//=> { proxy2: { name: 'kim', address: { country: 'ca' } },
//=>   person: { name: 'kim', address: { country: 'ca' } },
//=>   origProxy2Address: { state: 'nd' } }
// proxy affected as expected, but old proxy2.address remains pointing at old address

console.log("[origPersonAddress.state = 'md' normal, origProxy2Address still pointing to it]")
origPersonAddress.state = "md"
console.log({origProxy2Address})
// { origProxy2Address: { state: 'md' } }

console.log()
console.log("[proxy2.address.country = 'nz' blocked because still frozen]")
proxy2.address.country = "nz"
//=> <<get handler, looked up 'address', found {"country":"ca"}>>
//=> <<Not setting 'country', frozen: {"country":"ca"}>>
console.log({proxy2, person});
//=> { proxy2: { name: 'kim', address: { country: 'ca' } },
//=>   person: { name: 'kim', address: { country: 'ca' } } }

// exercise for the reader: what else could we return in our getter that would make the proxy2Address show the new address assigned in 'person.address = {country: "ca"}' above?