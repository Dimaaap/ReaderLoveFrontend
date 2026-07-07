"use client"

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react'

export const BookSelect = ({ books, selectedBook, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredBooks = books?.filter((book) => {
        const titleMatch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
        const authorMatch = book.authors?.some(author => author.last_name.toLowerCase().includes(searchQuery.toLowerCase()))
        
        return titleMatch || authorMatch
    })

  
   return (
    <div className="relative w-full flex flex-col gap-2" ref={ containerRef }>
        <label className="block text-md font-semibold text-zinc-500">
            Оберіть книгу
        </label>

        <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-[#1e1e24] border border-gray-700 
        rounded-xl cursor-pointer hover:border-gray-600 transition-colors select-none"
        >
            <div className="flex items-center gap-3">
                { selectedBook ? (
                    <>
                        { selectedBook.image_link ? (
                            <Image src="https://content1.rozetka.com.ua/goods/images/big/571596404.jpg"
                                alt={ selectedBook.title }
                                className="w-6 h-9 object-cover rounded shadow-sm"
                                width="60" height="60"
                            />
                        ) : (
                            <div className="w-6 h-9 bg-gray-750 border border-gray-700 rounded" />
                        ) }
                        <div>
                            <p className="text-white text-sm font-medium line-clamp-1">{selectedBook.title}</p>
                            <p className="text-gray-400 text-xs">
                                {`${selectedBook.authors?.[0]?.first_name} ${selectedBook.authors?.[0]?.last_name}`|| 'Автор не вказаний'}
                            </p>
                        </div>
                    </>
                ) : (
                    <span className="text-gray-500 text-sm">Яку книгу ви зараз читаєте?</span>
                ) }
            </div>

            { isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[#1e1e24] border border-gray-700 rounded-xl shadow-2xl overflow-hidden 
                max-h-64 flex flex-col top-[25%] left-0">
                    <div className="flex items-center px-3 border-b border-gray-750 bg-[#16161a]">
                        <input
                        type="text"
                        placeholder="Пошук книги або автора..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2.5 bg-transparent text-sm text-white focus:outline-none placeholder-gray-500"
                        autoFocus
                        />
                    </div>

                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {filteredBooks?.length > 0 ? (
                            filteredBooks.map((book) => {
                                const isSelected = selectedBook?.id === book.id;
                                return (
                                <div
                                    key={book.id}
                                    onClick={() => {
                                    onSelect(book);
                                    setIsOpen(false);
                                    setSearchQuery('');
                                    }}
                                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                                    isSelected ? 'bg-purple-950/30' : 'hover:bg-gray-750'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                    <img 
                                        src="https://content1.rozetka.com.ua/goods/images/big/571596404.jpg"
                                        alt={book.title} 
                                        className="w-7 h-10 object-cover rounded bg-gray-800"
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">{book.title}</p>
                                        <p className="text-gray-400 text-xs">{ book.authors?.[0]?.first_name } {book.authors?.[0]?.last_name}</p>
                                    </div>
                                    </div>

                                </div>
                                );
                            })
                        ) : (
                        <p className="text-gray-500 text-sm p-4 text-center">Книг не знайдено</p>
                        )}
                    </div>
                </div>
            ) }
        </div>
    </div>
  )
}
