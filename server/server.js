import express from 'express'
import jwt from 'jsonwebtoken'
import cors from 'cors'

const app = express();
const PORT = 3100;
const secretKey = 'yourSecretKey'; // Replace with a strong, unique secret

app.use(express.json());
app.use(cors())

// Sample user data (in-memory for illustration purposes)
const users = [
  { id: 1, username: 'donald', password: '1234' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Endpoint for user authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find the user based on the provided username and password (in a real app, this would involve database queries)
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Generate a JWT token
    const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '2days' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Protected route example
app.get('/api/data', authenticateToken,(req,res) => {
  if(req.user){ console.log(`user assigned to req: ${JSON.stringify(req.user)}`);}
  res.json({ data: 'This is protected data! => I got an unicorn' })
})

// Middleware is created for more than one protected routes needed to authentication
function authenticateToken(req, res, next){
  console.log(req);
  const token = req.headers.authorization
  console.log(`token received => ${token}`);
  if (!token){ return res.sendStatus(401)}
  jwt.verify(token, secretKey, (err, decode) => {
    if (err){
      return res.sendStatus(403)
    }else{
      console.log(`user: ${JSON.stringify(decode)}`);
      req.user = decode
      next()
    }
  })
}


app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

