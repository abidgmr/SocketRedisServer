import publish from "../../redis/publisher";

const message = async () => {
  try {
    const response = await publish("message", Math.random().toString());
    console.log("response", response);
  } catch (error) {
    console.error("Error:", error);
  }
};

const group = async () => {
  try {
    const response = await publish("group", Math.random().toString());
    console.log("response", response);
  } catch (error) {
    console.error("Error:", error);
  }
};

setInterval(()=>{
  group();
}, 8000)


setTimeout(()=>{
  
message();
}, 10000)