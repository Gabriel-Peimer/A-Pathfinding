const express = require('express');
const app = express();

// Port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('views'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
