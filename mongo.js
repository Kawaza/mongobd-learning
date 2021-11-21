const { MongoClient } = require('mongodb');


async function main () {
    const uri = "mongodb+srv://Kawaza:Hockey4747@cluster0.3xqm3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

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

// Insert One into Database (INSERT INTO movies VALUES (name, date, reviews)) ID is auto filled by mongodb and appears as __ID
async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingAndReviews").insertOne(newListing)

    console.log(`new listing = ${result.insertedId}`);
}

// Find One in the database, used as a specific search (NOT CLOSE MATCH) (Select name from movies where name = "USER INPUT")
async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({ name: nameOfListing });
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

// Grabs all from database just like (Select * from movies) in SQL Terms
async function grabAllListings(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").find({});

    console.log(result)
}

// List all the currect databases available (Select name from Databases) in SQL Terms
async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 
// List all the currect airbnb rooms with a query selection (Select * from airbnb where numberOfBedrooms > 'USER INPUT' AND numberOfBathrooms > 'USER INPUT ) in SQL Terms.
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
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

    // This is just ouput to make it look nice.
    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();
            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}