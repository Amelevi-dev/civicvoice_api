const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const dbConfig = require('./src/configs/db')
const User = require('./src/models/user.model')
const bcrypt = require('bcryptjs')

dotenv.config()

const app = express()

// ======================
// Middlewares
// ======================

app.use(cors({
   origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
   credentials: true
}))

app.use(morgan('dev'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
   extended: true
}))

app.use(fileUpload())

app.use(cookieParser())

// ======================
// Routes
// ======================

const authRoutes =
require('./src/routes/auth.routes')

const userRoutes =
require('./src/routes/user.routes')

const consultationRoutes =
require('./src/routes/consultation.routes')

const voteRoutes =
require('./src/routes/vote.routes')

const engagementRoutes =
require('./src/routes/engagement.routes')

const blockchainRoutes =
require('./src/routes/blockchain.routes')

app.use('/api/auth', authRoutes)

app.use('/api/users', userRoutes)

app.use('/api/consultations', consultationRoutes)

app.use('/api/votes', voteRoutes)

app.use('/api/engagements', engagementRoutes)

app.use('/api/blockchain', blockchainRoutes)

// ======================
// Test route
// ======================

app.get('/', (req, res) => {
   res.send('Welcome to CivicVoice API')
})

// ======================
// Server
// ======================

const PORT = process.env.PORT || 3005

const startServer = async () => {

   try {

      await dbConfig.dbConnect()

      // Seed Super Admin if not exists
      const adminExists = await User.findOne({ role: 'admin' });
      if (!adminExists) {
         const hashedPassword = bcrypt.hashSync('admin123', 12);
         await User.create({
            name: 'Super Administrateur',
            username: 'admin',
            password: hashedPassword,
            emailOrPhone: 'admin@civicvoice.ml',
            role: 'admin',
            sexe: 'n/A',
            age: '99',
            status: true,
            arrondissement: 'Commune I (Bamako)'
         });
         console.log('--- ADMIN INITIALIZED: admin / admin123 ---');
      }

      app.listen(PORT, () => {
         console.log(
            `Server running on port ${PORT}`
         )
      })

   } catch(error) {

      console.error(
         'Server failed to start:',
         error
      )

      process.exit(1)

   }
}


startServer()
app.use((err, req, res, next) => {

   console.error(err.stack)

   res.status(500).json({
      success: false,
      message: 'Erreur serveur'
   })

})