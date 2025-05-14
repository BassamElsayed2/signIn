import Link from "next/link";

const Card = (props) => {
  return (
    <Link
      href={`/admin/${props.link}`}
      className="group relative block w-0 h-64 sm:h-80 lg:h-96 text-black"
    >
      <div className="relative flex h-[80%] w-60 transform items-end border-2 border-black bg-white transition-transform group-hover:scale-105">
        <div className="p-4 pt-0 transition-opacity group-hover:absolute group-hover:opacity-0 sm:p-6 lg:p-8">
         {
            props.role === "it" ? (
              itRoleIcon
            ) : props.role === "dev" ? (
              devRoleIcon
            ) : props.role === "designer" ? ( 
              designerRoleIcon
            ) : defaultRoleIcon
         }

          <h2 className="mt-4 text-xl font-medium sm:text-2xl">{props.name}</h2>
        </div>

        <div className="absolute p-4 opacity-0 transition-opacity group-hover:relative group-hover:opacity-100 sm:p-6 lg:p-8">
          <h3 className="mt-4 text-xl font-medium sm:text-2xl">{props.name}</h3>

          <p className="mt-4 text-sm sm:text-base">{props.role}</p>

          <p className="mt-8 font-bold">Details</p>
        </div>
      </div>
    </Link>
  );
};

export default Card;

const itRoleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    class="h-10 w-10 sm:h-12 sm:w-12"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke-width="2"
      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
    />
  </svg>
);

const devRoleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
   class="h-10 w-10 sm:h-12 sm:w-12"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke-width="2"
      d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
    />
  </svg>
);

const designerRoleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    class="h-10 w-10 sm:h-12 sm:w-12"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke-width="2"
      d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
    />
  </svg>
);

const defaultRoleIcon = (
   <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 sm:h-12 sm:w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
)