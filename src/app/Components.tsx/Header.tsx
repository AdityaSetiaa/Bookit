import Image from "next/image";
import logo from "../../../public/highwaydeliteLogo.png"
const Header = () => {
  return (
    <header className='w-full sm:px-14 shadow h-[84px] px-[124px] flex items-center '>
      <div className="w-full flex flex-row items-center justify-between px-6">
  <Image
    src={logo}
    alt="Logo"
    width={100}
    height={55}
    priority
  />
  
  <form action="submit" className="flex items-center gap-4">
    <input
      type="text"
      className="bg-zinc-100 w-[340px] px-2 py-1 rounded outline-none"
      placeholder="Search..."
    />
    <button className="bg-yellow-400 px-3 py-1 rounded">Search</button>
  </form>
</div>

    </header>
  )
}

export default Header
