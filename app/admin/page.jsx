import Card from "../(components)/Card";

const page = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      role: "it",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "dev",
    },
    {
      id: 3,
      name: "Alice Johnson",
      role: "designer",
    },
    {
      id: 4,
      name: "Bob Brown",
      role: "it",
    },
    {
      id: 5,
      name: "Charlie Davis",
      role: "dev",
    },
    {
      id: 6,
      name: "Eve White",
      role: "designer",
    },
    {
      id: 7,
      name: "Frank Black",
      role: "it",
    },
    {
      id: 8,
      name: "Grace Green",
      role: "dev",
    },
  ];
  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-[70%] h-fit justify-items-center m-[2%] gap-4">
    
      {users.map((user) => (
        <Card key={user.id} name={user.name} role={user.role} link={user.id} />
      ))}
    </div>
  );
};

export default page;
