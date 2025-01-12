import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

const DashboardPage = () => {

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const text = e.target.text.value;
    console.log("text in DP", text);
    if (!text) return;
    console.log("text in dashboardpage, ", text);
    mutation.mutate(text);
  };
  return (
    <div className='h-full flex flex-col items-center'>
      <div className='flex-[1] flex flex-col justify-center items-center w-[50%] gap-[50px]'>
        <div className='flex items-center gap-5 opacity-20'>
          <img src="/logo.png" alt="" className='w-16 h-16'/>
          <h1 className='text-6xl bg-gradient-to-r from-blue-700 to-pink-700 bg-clip-text text-transparent'>Cool AI</h1>
        </div>
        <div className='w-full flex items-center justify-between gap-[50px]'>
          <div className='flex-1 flex flex-col gap-[10px] font-light text-[14px] p-[20px] border border-[#555] rounded-[20px]'>
            <img src="/chat.png" alt="" className='w-10 h-10 object-cover'/>
            <span>Create a New Chat</span>
          </div>
          <div className='flex-1 flex flex-col gap-[10px] font-light text-[14px] p-[20px] border border-[#555] rounded-[20px]'>
            <img src="/image.png" alt="" className='w-10 h-10 object-cover'/>
            <span>Analyze Images</span>
          </div>
          <div className='flex-1 flex flex-col gap-[10px] font-light text-[14px] p-[20px] border border-[#555] rounded-[20px]'>
            <img src="/code.png" alt="" className='w-10 h-10 object-cover'/>
            <span>Help me with my Code</span>
          </div>
        </div>
      </div>
      <div className='mt-auto w-[50%] bg-[#2c2937] rounded-[20px] flex'> 
        <form className='w-full h-full flex items-center justify-between gap-5 mb-[10px]' onSubmit={handleSubmit}>
            <input type='text' placeholder='Ask me anything...' className='flex-[1] p-5 bg-transparent outline-none border-0 text-[#ececec]' name="text"></input>
            <button className='bg-[#605e68] rounded-[50%] border-0 cursor-pointer p-[10px] flex items-center justify-center mr-5'>
              <img src="/arrow.png" alt="" className='w-4 h-4'/>
            </button>
        </form>
      </div>
    </div>
  )
}

export default DashboardPage