import bodyParser from "body-parser";
import express from "express";
import { Sequelize } from "sequelize";
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
  // const jane = User.build({ phoneNumber: "985368523",email:"sab@gmail.com" });
  // await jane.save()})
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
  res.send(`Server Started at Port: ${port}`);
});
app.listen(port, () => console.log(`Server Started at ${port}`));

app.post("/identify", (req, res) => {
  const data = req.body;
  (async () => {
    await sequelize.sync();
    const incomingUser = await User.create(data);
    const existingUser = User.findOne({where:{phoneNumber:data.phoneNumber}})||User.findOne({where:{email:data.email}})
    .then((existingUser) => {
        if (existingUser) {
            incomingUser.set({
                linkPrecedence:"secondary",
                linkedId:existingUser.id
            })
            incomingUser.save();
        } else {
            console.log("newUser Created Succesfully");
        }
      })
  })(); 
  res.status(200).json({ message: "Data received successfully" });
});
