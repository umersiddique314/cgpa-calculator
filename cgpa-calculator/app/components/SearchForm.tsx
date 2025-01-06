import { Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface SearchFormProps {
  regNumber: string;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onRegNumberChange: (value: string) => void;
}

export const SearchForm = ({ regNumber, loading, onSubmit, onRegNumberChange }: SearchFormProps) => {
  return (
    <motion.form
      onSubmit={onSubmit}
      className="max-w-lg mx-auto mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        <input
          type="text"
          value={regNumber}
          onChange={(e) => onRegNumberChange(e.target.value)}
          placeholder="Enter Ag Number (e.g. 2022-ag-7693)"
          className="w-full px-5 py-4 pl-12 pr-16 rounded-xl border border-gray-200 
                   dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100
                   focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 
                   focus:ring-blue-200 dark:focus:ring-blue-900 outline-none 
                   transition-all duration-300 text-sm shadow-md"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 
                   bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium
                   hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors 
                   disabled:bg-blue-300 dark:disabled:bg-blue-700 shadow-md"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </motion.form>
  )
}

