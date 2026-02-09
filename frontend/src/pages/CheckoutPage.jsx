import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header, Footer } from '../components/Layout';
import { Navigation } from '../components/Navigation';
import { PageTransition } from '../components/Animations';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const DEFAULT_CARS = [
  { _id: 'default_0', brand: 'BMW', model: 'M440i xDrive', year: 2024, horsepower: 503, price: 80000 },
  { _id: 'default_1', brand: 'Mercedes-Benz', model: 'AMG C43', year: 2024, horsepower: 402, price: 85000 },
  { _id: 'default_2', brand: 'Audi', model: 'RS7 Avant', year: 2024, horsepower: 661, price: 125000 },
  { _id: 'default_3', brand: 'Porsche', model: '911 Turbo S', year: 2024, horsepower: 640, price: 210000 },
  { _id: 'default_4', brand: 'Lamborghini', model: 'Revuelto', year: 2024, horsepower: 1001, price: 550000 },
  { _id: 'default_5', brand: 'Ferrari', model: '812 Superfast', year: 2024, horsepower: 789, price: 450000 },
  { _id: 'default_6', brand: 'Tesla', model: 'Model S Plaid 2024', year: 2024, horsepower: 1080, price: 115000 },
  { _id: 'default_7', brand: 'McLaren', model: 'Artura', year: 2024, horsepower: 680, price: 350000 },
  { _id: 'default_8', brand: 'Bentley', model: 'Continental Speed', year: 2024, horsepower: 667, price: 280000 },
  { _id: 'default_9', brand: 'Bugatti', model: 'Bolide', year: 2024, horsepower: 1600, price: 5000000 },
  { _id: 'default_10', brand: 'Rolls-Royce', model: 'Ghost Black Badge', year: 2024, horsepower: 593, price: 320000 },
  { _id: 'default_11', brand: 'Jaguar', model: 'F-Type 2025', year: 2025, horsepower: 575, price: 105000 },
  { _id: 'default_12', brand: 'Dodge', model: 'Charger Daytona', year: 2024, horsepower: 670, price: 95000 },
  { _id: 'default_13', brand: 'Chevrolet', model: 'Corvette E-Ray', year: 2024, horsepower: 655, price: 120000 },
  { _id: 'ferrari_296gtb_2025', brand: 'Ferrari', model: '296 GTB 2025', year: 2025, horsepower: 660, price: 420000 },
  { _id: 'ferrari_sf90_2025', brand: 'Ferrari', model: 'SF90 Stradale 2025', year: 2025, horsepower: 1000, price: 500000 },
  { _id: 'lamborghini_huracan_tecnica_2025', brand: 'Lamborghini', model: 'Huracán Tecnica 2025', year: 2025, horsepower: 640, price: 330000 },
  { _id: 'mclaren_750s_2025', brand: 'McLaren', model: '750S 2025', year: 2025, horsepower: 750, price: 310000 },
  { _id: 'porsche_911gt3rs_2025', brand: 'Porsche', model: '911 GT3 RS 2025', year: 2025, horsepower: 740, price: 220000 },
  { _id: 'corvette_z06_2025', brand: 'Chevrolet', model: 'Corvette Z06 2025', year: 2025, horsepower: 670, price: 105000 },
  { _id: 'nissan_gtr_2025', brand: 'Nissan', model: 'GT-R 2025', year: 2025, horsepower: 645, price: 120000 },
  { _id: 'toyota_grsupra_2025', brand: 'Toyota', model: 'GR Supra 2025', year: 2025, horsepower: 382, price: 65000 },
  { _id: 'bmw_m4_comp_2025', brand: 'BMW', model: 'M4 Competition 2025', year: 2025, horsepower: 625, price: 105000 },
  { _id: 'mercedes_amggt63s_2025', brand: 'Mercedes-AMG', model: 'GT 63 S 2025', year: 2025, horsepower: 585, price: 160000 },
  { _id: 'astonmartin_vantage_2025', brand: 'Aston Martin', model: 'Vantage 2025', year: 2025, horsepower: 715, price: 185000 },
  { _id: 'dodge_challenger_hellcat_2025', brand: 'Dodge', model: 'Challenger SRT Hellcat 2025', year: 2025, horsepower: 645, price: 72000 },
  { _id: 'audi_a8l_2025', brand: 'Audi', model: 'A8 L 2025', year: 2025, horsepower: 500, price: 105000 },
  { _id: 'lexus_ls500_2025', brand: 'Lexus', model: 'LS 500 2025', year: 2025, horsepower: 590, price: 85000 },
  { _id: 'genesis_g90_2025', brand: 'Genesis', model: 'G90 2025', year: 2025, horsepower: 425, price: 75000 },
  { _id: 'rangerover_vogue_2025', brand: 'Range Rover', model: 'Vogue 2025', year: 2025, horsepower: 525, price: 130000 },
  { _id: 'rollsroyce_cullinan_2025', brand: 'Rolls-Royce', model: 'Cullinan 2025', year: 2025, horsepower: 600, price: 400000 },
  { _id: 'cadillac_escalade_2025', brand: 'Cadillac', model: 'Escalade 2025', year: 2025, horsepower: 420, price: 85000 },
  { _id: 'porsche_cayenne_turbo_2025', brand: 'Porsche', model: 'Cayenne Turbo 2025', year: 2025, horsepower: 680, price: 145000 },
  { _id: 'mercedes_maybach_gls600_2025', brand: 'Mercedes-Maybach', model: 'GLS 600 2025', year: 2025, horsepower: 540, price: 180000 },
  { _id: 'bmw_x7_m60i_2025', brand: 'BMW', model: 'X7 M60i 2025', year: 2025, horsepower: 530, price: 120000 },
  { _id: 'audi_q8_2025', brand: 'Audi', model: 'Q8 2025', year: 2025, horsepower: 507, price: 110000 },
  { _id: 'tesla_modelx_plaid_2025', brand: 'Tesla', model: 'Model X Plaid 2025', year: 2025, horsepower: 1080, price: 125000 },
  { _id: 'tesla_model3_highland_2025', brand: 'Tesla', model: 'Model 3 Highland 2025', year: 2025, horsepower: 490, price: 55000 },
  { _id: 'porsche_taycan_turbos_2025', brand: 'Porsche', model: 'Taycan Turbo S 2025', year: 2025, horsepower: 938, price: 185000 },
  { _id: 'lucid_air_sapphire_2025', brand: 'Lucid', model: 'Air Sapphire 2025', year: 2025, horsepower: 1234, price: 165000 },
  { _id: 'mercedes_eqs580_2025', brand: 'Mercedes-Benz', model: 'EQS 580 2025', year: 2025, horsepower: 516, price: 145000 },
  { _id: 'bmw_i7_2025', brand: 'BMW', model: 'i7 2025', year: 2025, horsepower: 536, price: 140000 },
  { _id: 'audi_etron_gt_2025', brand: 'Audi', model: 'e-tron GT 2025', year: 2025, horsepower: 912, price: 155000 },
  { _id: 'hyundai_ioniq5n_2025', brand: 'Hyundai', model: 'Ioniq 5 N 2025', year: 2025, horsepower: 641, price: 70000 },
  { _id: 'kia_ev9_2025', brand: 'Kia', model: 'EV9 2025', year: 2025, horsepower: 541, price: 80000 },
  { _id: 'volvo_ex90_2025', brand: 'Volvo', model: 'EX90 2025', year: 2025, horsepower: 510, price: 85000 },
  { _id: 'rivian_r1s_2025', brand: 'Rivian', model: 'R1S 2025', year: 2025, horsepower: 850, price: 75000 },
  { _id: 'byd_seal_2025', brand: 'BYD', model: 'Seal 2025', year: 2025, horsepower: 420, price: 45000 },
  { _id: 'polestar_4_2025', brand: 'Polestar', model: '4 2025', year: 2025, horsepower: 402, price: 72000 },
  { _id: 'toyota_corolla_2025', brand: 'Toyota', model: 'Corolla 2025', year: 2025, horsepower: 168, price: 28000 },
  { _id: 'toyota_yaris_2025', brand: 'Toyota', model: 'Yaris 2025', year: 2025, horsepower: 120, price: 18000 },
  { _id: 'hyundai_elantra_2025', brand: 'Hyundai', model: 'Elantra 2025', year: 2025, horsepower: 147, price: 25000 },
  { _id: 'hyundai_tucson_2025', brand: 'Hyundai', model: 'Tucson 2025', year: 2025, horsepower: 187, price: 32000 },
  { _id: 'kia_sportage_2025', brand: 'Kia', model: 'Sportage 2025', year: 2025, horsepower: 187, price: 30000 },
];

