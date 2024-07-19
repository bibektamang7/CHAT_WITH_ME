import dotenv from "dotenv"

dotenv.config({
  path: "./.env",
});



import {connectDB} from "./db/index"
import { server } from "./socket";


const port = process.env.PORT || 8080;
connectDB()
.then(() => {
    server.listen(port, () => {
      console.log(`Application is running at PORT ${port}`);
      
    })
  })
.catch((error) => {
    console.log(`Something went wrong on MONGODB`);
    
  })
