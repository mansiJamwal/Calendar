import './App.css'
import { Calendar } from "@/components/ui/calendar"
import { useState,useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { FiTrash2 } from "react-icons/fi";
import { FiEdit } from 'react-icons/fi'

interface EventInterface{
    id:number
    date: string
    title: string,
    description: string,
    starttime: string,
    endtime:string
}

function App() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [title,setTitle] = useState<string>('');
  const [description,setDescription] = useState<string>('');
  const [starttime,setStarttime]=useState<string>('')
  const [endtime,setEndtime]=useState<string>('')
  const [allevents,setAllevents]=useState<EventInterface[]>([])
  const [events,setEvents]=useState<EventInterface[]>([]);
  const [isWindowOpen,setIsWindowOpen]=useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const[index,setIndex]=useState<number|null>(null);

useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setAllevents(JSON.parse(storedEvents));
    }else{
      setAllevents([]);
    }
    setIsInitialized(true);
}, []);

useEffect(() => {
  if(allevents){ 
    if(isInitialized==true){
        localStorage.setItem('events', JSON.stringify(allevents));
    }
  }
}, [allevents,isInitialized]);

  function handleventadd(){
    if(!date) return;
        const event={
          id:allevents.length+1,
          date:(new Date(date)).toDateString(),
          title:title,
          description:description,
          starttime:starttime,
          endtime:endtime
        }

        setAllevents([...allevents,event])
        setTitle('');
        setDescription('');
        setStarttime('');
        setEndtime('');
      console.log(event);
  }

  function filterEventsByDate(selectedDate:Date|undefined){
    const filteredevents=allevents.filter((allevent)=>{
    return (
      allevent.date &&
      allevent.date === selectedDate?.toDateString()
    );
    })
    setEvents(filteredevents);
  }

  useEffect(() => {
    filterEventsByDate(date);
  }, [allevents, date]);

  function deleteEvent(index:number){
    const filteredevents=allevents.filter((allevent)=>
        allevent.id!==index
    )
    setAllevents(filteredevents);
  }

  function openUpdateModal(index: number) {
    const eventindex=allevents.findIndex((allevent)=>allevent.id===index)
    setIndex(eventindex)
    const event=allevents[eventindex]
    setTitle(event.title);
    setDescription(event.description);
    setStarttime(event.starttime);
    setEndtime(event.endtime);
    setIsWindowOpen(true);
  }

  function updateevent(){
    const eventindex=index;
    if (eventindex !== null) {
      const updatedEvents = [...allevents];
      updatedEvents[eventindex] = {
        ...updatedEvents[eventindex],
        title,
        description,
        starttime,
        endtime,
      };
      setAllevents(updatedEvents);
      setIsWindowOpen(false);
      setTitle("");
      setDescription("");
      setStarttime("");
      setEndtime("");
    }
  }

  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/4 bg-neutral-700 text-gray-200 p-4 space-y-4">
    <div className="text-xl font-semibold text-center">Event List</div>
    <div className="space-y-2">
      {events.length > 0? (
        events.map((event, index) => {
          return (
          <div
            key={index}
            className="p-3 bg-neutral-800 rounded-md shadow-md space-y-1"
          >
            <div className="font-semibold text-lg">{event.title}</div>
            <div className="text-sm text-gray-400">{event.description}</div>
            <div className="text-sm">
              <span className="font-semibold">Time:</span> {event.starttime} -{" "}
              {event.endtime}
            </div>

            <div className="flex items-center justify-center space-x-4">
            <FiEdit
              className="text-blue-500 cursor-pointer hover:text-blue-700 text-lg transition-transform duration-300 ease-in-out"
              onClick={() => openUpdateModal(event.id)}
            />
            <FiTrash2
              className="text-red-500 cursor-pointer hover:text-red-700 text-lg transition-transform duration-300 ease-in-out"
              onClick={() => deleteEvent(event.id)}
            />
          </div> 
          </div>
        );
      })
      ) : (
        <div className="text-center text-gray-400">No events added</div>
      )}

    </div>
  </div>
  
    <div
      className="h-screen w-3/4 flex flex-col justify-center items-center bg-neutral-800 text-gray-200 space-y-6"
    >
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
      />

      <div className=" bg-neutral-900 p-6 rounded-lg shadow-lg space-y-4">
      <div className="text-center text-xl font-semibold text-gray-200" >Add Event</div>
      <Input
        placeholder="Title" 
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        className="w-64 p-2 rounded-md border bg-neutral-900 text-gray-200"
      />

      <Input
        placeholder="Description"
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        className="w-64 p-2 rounded-md border bg-neutral-900 text-gray-200"
      />
   <div className='flex justify-center'>
        <div className="text-center text-m mr-10 font-semibold text-gray-200">Start time</div>
        <div className="text-center text-m font-semibold text-gray-200">End time</div>
    </div>
      <div className='flex justify-center'>
      <Input
        placeholder="Start Time"
        type="time"
        value={starttime}
        onChange={(e)=>{setStarttime(e.target.value)}}
        className="w-21 p-2 mr-5 rounded-md border bg-neutral-900 text-gray-200"
      />

      <Input
        placeholder="End Time"
        type="time"
        value={endtime}
        onChange={(e)=>{setEndtime(e.target.value)}}
        className="w-21 p-2 rounded-md border bg-neutral-900 text-gray-200"
      />
      </div>

      <div className="flex justify-center mt-4">
          <Button onClick={handleventadd} >Submit</Button>
      </div>

    </div>
    </div>

    {isWindowOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-neutral-900 p-6 rounded-lg shadow-lg space-y-4">
            <div className="text-xl font-semibold text-gray-200">Update Event</div>
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-64 p-2 rounded-md border bg-neutral-900 text-gray-200"
            />
            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-64 p-2 rounded-md border bg-neutral-900 text-gray-200"
            />
            <Input
              placeholder="Start Time"
              type="time"
              value={starttime}
              onChange={(e) => setStarttime(e.target.value)}
              className="w-64 p-2 rounded-md border bg-neutral-900 text-gray-200"
            />
            <Input
              placeholder="End Time"
              type="time"
              value={endtime}
              onChange={(e) => setEndtime(e.target.value)}
              className="w-64 p-2 rounded-md border bg-neutral-900 text-gray-200"
            />
            <div className="flex justify-between mt-4">
              <Button onClick={() => setIsWindowOpen(false)}>Cancel</Button>
              <Button onClick={updateevent}>Update</Button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}

export default App;

