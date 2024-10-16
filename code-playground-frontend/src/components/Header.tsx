import Logo from "./Logo";

const Header = () => {
  return (
    <div className="w-full h-16 bg-zinc-800 text-white flex items-center px-4 gap-2">
      <Logo fill="#fff" size={30} />
      <span className="font-playfair tracking-wider text-lg">code dojo</span>
    </div>
  );
};

export default Header;
