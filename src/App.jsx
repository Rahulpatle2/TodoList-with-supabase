import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient';

const App = () => {
  const [addToDo,setAddToDo] = useState([]);
  const [newTodo,setNewTodo] = useState("");

  useEffect(() =>{
    fetchTodos();
  },[])

  const fetchTodos = async() =>{
    const{data,error} = await supabase.from("Todo-List-Table").select("*");

    if(error){
      console.log("error fetching", error)
    }else{
      setAddToDo(data)
    }
  }


  const createToDo = async() =>{
    const newTodoData = {
      name:newTodo,
      is_checked:false
    }
    const {data,error} = await supabase
    .from("Todo-List-Table")
    .insert([newTodoData])
    .select()

    if(error){
      console.log("supabase error",error);
    }else{
      setAddToDo((prev) => [...prev,data[0]]);
    }
    console.log("Inserted response:", JSON.stringify(data));

  }

  const completeTask = async(id,isCompleted) =>{
    const{data,error} = await supabase
    .from('Todo-List-Table')
    .update({is_checked:!isCompleted})
    .eq("id",id)

    if(error){
      console.log('toggling error',error)
    }else{
      const updatedTodoList = addToDo.map((todo) =>
        todo.id === id ? {...todo,is_checked:!isCompleted}:todo
      )
      setAddToDo(updatedTodoList)
    }
  } 

  const deleteTask = async(id) =>{
    const {data,error} = await supabase
    .from('Todo-List-Table')
    .delete()
    .eq("id",id)
    if(!error){
    setAddToDo(addToDo.filter(todo => todo.id !== id));
  }
  }


  return (
    <>
      <div className='flex flex-col gap-3 border h-screen items-center justify-center'>
      <div className='flex gap-4 '>
        <input onChange={(e) => setNewTodo(e.target.value)} value={newTodo} className='rounded px-4 py-2 text-lg outline-0 border-0 bg-amber-200' type="text" placeholder='enter todo..' />
        <button onClick={createToDo} className='rounded-xl bg-green-500 px-4 py-2 text-md cursor-pointer text-white '>create</button>
      </div>
      {console.log("addToDo:", addToDo)}

      <ul className="flex flex-col justify-start w-72 gap-2">
  {addToDo.map((todo) => {
    return (
      <li key={todo.id} className="flex  gap-2">
        <p className="px-4 py-2 border rounded bg-blue-500 text-white text-lg">
          {todo.name}
        </p>

        <button
          className="rounded-xl bg-orange-500 px-4 py-2 text-md cursor-pointer text-white"
          onClick={() => completeTask(todo.id, todo.is_checked)}
        >
          {todo.is_checked ? "Completed" : "Pending"}
        </button>

        <button
          className="rounded-xl bg-red-500 px-4 py-2 text-md cursor-pointer text-white"
          onClick={() => deleteTask(todo.id)}
        >
          Delete
        </button>
      </li>
    );
  })}
</ul>


    </div>
    
    </>
    
  )
}

export default App