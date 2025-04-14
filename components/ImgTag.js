export default function ImgTag( content,  ){
return(
<div className=" grid w-[70%] md:w-full pb-2 grid-cols-2 ">
              <p className="text-left whitespace-nowrap italic text-black-500 text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/Princess_Mononoke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-black"
                >
                  From
                </a>
              </p>
              <p className="text-right whitespace-nowrap italic text-red-400 text-xs">
                <a
                  href="https://en.wikipedia.org/wiki/The_Pursuit_of_Happyness"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" hover:text-red-600"
                >
                  The Pursuit of Happyness
                </a>
              </p>
            </div>
);
}