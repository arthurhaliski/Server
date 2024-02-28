const { buildClientSchema, getIntrospectionQuery, printSchema } = require('graphql');
const axios = require('axios');
const fs = require('fs'); // Require the file system module

const ENDPOINT_URL = "https://api.crm.refine.dev/graphql";

(async () => {
    const res = await axios.post(ENDPOINT_URL, { query: getIntrospectionQuery() });
    const schema = buildClientSchema(res.data.data);
    const sdl = printSchema(schema);

    // Save the SDL string to a .graphql file
    fs.writeFile('schema.graphql', sdl, (err) => {
        if (err) {
            console.error('Error saving the schema to a file:', err);
        } else {
            console.log('Schema successfully saved to schema.graphql');
        }
    });
})();
