import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import MyImage from "../../assets/cropped-IMG_5624_2.jpg";

const Navigator = () => {
  return (
    <div className="w-[5%] bg-green-600">
      <Avatar>
        <AvatarImage src={MyImage} />
      </Avatar>
    </div>
  );
}

export { Navigator };
