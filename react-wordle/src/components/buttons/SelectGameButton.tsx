function SelectGameButton() {

  const isGameStarted = true;

  return (
    <div className="flex flex-col gap-3 mt-10 place-self-center content-center">
    <button className = "bg-yellow-100 text-gray-900 bg-white border border-gray-300 hover:bg-yellow-50 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2">
        New Game
    </button>
    {
      isGameStarted ?
      <button className = "bg-emerald-100 text-gray-900 bg-white border border-gray-300 hover:bg-emerald-50 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2">
          Continue Game
      </button>
      :
      null
    }
    </div>
  )
}

export default SelectGameButton