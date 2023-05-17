const express = require("express");
const path = require('path')
const multer=require('multer')
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const {User} = require('./models')
const{Product}=require('./models')
const cors= require('cors')
const {createTokens,validateToken} = require('./jwt')
const port = 2000;
const bcrypt = require("bcrypt");

var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

// multer image 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb){
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage }) 

    //  user api end point is here
app.post("/register", (req, res) => {
  const { password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hash,
    })
  
      .then(() => {
        res.json("user Registration");
      })
      .catch((err) => {
        if (err) {
          res.status(400).json({ error: err });
        }
      });
  });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
// console.log(email)
const{sign, verify} =require('jsonwebtoken')

const createTokens = (user)=>{
    const accessToken = sign({name : user.name, id: user.id},"hcgygegdygyudfusdghfyy")


    return accessToken
}

const validateToken = (req,res,next)=>{

    const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    try{
    const decode = verify(token, 'hcgygegdygyudfusdghfyy')
    }
    catch{
        return res.send({
            result: "token is not valide",
          });
    }
    next()
    
  } 
  else {
    res.send({
      result: "token is not valide",
    });
  }
}


module.exports ={createTokens, validateToken}
  const user = await User.findOne({ where: {email: email } });

  if (!user) {
    res.status(200).json({ error: "user dosen't exist" });
    return;
  }

  const passwords = user.password;
  bcrypt.compare(password, passwords).then((match) => {
    if (!match) {
      res.status(200).json({ error: "wrong password combination!" });
      return;
    } else {
      const accessToken = createTokens(user);
      res.send({ message: "success", accessToken: accessToken,loginuser:user });
      return;
    }
  });
});
app.get('/get/:id',async(req,res)=>{
  const getuserbyid= req.params.id
  const userdetail = await User.findByPk(getuserbyid);
          res.json({userdetail})
})

    app.get('/show',async(req,res)=>{
        const alldata = await User.findAll()
        res.json(alldata)
    })
    app.put('/Update/:id',async(req,res)=>{
        const id = req.params.id
        const {firstName,lastName,email} =req.body
        await edit.update({firstName,lastName,email})
         res.send(edit)
        const edit = await User.findByPk(id)
        if(!edit){
            return res.status(404).send('user not found')
        }
        })

        // product end point is here

        app.post('/add',upload.single('image'),async(req ,res)=>{
          // console.log("--body--"+req.body.Name);
          // console.log("--File--"+req.file);
             const Name = req.body.Name;
             const image = req.file.filename;
             const prices = req.body.prices;
             const des = req.body.des;
             const savedetail = Product.build({
              Name,
              image,
              prices,
              des
             })
             await savedetail.save();
             res.send("Product is add successful")
            
        })
        app.get('/view',async(req,res)=>{
          const allproduct = await Product.findAll();
          res.json({"product":allproduct})

        })
        app.get('/view/:id', async(req,res)=>{
          const id = req.params.id
          const allproid = await Product.findByPk(id);
          res.json({allproid})

        })
        app.delete('/delete/:id',async(req,res)=>{
          const productid = req.params.id
          const deleteid = await Product.findByPk(productid);
          await deleteid.destroy()
          
          res.json(`Product with id ${productid} deleted`);
        })
        // app.put('/updatepr/:id',async(req,res)=>{
        //    const id = req.params.id;
        //   const {Name,image,prices,des} =req.body;
        //   try{
        //     const edit = await Product.findByPk(id)
        //     if(!edit){
        //       return res.status(404).send("product not found")
        //     }
        //   }
        
        //  await edit.update({Name,image,prices,des })
        //   res.send(edit)
     
        //   if(!edit){
        //     return res.status(200).send('Product not found')
        //   }

        //  })
        app.put('/updatepr/:id', async (req, res) => {
          const id = req.params.id;
          const { Name, image, prices, des } = req.body;
          
          try {
            const product = await Product.findByPk(id);
            if (!product) {
              return res.status(404).send('Product not found');
            }
            
            product.Name = Name;
            product.image = image;
            product.prices = prices;
            product.des= des;
            
            await product.save();
            
            res.send(product);
          } catch (error) {
            console.error('Error updating product', error);
            res.status(500).send('Internal server error');
          }
        });
        // cart api end point is here
   

    


        

    const {sequelize} = require('./models')
    sequelize.sync({ alter:true }).then(()=>{console.log("database re-synced")})

app.listen(port, () => {
  console.log(`server starting at http://localhost:${port}`);
});
