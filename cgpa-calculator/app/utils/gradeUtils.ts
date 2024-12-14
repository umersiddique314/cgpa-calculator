export const getGradeColor = (grade: string) => {
  const colors: { [key: string]: string } = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-blue-100 text-blue-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800',
    'P': 'bg-purple-100 text-purple-800',
  }
  return colors[grade] || 'bg-gray-100 text-gray-800'
}
