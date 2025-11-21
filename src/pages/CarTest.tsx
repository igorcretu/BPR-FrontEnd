import { useEffect, useState } from 'react'
import { fetchCarImage } from '../utils/carImages'

const MAKES_AND_MODELS = {
    Toyota: ['Corolla', 'Camry', 'Yaris', 'RAV4'],
    Honda: ['Civic', 'Accord', 'Fit', 'CR-V'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5'],
    Audi: ['A4', 'A6', 'Q5', 'Q7'],
    Ford: ['Focus', 'Fiesta', 'Mustang', 'Escape'],
    Volvo: ['V60', 'V90', 'XC60', 'S60'],
    Mercedes: ['C-Class', 'E-Class', 'GLC', 'A-Class'],
} as const

type Car = {
    make: keyof typeof MAKES_AND_MODELS
    model: string
    year: number
    image: string | null
}

const getRandom = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)]
 
export default function CarImageTester() {
    const [cars, setCars] = useState<Car[]>([])

    useEffect(() => {
        let isCancelled = false

        const loadCars = async () => {
            const maxCars = 10
            const generated: Car[] = []
            const makes = Object.keys(MAKES_AND_MODELS) as (keyof typeof MAKES_AND_MODELS)[]

            for (let i = 0; i < maxCars; i += 1) {
                const make = getRandom(makes)
                const model = getRandom(MAKES_AND_MODELS[make])
                const year = 2000 + Math.floor(Math.random() * 25)
                const image = await fetchCarImage(make, model, year)
                generated.push({ make, model, year, image })
            }

            if (!isCancelled) {
                setCars(generated)
            }
        }

        loadCars()

        return () => {
            isCancelled = true
        }
    }, [])

    return (
        <div style={{ padding: 20 }}>
            <h1>Car Image Tester (10 Random Cars)</h1>
            {cars.length === 0 && <p>Loading...</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                {cars.map((car, index) => (
                    <div key={`${car.make}-${car.model}-${index}`} style={{ border: '1px solid #ccc', padding: 10 }}>
                        <h3>
                            {car.year} {car.make} {car.model}
                        </h3>

                        {car.image ? (
                            <img
                                src={car.image}
                                alt={`${car.make} ${car.model}`}
                                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                            />
                        ) : (
                            <p style={{ color: 'red' }}>No image found</p>
                        )}

                        <p style={{ fontSize: 12, opacity: 0.7 }}>{car.image ? 'Image found!' : 'No image available'}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
