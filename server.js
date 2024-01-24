import bodyParser from "body-parser";
import express from "express";
import { Sequelize, Op  } from "sequelize";
import defineUserModel from "./Models/User.js";
import { constants } from "./config.js";
const sequelize = new Sequelize(constants.development);
const User = defineUserModel(sequelize);
sequelize
  .authenticate()
  .then(async () => {
    console.log("PostgreSQL connection established");
    await sequelize.sync();
  })
  .then(() => {
    console.log("Model defined");
  })
  .catch((err) => {
    console.error("Following error occured: ", err);
  });
const app = express();
const port = constants.development.PORT || 3000;
app.use(bodyParser.json());
app.get("/", (req, res) => {
  (async () => {
    await sequelize.sync();
    return User.findAll({ raw: true });
  })().then((allUsers) => {
    res.send(allUsers);
  });
});
app.listen(port, () => console.log(`Server Started at ${port}`));
app.post("/identify", (req, res) => {
  let primaryID=0,emails=[],phoneNumbers=[],secondaryContactIDs=[];
  const data = req.body;
  sequelize.sync()
  .then(() => {
    console.log('User model synced with the PostgreSQL database.');
    return (User.findOne( {where:{[Op.or]: [
      {email:data.email},
      {phoneNumber:data.phoneNumber},
    ]}
  }));
  
})
  .then((foundUser) => {
    
    if (foundUser) {
      function creation(){
        return User.create(data);
      }
      creation()
      .then((result)=>{console.log(result)
        sequelize.query('UPDATE "Users" SET "linkedId" = ?, "linkPrecedence" = ? WHERE "email" = ? AND "phoneNumber" = ?',{
          type:sequelize.QueryTypes.UPDATE,
          replacements:[foundUser.id,"secondary",data.email,data.phoneNumber]
         })
       .then(result => {
        res.send("done");
        console.log('Updated query result:', result);
       }
        )
       .catch(error => {
        console.error('Error executing UPDATE query:', error);
      });})

      // .then((User)=>{
      //   User.set({
      //     linkedId:foundUser.id,
      //     linkPrecedence:"secondary"
      //   })
      // })
      console.log('User found:', foundUser);
      primaryID=foundUser.id;
    } else {
      function creation(){
        return User.create(data);
      }
      creation()
      .then((check)=>{
        emails.push(check.email);
        phoneNumbers.push(check.phoneNumber);
        secondaryContactIDs.push(check.linkedId);
        res.send({contact:{
          "primaryContactId":check.id,
          "emails":emails,
          "phoneNumbers":phoneNumbers,
          "secondaryContactIds":secondaryContactIDs
        }});
      });
     
    }
  })
  .catch((err) => {
    console.error('Error syncing User model:', err);
  });
  
});
