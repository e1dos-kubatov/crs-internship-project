import { Link } from 'react-router-dom'
import { Star, MapPin, DollarSign } from 'lucide-react'

const CarCard = ({ car }) => {
  return (
    <Link to={`/cars/${car.id}`} className="group block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 h-full">
        <div className="h-56 bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 flex items-center justify-center p-8 group-hover:scale-105 transition-transform duration-300">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-lg">
              🚗
            </div>
            <div className="text-2xl font-bold text-gray-800">{car.brand}</div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-xl mb-3 leading-tight">{car.model}</h3>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < (car.rating || 4.8) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">({car.reviews || 128})</span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {car.location || 'New York, NY'}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              🪑 {car.capacity || 5} seats • {car.transmission || 'Auto'}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">${car.pricePerDay}</div>
              <div className="text-sm text-gray-500">per day</div>
            </div>
            <div className="flex items-center text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              <DollarSign className="w-3 h-3 mr-1" />
              {car.pricePerDay < 80 ? 'Budget' : car.pricePerDay < 120 ? 'Premium' : 'Luxury'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CarCard

