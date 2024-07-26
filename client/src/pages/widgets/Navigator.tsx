import React from "react";
import { Link } from "react-router-dom";
import MyImage from "../../assets/cropped-IMG_5624_2.jpg";

//navigation icons
import { FaRegUserCircle } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";


//theme
import { FaMoon } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";


// setting
import { CiSettings } from "react-icons/ci";

const navigationIcon = [
  {
    icon: FaRegUserCircle,
    to: "user"
  },
  {
    icon: LuMessagesSquare,
    to: "message",
  }
]

const Navigator = () => {
  return (
    <div className="md:block md:w-[4%] h-full bg-slate-700 hidden">
      <div className="w-full h-full px-2 py-4 flex flex-col justify-between items-center">
        
        <div className="flex gap-4 flex-col">
          {
            navigationIcon.map((List, index) => (
              <div key={index}>
                <Link to={List.to}>
                  <List.icon size={`1.6rem`} color="A8A8A8"/>
                </Link>
              </div>
            ))
          }
        </div>
        <div className="botton">
          <Link to={`setting`}>
            <CiSettings size={`1.6rem`} color="A8A8A8"/>
          </Link>
          {/* <Avatar>
            <AvatarImage src={MyImage} />
          </Avatar> */}

        </div>
      </div>
    </div>
  );
}

export { Navigator };
