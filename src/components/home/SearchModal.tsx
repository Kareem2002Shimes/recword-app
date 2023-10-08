import { useState } from "react";
import { BiSearch } from "react-icons/bi";

function SearchModal() {
  const [inputValue, setInputValue] = useState("");
  return (
    <>
      <button
        type="button"
        onClick={() =>
          (
            window.document.getElementById("my_modal_2") as HTMLDialogElement
          ).showModal()
        }
        className="flex h-12 w-full items-center gap-4 rounded-lg bg-white px-4 text-left text-sm text-slate-400 shadow-sm ring-1 ring-slate-900/10 hover:ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:ring-0 dark:hover:bg-slate-700 md:w-72"
      >
        <BiSearch className="h-6 w-6 text-slate-300 dark:text-slate-400" />
        Search a word...
      </button>
      <dialog id="my_modal_2" className="modal">
        <form
          method="dialog"
          className="modal-box bg-white p-0 pb-4 dark:bg-[#1e293b]"
        >
          <div className="border-[rgb(241,245,249] flex items-center gap-4 border-b p-4 dark:border-[#e2e8f00d]">
            <label htmlFor="docsearch-input">
              <BiSearch className="h-6 w-6 text-slate-800 dark:text-slate-400" />
            </label>
            <input
              className="flex-1 bg-transparent text-[0.875rem] text-[#0f172a] dark:text-[rgb(226,232,240)]"
              placeholder="Type a word"
              maxLength={60}
              id="docsearch-input"
              type="search"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="btn-ghost h-7 w-8 rounded-md text-[10px] font-semibold text-slate-500 ring-1 ring-slate-900/10 hover:bg-white hover:text-slate-600 hover:ring-slate-300 dark:bg-[rgb(71,85,105)] dark:text-slate-400  dark:ring-0 dark:hover:bg-[rgb(71,85,105)] dark:hover:text-slate-300">
              ESC
            </button>
          </div>
          <div className="mt-2 p-4 text-left text-[rgb(148,163,184)] dark:text-info">
            <p>{inputValue}</p>
          </div>
        </form>
      </dialog>
    </>
  );
}

export default SearchModal;
