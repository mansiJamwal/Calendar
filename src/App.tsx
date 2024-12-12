import './App.css'
import { Calendar } from "@/components/ui/calendar"
import { useState,useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'

interface EventInterface{
    date: Date|undefined
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

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setAllevents(JSON.parse(storedEvents));
    } else {
      setAllevents([]);
    }
}, []);

useEffect(() => {
    localStorage.setItem('events', JSON.stringify(allevents));
}, [allevents]);

  function handleventadd(){
    if(!date) return;
        const event={
          date:new Date(date),
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
    console.log("Event Date:", allevent.date);
    console.log("Selected Date:", selectedDate);
    return (
      allevent.date &&
      allevent.date.toDateString() === selectedDate?.toDateString()
    );
    })
    setEvents(filteredevents);
  }

  useEffect(() => {
    filterEventsByDate(date);
  }, [allevents, date]);

  return (
    <div className="h-screen w-screen flex">
      <div className="w-1/4 bg-neutral-700 text-gray-200 p-4 space-y-4">
    <div className="text-xl font-semibold text-center">Event List</div>
    <div className="space-y-2">
      {events.length > 0? (
        events.map((event, index) => (
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
          </div>
        ))
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
        className="w-className=''64 p-2 rounded-md border bg-neutral-900 text-gray-200"
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
    </div>
  );
}

export default App;
