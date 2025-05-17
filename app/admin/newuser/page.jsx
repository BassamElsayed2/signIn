import Form from "@/app/(components)/Form"

const page = () => {
  return (
 <div className="flex flex-col w-full h-screen items-center justify-center mr-55 py-2">
    <h1 className="text-2xl font-bold mb-4">Create a New User</h1>
    <Form title="Add user" subtitle="add new user details"/>
 </div>
  )
}

export default page