'use client'
import { use, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Response } from "@/models/models"
import { BASE_URL } from "@/services/api"

export default function Home() {
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [people, setPeople] = useState<Response>()
  const [filtered, setFiltered] = useState<Response>()

  useEffect(() => {
    const getData = async (page: number) => {
      setPeople(undefined)
      setLoading(true)
      try {
        const people = await fetch(`${BASE_URL}/people/?page=${page}`)

        if (!people.ok) throw new Error('Error fetching people')
        const data = await people.json()
        setPeople(data)
        setFiltered(data)
      } catch (error) {
        if (error instanceof Error) setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getData(page)
  }, [page])

  const handlePage = (page: number) => {
    if (page === 0) return
    setPage(page)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filteredItems = people?.results?.filter((val) => val.name.toLowerCase().includes(e.target.value.toLowerCase()))
    setFiltered({ next: people?.next, previous: people?.previous, results: filteredItems })
  }
  
  if (error) return <p>{error}</p>
  
  return (
    <main className="flex flex-col justify-center items-center gap-20 p-12">
      <h1 className="text-3xl font-medium">Star Wars Challenge 🚀</h1>
      {people?.results && <input type="text" placeholder="Darth Vader" className="w-1/2 bg-gray-400 p-2 rounded-md placeholder:text-black text-black outline-none" autoFocus onChange={handleChange} />}
      {!filtered?.results?.length && <p>Oops, we cant find characters</p>}
      {loading ? <p>Loading...</p> :
        <>
          <section className="grid grid-cols-3 gap-6 cols w-1/2">
            {filtered?.results?.map((people) =>
              <ul key={people.name} className="flex flex-col gap-2">
                <Image src='https://yt3.googleusercontent.com/ytc/AGIKgqM_6K_Hn5dH7OP346MxNZMKuHhX3_zMRyZkxGKzmA=s900-c-k-c0x00ffffff-no-rj' height={400} width={400} alt="star wars image" className="object-cover" />
                <li className="text-2xl">{people.name}</li>
              </ul>
            )}
          </section>
          <div className="flex gap-4">
            <button className={`bg-slate-700 p-2 rounded-md ${!people?.previous && 'bg-gray-300 text-gray-800 opacity-50 cursor-not-allowed'}`} disabled={people?.previous === null} onClick={() => handlePage(page - 1)}>&larr; prev page </button>
            <button className={`bg-slate-700 p-2 rounded-md ${!people?.next && 'bg-gray-300 text-gray-800 opacity-50 cursor-not-allowed'}`} disabled={people?.next === null} onClick={() => handlePage(page + 1)}> next page &rarr;</button>
          </div>
        </>
      }
    </main>
  )
}