export const CheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const carId = searchParams.get('carId');
  
  const [car, setCar] = useState(null);

  useEffect(() => {
    const selectedCar = DEFAULT_CARS.find(c => c._id === carId);
    if (selectedCar) {
      setCar(selectedCar);
    } else {
      navigate('/cars');
    }
  }, [carId, navigate]);

  if (!car) {
    return (
      <PageTransition>
        <Navigation />
        <div className="text-center py-12">
          <p className="text-red-600">Loading...</p>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navigation />
      
      <div className="max-w-2xl mx-auto px-2 sm:px-3 py-2 sm:py-4">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/car-detail?carId=${car._id}`)}
          className="flex items-center gap-2 text-red-600 hover:text-red-500 mb-3 font-semibold transition text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Order Summary */}
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between pb-2 border-b border-gray-700 text-sm sm:text-base">
                <span className="text-gray-300">Vehicle</span>
                <span className="text-white font-semibold">{car.brand} {car.model}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-700 text-sm sm:text-base">
                <span className="text-gray-300">Year</span>
                <span className="text-white font-semibold">{car.year}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-gray-700 text-sm sm:text-base">
                <span className="text-gray-300">Power</span>
                <span className="text-white font-semibold">{car.horsepower} HP</span>
              </div>
              <div className="flex justify-between bg-red-900 bg-opacity-20 rounded-lg p-3 mt-3">
                <span className="text-gray-200 font-semibold text-base sm:text-lg">Total</span>
                <span className="text-red-500 text-lg sm:text-xl font-bold">${car.price.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Payment Method</h3>
            
            {/* QR Code */}
            <div className="bg-white rounded-lg p-3 sm:p-4 mb-3 flex justify-center">
              <img 
                src="/images/Instapay.jpg" 
                alt="Instapay QR Code" 
                className="w-40 sm:w-48 h-40 sm:h-48 object-contain"
              />
            </div>

            <p className="text-gray-300 text-center mb-3 text-sm">Scan the QR code to complete payment</p>
          </div>

          {/* Info */}
          <div className="bg-gray-900 rounded-lg p-3 sm:p-4 border border-gray-800">
            <h4 className="text-white font-bold mb-2 text-sm">Payment Information</h4>
            <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
              <li>Secure payment via Instapay</li>
              <li>Order confirmation within 24 hours</li>
              <li>No hidden charges</li>
            </ul>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/cars')}
            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 sm:py-3 rounded-lg font-semibold transition text-sm sm:text-base"
          >
            Back to Catalog
          </motion.button>
        </motion.div>
      </div>

      <Footer />
    </PageTransition>
  );
};
