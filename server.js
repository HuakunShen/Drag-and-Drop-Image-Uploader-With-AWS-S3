const express = require('express');

const app = express();
const PORT = process.env.PROT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port $`);
});
