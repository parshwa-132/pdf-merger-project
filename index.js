const express = require('express')
const path = require('path')
const app = express()
const multer  = require('multer')
const bcrypt = require('bcrypt')
const {mergePdfs}  = require('./merge')
require('./db')
const User = require('./models/User')
const upload = multer({ dest: 'uploads/' })
app.use('/static', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public","login.html"))
})


app.post ('/login' , async (req,res) => {
    try {

        //find user data has existed already or not
        const { name, email, password } = req.body

        console.log(name, email, password)
        let user;
         user = await User.findOne({ email});

         console.log('user: ', user)

         if(!user){
            console.log('cannot find user')
            return res.status(400).redirect('/')
         }


         console.log('user password: ', user.password)

        //check password
        const match = await bcrypt.compare(password, user.password);

        if(!match) {
            //login

            return res.status(401).json({ message: 'Please Enter Correct Password '})
        }
        

        return res.status(200).redirect('/home')

        //redirect to home page
        
    } catch (error) {
        console.log('Error ocuure in login api')
    }
})
 

app.post('/merge', upload.array('pdfs', 2), async (req, res, next)=> {
  console.log(req.files)
  let d = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))
  res.redirect(`/home` )
  // res.send({data: req.files})
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

app.get('/register' , (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'public','register.html'))
    } catch (error) {
        console.log(error)
    }
})

app.get('/home', (req, res) => {
    return res.sendFile(path.join(__dirname, 'templates', 'index.html'))
})

app.post('/signup', async (req, res) => {
    try {
        //req.body
        const { name , email, password} = req.body

        let existedUser = await User.findOne({
            email
        })
        if(existedUser){
            return res.status(400).json({message: ' User already exist..please login instead'})
        }

        const hasedPassword = bcrypt.hashSync(password, 10)
        const user = new User({
            name,
            password: hasedPassword,
            email

        })

        console.log('user Data : ', user)

        await user.save()

        return res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})