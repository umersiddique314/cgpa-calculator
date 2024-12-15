import { GraduationCap } from 'lucide-react'

export const Header = () => {
  return (
    <div className="text-center mb-10 space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20">
          <div className="w-32 h-32 bg-blue-600 rounded-full"></div>
        </div>
        <GraduationCap className="w-14 h-14 mx-auto text-blue-600 mb-4" />
      </div>  
      <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
        UAF CGPA Calculator
      </h1>
      <p className="text-base text-gray-600 max-w-xl mx-auto">
        Calculate your CGPA with precision and ease
      </p>
    </div>
  )
}
