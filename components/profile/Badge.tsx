interface BadgeProps {
  name: string
  icon: string
  description: string
  size?: "sm" | "md" | "lg"
}

export function Badge({ name, icon, description, size = "md" }: BadgeProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
  }

  return (
    <div className="group relative">
      <div
        className={`
        ${sizeClasses[size]}
        bg-gradient-to-br from-yellow-400 to-orange-500
        rounded-lg border-2 border-yellow-300
        flex items-center justify-center
        shadow-lg hover:shadow-xl transition-all duration-200
        hover:scale-105 cursor-pointer
      `}
      >
        <span className="filter drop-shadow-sm">{icon}</span>
      </div>

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        <div className="font-semibold">{name}</div>
        <div className="text-gray-300">{description}</div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
    </div>
  )
}
