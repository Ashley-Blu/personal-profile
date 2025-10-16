import { useState } from "react";
import logo from "./assets/ai-logo.png";
import { CiSearch } from "react-icons/ci";

interface Message {
  role: 'user' | 'ai';
  content: string;
}

const App: React.FC = () => {
const [input, setInput] = useState<string>("");
const [messages, setMessages] = useState<Message[]>([]);
const [loading, setLoading] = useState<boolean>(false);

const handleSend = async (): Promise<void> =>{
  if(!input.trim()) return;


const userMessage: Message = { role : 'user', content: input };
setMessages(prev => [...prev, userMessage]);
setInput('');
setLoading(true);

try{
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ model: 'gemma:2b', prompt:  `You are BlueChat, a friendly and curious AI who answers concisely. 
Keep your tone warm and helpful. Reply to this user:\n\n${input}\nAI:` }),
  });

  const data = await response.text();
  const lines = data.split('\n').filter(line => line.trim() !== '');
  const aiText = lines
  .map(line => {
    try{
      const parsed = JSON.parse(line);
      return parsed.response || '';
    }
    catch{
      return '';
    }
  })
  .join('');

  const aiMessage: Message = {role: 'ai', content: aiText};
  setMessages(prev => [...prev, aiMessage]);
}
catch(error){
  console.error('Error: ', error);
  setMessages(prev => [
    ...prev,
    {role: 'ai', content: 'Unable to connect to Ollama.'},
  ]);
} finally{
  setLoading(false);
}
};

  return (
    <div>
      <nav>
        <img
          src={logo}
          alt="Logo image for my AI application"
          className="w-10 h-10 float-left mt-[-6px] ml-5"
        />
        <p className="mt-5">
          <span className="text-blue-400 font-bold">Blue</span>Chat
        </p>
      </nav>

      <div className="text-center my-20">
        <h1 className="font-extrabold text-4xl text-blue-600">
          Welcome to BlueChat
        </h1>
        <p className="text-gray-500">
          AI chatbot created using a Ollama model. <br /> Ask away...
        </p>
      </div>
      <div>
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {loading && <div className="msg ai">Thinking...</div>}
      </div>

      <div className="mx-115 my-90 flex absolute">
        <input
          type="text"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSend()}
          placeholder="Please enter your promt in here..."
          className="border-2 border-blue-600 p-2 w-150"
          
        />
        <button onClick={handleSend}>Search</button>
      </div>
    </div>
  );
}

export default App;
