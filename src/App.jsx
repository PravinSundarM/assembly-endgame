import React from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText ,getRandomWord} from "./utils";
import Confetti from "react-confetti";


export default function AssemblyEndGame() {

//state Values
const [currentWord,setCurrentWord]=React.useState(()=>getRandomWord())


const [guessedLetters,setguessedLetter]=React.useState([])

//Derived Value

const wrongGuessCount=
      guessedLetters.filter(letter=>!currentWord.includes(letter)).length

const isGameWon=
      currentWord.split("").every(letter=>guessedLetters.includes(letter))      

const isGameLost=wrongGuessCount>=languages.length-1

const isGameOver=isGameWon||isGameLost

const lastGuessedLetter=guessedLetters[guessedLetters.length-1]

const isLastGuessIncorrect=lastGuessedLetter &&!currentWord.includes(lastGuessedLetter)

const noOfGuessLeft=languages.length-1


//Static Values

const alpha="abcdefghijklmnopqrstuvwxyz"


function addGuessedLetter(letter)
{
 setguessedLetter(
  prevLetters=>
    prevLetters.includes(letter)?
        prevLetters:
        [...prevLetters,letter])
    
}

const keyboardElements=alpha.split("").map((letter)=> 
  {
  
  const isGuessed=guessedLetters.includes(letter)
  const isCorrect=isGuessed && currentWord.includes(letter)
  const isWrong=isGuessed && !currentWord.includes(letter)
  const className=clsx({
    correct:isCorrect,
    wrong:isWrong
  })
 
  return(
  <button
          className={className}  
          onClick={()=>addGuessedLetter(letter)}
          disabled={isGameOver}
          aria-disabled={guessedLetters.includes(letter)}
          aria-label={`Letter${letter}`}
          key={letter}
        >
          {letter.toUpperCase()}
        </button>
  )
})
        
const letter=currentWord.split("").map((letter,index)=>{
      const shouldRevealLetter=isGameLost||guessedLetters.includes(letter)
      const letterClassName=clsx(
        isGameLost && !guessedLetters.includes(letter)&& "missedLetter"
      )
       
       return(
       <span  key={index} className={letterClassName}>
          {shouldRevealLetter ? letter.toUpperCase():""}
       </span> 
)})

const languageElements=languages.map((lang,index)=>{
        
        const isLanguageLost=index<wrongGuessCount
        

        const styles={
             backgroundColor:lang.backgroundColor,
             color:lang.color
        }

        const className=clsx("chip",isLanguageLost &&"lost")
        return(
           <span 
              // className={`chip ${isLanguageLost?"lost":""}`} 
              className={className}
              style={styles}
              key={lang.name}
           >
             {lang.name}
           </span>
        ) 
 })

 
  const gameStatusClass=clsx("game-status",{
    won:isGameWon,
    loss:isGameLost,
    farewell:!isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus(){
    if(!isGameOver && isLastGuessIncorrect){
      return(
        <p className="farewellMessage">
            {getFarewellText(languages[wrongGuessCount -1].name)}</p>
        
      ) 
          }

    if(isGameWon){
        return(
          <>
               <h2>You Win..!</h2>
               <p>Well Done!🎉</p>
          </>
         )
      }
    if(isGameLost){
        return(
        <>
                <h2>Game Over..!</h2>
                <p>You Lose! Better Start Learning Assembly😵</p>
         </>
         )

      }
     return null

  }
  
  function startNewGame(){
    setCurrentWord(getRandomWord())
    setguessedLetter([])
  }

  return (
    <main>
      {
        isGameWon &&
        <Confetti
        recycle={false}
        numberOfPieces={1000}
        height={729.60}/>
      }
        <header>
            <h1>Assembly  EndGame</h1>
            <p>Guess the word within 8 attempts to keep the programming world safe from the Assembly</p>
        </header>

        <section aria-live="polite" 
          role="status" 
          className={gameStatusClass}
        >
        {/* { isGameOver?(
           isGameWon?(
               <>
                  <h2>You Win..!</h2>
                  <p>Well Done!🎉</p>
               </>
              ) :(   
                <>
                   <h2>Game Over..!</h2>
                   <p>You Lose! Better Start Learning Assembly😵</p>
                 </>
            )
          ) : (
               null
        ) }*/  renderGameStatus()}
        
        </section>
        
        <section className="language">
               {languageElements}
        </section>

        <section className="word">
          {letter}
        </section>

        <section 
            className="sronly" 
            aria-live="polite"
            role="status" 
        >
              <p>
                {
                  currentWord.includes(lastGuessedLetter)?
                  `Correct ! The Letter ${lastGuessedLetter} is in the Word`:
                  `Sorry The Letter ${lastGuessedLetter}is not in the Word`
                }
                You have ${noOfGuessLeft} Attempts Letter.
              </p>         
              <p>Current Word:{currentWord.split("").map(letter=>
                guessedLetters.includes(letter)? letter + ".":"Blank"
              ).join(" ")}
              </p>

        </section>

        <section
          
           className="keyboard">
           {keyboardElements}
        </section>

        {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}
