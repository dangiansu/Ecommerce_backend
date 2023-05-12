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