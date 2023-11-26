const http = require("http");
// const server = http.createServer();
// server.on("connection", (socket) => {
//   console.log("New connection");
// });
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.write("welcome to backend development");
    res.end();
  }

  if (req.url === "/api/courses") {
    res.write(
      JSON.stringify({
        id: 1,
        name: "cyril",
        email: "cycodedconcept@gmail.com",
        phone: "0802345455",
      })
    );
    res.end();
  }
});

server.listen(3000);
console.log("Listening on port 3000...");
