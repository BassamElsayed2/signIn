import React from 'react'

const Form = (props) => {
  return (
   <div className="max-w-[300px] bg-[#f1f7fe] overflow-hidden rounded-2xl text-[#010101]">
  <form className="relative flex flex-col px-6 pt-8 pb-6 gap-4 text-center">
    <h2 className="font-bold text-[1.6rem]">{props.title}</h2>
    <p className="text-base text-[#666]">{props.subtitle}</p>

    <div className="overflow-hidden rounded-lg bg-white my-4 w-full">
      <input
        type="text"
        placeholder="Name"
        className="bg-transparent border-0 outline-none h-10 w-full border-b border-[#eee] text-sm px-4 py-2"
      />

      <input
        type="password"
        placeholder="Password"
        className="bg-transparent border-0 outline-none h-10 w-full border-b border-[#eee] text-sm px-4 py-2"
      />

      <select
        className="bg-transparent border-0 outline-none h-10 w-full border-b border-[#eee] text-sm px-4 py-2 text-[#666]"
        required
        defaultValue="it"
      >
       
        <option value="it">it</option>
        <option value="dev">developer</option>
        <option value="designer">designer</option>
      </select>
    </div>

    <button
      type="submit"
      className="bg-[#0066ff] text-white border-0 rounded-full px-4 py-2.5 text-base font-semibold cursor-pointer transition-colors duration-300 hover:bg-[#005ce6]"
    >
      Create User
    </button>
  </form>
</div>


  )
}

export default Form


