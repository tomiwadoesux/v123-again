import { NormalText } from "components/NormalText";
import { Author } from "components/Author";

export default function Section99() {
  return (
    <section className="pt-3 pb-3">
      <div className="flex flex-col  justify-between md:flex-row">
        <div className="flex flex-row gap-2">
        
        
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1 className="text-xl lg:text-3xl text-left">H1 baby</h1>
            <div>
              <NormalText
                content="     No screams, my ears thinking.. No screams, my hands thinking..There's a tone so
                        organized, how ryhtimic..The long beard man vowed to labour who knows once told me..Beware, 
                        we have loads to lift and hard work to"
                color="black"
              />{" "}
              <Author author="Ayotomcs" color="red" />
            </div>
          </div>
          <div className="w-fit">
            <svg
              width="10"
              height="100%"
              viewBox="0 0 10 50"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none" 
            >
              <line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1 className="text-xl lg:text-3xl text-left">H1 baby</h1>
            <div>
              <NormalText
                content="     No screams, my ears thinking.. No screams, my hands thinking..There's a tone so
                        organized, how ryhtimic..The long beard man vowed to labour who knows once told me..Beware, 
                        we have loads to lift and hard work to"
                color="black"
              />{" "}
              <Author author="Ayotomcs" color="red" />
            </div>
          </div>
          <div className="w-fit">
            <svg
              width="10"
              height="100%"
              viewBox="0 0 10 50"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <line
                x1="0.5"
                y1="0"
                x2="0.5"
                y2="100"
                stroke="black"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1 className="text-xl lg:text-3xl text-left">HHe Jlofus Ahdn</h1>
            <div>
              <NormalText
                content="    
                   No screams, my ears thinking.. No screams, my hands thinking..There's a tone so
                        organized, how ryhtimic..The long beard man vowed to labour who knows once told me..Beware, 
                        we have loads to lift and hard work to"
                color="black"
              />{" "}
              <Author author="Ayotomcs" color="red" />
            </div>
          </div>
         
        </div>
        {/* <div className="flex justify-between w-[50%]  flex-row">
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1>H1 baby</h1>
          </div>
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1>H1 baby</h1>
          </div>
        </div> */}

        {/* <div className="flex justify-between w-[50%] flex-row">
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1>H1 baby</h1>
          </div>
          <div className="flex-col">
            <div className="bg-black h-44"></div>
            <h1>H1 baby</h1>
          </div>
        </div> */}
      </div>
    </section>
  );
}
