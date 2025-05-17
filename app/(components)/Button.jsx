
const Button = (props) => {
  return (
    <button
      className="appearance-none bg-[#fafbfc] border border-[rgba(27,31,35,0.15)] rounded-md shadow-sm shadow-[rgba(27,31,35,0.04)] 
             box-border text-[#24292e] cursor-pointer inline-block text-sm font-medium leading-5 
             px-4 py-1.5 transition-colors duration-200 ease-[cubic-bezier(0.3,0,0.5,1)] 
             select-none align-middle whitespace-nowrap"


        type={props.type}
        onClick={props.onClick}
    >
      {props.text}
    </button>
  );
};

export default Button;
