import { Search } from 'lucide-react'

interface SearchFormProps {
  regNumber: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onRegNumberChange: (value: string) => void;
}

export const SearchForm = ({ regNumber, loading, onSubmit, onRegNumberChange }: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-auto mb-8">
      <div className="relative group">
        <input
          type="text"
          value={regNumber}
          onChange={(e) => onRegNumberChange(e.target.value)}
          placeholder="Enter Registration Number (e.g., 2022-ag-7693)"
          className="w-full px-4 py-3 pl-12 pr-16 rounded-lg border border-gray-200 
                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none 
                   transition-all duration-300 text-sm bg-white"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 
                   bg-blue-600 text-white rounded-md text-sm font-medium
                   hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </form>
  )
}
