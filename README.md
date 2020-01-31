# redo

This is a simple [Deno](https://deno.land) library for reading and writing 
to a [Redis](https://redis.io) database. 

The intention of this project is for me to learn about Deno and Redis. 
This library is by not suited for production use, in its current state.


## Documentation 
### Setup 
``` typescript
const redis = Redis(6379); //the port Redis is running on
```

### Key/Value 
``` typescript
// inserting value
await redis.set("Hello", "World"); 
// retrieving the value 
const value = await redis.get("Hello"); 

console.log(`Value is: ${value}`) // Value is Hello 
```
### Incrementing 
``` typescript
const value = await redis.set("age", 20); 
const incremented = await redis.increment("age");

console.log(`incremented value: ${incremented}`); // incremented value: 21
```
### Arrays 

``` typescript
const array = await redis.array("names"); 
await array.append("james"); 
await array.append("oliver"); 

const names = await array.get(); 
console.log(`names: ${names}`); //names: ["james", "oliver"]
```

