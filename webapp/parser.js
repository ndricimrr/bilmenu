const parseAndWriteToJSON = require("./meal-parser-node-icerik");

// False signifies this is weekly cron job to be run on Monday only
parseAndWriteToJSON(false);
