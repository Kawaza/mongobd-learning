# Mongodb-Learning
Over the last 2 days I decided to start learning mongodb as somthing to add to my resume. Below is what I learned.
## Mongodb Notes and Takeaways
mongodb is a no SQL database and uses the cloud platforms like (aws / azure) to keep your data secure and can simply be accessed via a URI code and password in order to extract data
from your database. Overall the program is quiet simple although can really get indepth if you want it to and instead of SQL making a database is as easy as drag and drop and 
extracting info from the database you can just use JS language to grab it. 

However actually outputting this info to a user and receieving info requires the use of Node.js or PHP or some other server language paired with Express which is a whole other beast
I will have to tackle one day to actually get it fully running. So the code used for this can output it into the server console or the mongodb console but currently thats about it.

Once I figure out express I could simply just take the info from the querys and kinda toss it into HTML. 

## Basics
This for assuming you have already made a database at [Mongodb](https://www.mongodb.com/) and added some sample data to grab from. You can follow this [Tutorial](https://www.youtube.com/watch?v=HO7-B20irWU) video
for basic setup. 

Start by installing [Node.js](https://nodejs.org/en/) and then opening up a new node enviorment.
```npm
  npm init
```
```npm
  npm install mongodb
```
Now start by creating a file called mongo.js and lets start by making this our logic file for all our mongo.js.
```js
  const { MongoClient } = require('mongodb');
```
Now lets make the basics of the mongodb app, this base function will grab our uri and esatablish our connection with our mongodb database as well as do all our calls.
```js
async function main () {
    const uri = "mongodb+srv://[USERNAME]:[PASSWORD]@cluster0.3xqm3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db("sample_mflix");
        const movies = database.collection("movies");
        
        // query for movies that have a runtime less than 15 minutes
        const query = { runtime: { $lt: 15 } };
        const options = {
          // sort returned documents in ascending order by title (A->Z)
          sort: { title: 1 },
          // Include only the `title` and `imdb` fields in each returned document
          projection: { _id: 0, title: 1, imdb: 1 },
        };
        
        const cursor = movies.find(query, options).map( function(p) {return p.title});
        // print a message if no documents were found
        if ((await cursor.count()) === 0) {
          console.log("No documents found!");
        }
        // console.log all titles from movies database
        await cursor.forEach(console.log);

      } finally {
        await client.close();
      }
    }


main().catch(console.error);
```
Now that is a lot so will quickly explain it, This connects the database and we can set up some constants so we can use them later for easy coding. We set up a query parameter that will return
movies with less then 15 minutes and a options list just to organize the date so it displayes it nicely in the console.log.

Then we query it throwing in "Query" and "options" and use the JS function to map it and return with just the title. This gets rid of all the fluff so we can just have the title.

Then we check if it returns more then 0 movies, and if it does we output the information to the console. <3

## Other Functions
Below are a lot of other functions we can use and call just like any ordinary javascript function to query diffrent information.

This one below will Insert One into Database (ID is auto filled by mongodb and appears as __ID).
```sql
# This is SQL
(INSERT INTO movies VALUES (name, date, reviews)) 
```

```js
/* This is using mongodb */
async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingAndReviews").insertOne(newListing)
}
```

This one will Find One in the database, this is used as a specific search and not a close match.
```sql
# This is SQL
(Select name from movies where name = "USER INPUT")
```
```js
/* This is using mongodb */
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });
}
```

This one grabs all the values from database.
```sql
# This is SQL
(Select * from movies)
```
```js
/* This is using mongodb */
async function grabAllListings(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").find({});
}
```

This one is the more advanced one and will allow us to add diffrent where clauses.
```sql
# This is SQL
(Select * from airbnb where numberOfBedrooms > 'USER INPUT' AND numberOfBathrooms > 'USER INPUT' )
```
```js
/* This is using mongodb */
async function findListingsWithWhereClause(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = client.db("sample_airbnb").collection("listingsAndReviews").find(
                            {
                                bedrooms: { $gte: minimumNumberOfBedrooms },
                                bathrooms: { $gte: minimumNumberOfBathrooms }
                            }
                            ).sort({ last_review: -1 })
                            .limit(maximumNumberOfResults);
    const results = await cursor.toArray();
}
```

Thanks for reading. :D




