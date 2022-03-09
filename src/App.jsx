import { useState, useEffect } from 'react'
import randomWords from "random-words"

const NUMB_OF_WORDS = 200
const SECONDS = 60


function App() {
  const [words, setWords]= useState([])
  const [countDown, setCountDown]= useState(SECONDS)
  const [currentInput, setCurrentInput]= useState("")
  const [currentWordIndex, setCurrenWordIndex]= useState(0)
  const [currentChar, setCurrentChar]= useState("")
  const [currentCharIndex, setCurrentCharIndex]= useState(-1)
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [fieldDisable, setFieldDisable] = useState(true)
  const [showResult, setShowResult] = useState(false)
  const [restart, setRestart] = useState(false)

  function generateWords(){
    return new Array(NUMB_OF_WORDS).fill(null).map(()=> randomWords())
  }

  useEffect(()=>{
    setWords(generateWords())
  },[])

  const start = ()=>{
    setFieldDisable(false)
    const interval =   setInterval(()=>{
      setCountDown((prevCountdown)=> {
        if(prevCountdown === 0) {
          clearInterval(interval)
          setCountDown("--")
          setFieldDisable(true)
          setShowResult(true)
          setRestart(true)
          setCurrentInput("")
        } else {
          return prevCountdown - 1
        }
      })
    },1000)
  }

  const restartGame = ()=> {
    setCurrentInput("")
    setCorrect(0)
    setIncorrect(0)
    setCurrenWordIndex(0)
    setWords(generateWords())
    setCountDown(SECONDS)
    setFieldDisable(false)
    setShowResult(false)
    setRestart(false)
    setCurrentCharIndex(-1)
    setCurrentChar("")

    const interval =   setInterval(()=>{
      setCountDown((prevCountdown)=> {
        if(prevCountdown === 0) {
          clearInterval(interval)
          setCountDown("--")
          setFieldDisable(true)
          setShowResult(true)
          setRestart(true)
        } else {
          return prevCountdown - 1
        }
      })
    },1000)
  }

  const handleKeyDown = ({keyCode, key})=>{
    if(keyCode === 32) {
      checkMatch()
      setCurrentInput("")
      setCurrenWordIndex(currentWordIndex + 1)
      setCurrentCharIndex(-1)
    } else {
      setCurrentCharIndex(currentCharIndex + 1)
      setCurrentChar(key)
    }
  }

  function checkMatch() {
    const wordToCompare = words[currentWordIndex]
    const itMatch = wordToCompare === currentInput.trim()
    if (itMatch) {
      setCorrect(correct + 1)
    } else {
      setIncorrect(incorrect + 1)
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if(wordIdx === currentWordIndex && charIdx === currentCharIndex && currentChar && restart === false){
      if(char === currentChar) {
        return "bg-green-500"
      } else {
        return "bg-red-500"
      }
    } else {
      return " "
    }
  }

  return (
    <div className='w-full min-h-screen bg-gray-900'>
      <div className="w-full h-screen bg-inherit pt-8 flex justify-center flex-col items-center max-w-4xl mx-auto">
          <input type="text" 
                  className="outline-none max-w-4xl w-[56rem] px-4 py-4 rounded-lg border-0 text-black mb-4 shadow-sm" 
                  value={currentInput}
                  onKeyDown={handleKeyDown} 
                  onChange={(e)=> setCurrentInput(e.target.value)} 
                  disabled={fieldDisable}
          />
          <div className='w-full min-h-[80px] flex justify-between items-center text-xl'>
            <span className='text-green-400 text-3xl font-bold ml-4'>{countDown !== NaN ? countDown : "--" }'</span>
            <button 
              className={`text-center text-white font-bold w-[80px] h-[80px] rounded-full mb-4 transition-colors duration-300 self-end ${restart === false ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`} 
              onClick={restart === false ? start : restartGame}>
              {restart === false ? "Go!" : "Restart!" }
            </button>
          </div>
          <div className='max-w-4xl min-h-[100px] mx-auto bg-gray-200 text-gray-800 p-5 rounded-xl shadow-sm'>
            {words.map((word, i) => (
              <span key={i}>
                <span>
                  {word.split("").map((char, idx) => (
                    <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                  )) }
                </span>
                <span> </span>
              </span>
            ))}
          </div>
          {showResult && 
            <div className='w-full min-h-[100px] py-4 font-bold text-white bg-gray-800 flex'>
             <div className='flex-1 text-center'>
                <p className='text-xl'>Words per minute:</p>
                <p className='text-2xl'>{correct}</p>
             </div>
             <div className='flex-1 text-center'>
                <p className='text-xl'>Accuracy :</p>
                <p className='text-2xl'>{Math.round((correct / (correct + incorrect)) * 100)}%</p>
             </div>
            </div>
          }
      </div>
    </div>
  )
}

export default App
