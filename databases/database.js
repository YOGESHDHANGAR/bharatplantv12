import mongoose from "mongoose";

const connectDatabase = () => {
  mongoose
    .connect("mongodb://0.0.0.0:27017/bharatplantv1", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    })
    .catch((e) => {
      console.log(e);
    });
};

export default connectDatabase;
