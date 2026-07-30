export default function CamUnlimitedBrand({ image, compact = false }) {
  return (
    <div
      className={`flex items-center bg-[#E7EFFD] ${
        compact ? "gap-2 rounded-md px-2 py-2" : "h-[116px] gap-2.5 px-5"
      }`}
    >
      {image && (
        <img
          src={image}
          alt="Wyze"
          className={compact ? "h-9 w-auto" : "h-[52px] w-auto"}
        />
      )}
      <p
        className={`whitespace-nowrap font-extrabold leading-none tracking-tight ${
          compact ? "text-xl" : "text-[34px]"
        }`}
      >
        <span className="text-[#050505]">Cam </span>
        <span className="bg-gradient-to-r from-[#4A2ED1] to-[#6249EF] bg-clip-text text-transparent">
          Unlimited
        </span>
      </p>
    </div>
  );
}
