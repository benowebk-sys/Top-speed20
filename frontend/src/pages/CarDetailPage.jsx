import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { carService } from '../services/api';
import { Header, Footer } from '../components/Layout';
import { Navigation } from '../components/Navigation';
import { PageTransition } from '../components/Animations';
import { Zap, Gauge, Fuel, Wrench, ArrowLeft, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

export const CarDetailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const carId = searchParams.get('carId');
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // بيانات افتراضية - جميع السيارات
  const DEFAULT_CARS = [
    { _id: 'default_0', brand: 'BMW', model: 'M440i xDrive', year: 2024, engine: { displacement: 2998, cylinders: 6, type: 'Turbocharged Inline-6' }, horsepower: 503, torque: 479, fuelType: 'Petrol', acceleration: 4.2, topSpeed: 250, drivetrain: 'AWD', category: 'Sedan', price: 80000, imageUrl: '/images/cars/bmw-m440i.jpg', description: 'Latest generation M440i with advanced tech' },
    { _id: 'default_1', brand: 'Mercedes-Benz', model: 'AMG C43', year: 2024, engine: { displacement: 1991, cylinders: 4, type: 'Turbocharged Hybrid I4' }, horsepower: 402, torque: 500, fuelType: 'Petrol', acceleration: 4.2, topSpeed: 280, drivetrain: 'AWD', category: 'Sedan', price: 85000, imageUrl: '/images/cars/mercedes-c43.jpg', description: 'New generation AMG C43 with hybrid power' },
    { _id: 'default_2', brand: 'Audi', model: 'RS7 Avant', year: 2024, engine: { displacement: 3996, cylinders: 8, type: 'Turbocharged V8' }, horsepower: 661, torque: 626, fuelType: 'Petrol', acceleration: 3.3, topSpeed: 305, drivetrain: 'AWD', category: 'Sedan', price: 125000, imageUrl: '/images/cars/audi-rs7.jpg', description: 'Latest RS7 Avant with enhanced power output' },
    { _id: 'default_3', brand: 'Porsche', model: '911 Turbo S', year: 2024, engine: { displacement: 3746, cylinders: 6, type: 'Turbocharged Flat-6' }, horsepower: 640, torque: 590, fuelType: 'Petrol', acceleration: 2.6, topSpeed: 330, drivetrain: 'AWD', category: 'Sports', price: 210000, imageUrl: '/images/cars/porsche-911-turbo.jpg', description: '2024 911 Turbo S with next-gen tech' },
    { _id: 'default_4', brand: 'Lamborghini', model: 'Revuelto', year: 2024, engine: { displacement: 5996, cylinders: 12, type: 'Hybrid V12' }, horsepower: 1001, torque: 986, fuelType: 'Hybrid', acceleration: 2.5, topSpeed: 350, drivetrain: 'AWD', category: 'Sports', price: 550000, imageUrl: '/images/cars/lamborghini-revuelto.jpg', description: 'Lamborghini flagship hybrid supercar' },
    { _id: 'default_5', brand: 'Ferrari', model: '812 Superfast', year: 2024, engine: { displacement: 6496, cylinders: 12, type: 'Naturally Aspirated V12' }, horsepower: 789, torque: 718, fuelType: 'Petrol', acceleration: 2.9, topSpeed: 320, drivetrain: 'RWD', category: 'Sports', price: 450000, imageUrl: '/images/cars/ferrari-812.jpg', description: 'Ferrari 812 Superfast with V12 power' },
    { _id: 'default_6', brand: 'Tesla', model: 'Model S Plaid 2024', year: 2024, engine: { displacement: 0, cylinders: 0, type: 'Electric Triple Motor' }, horsepower: 1080, torque: 1420, fuelType: 'Electric', acceleration: 1.89, topSpeed: 330, drivetrain: 'AWD', category: 'Sedan', price: 115000, imageUrl: '/images/cars/tesla-model-s-2024.jpg', description: 'Refreshed Model S Plaid with improved performance' },
    { _id: 'default_7', brand: 'McLaren', model: 'Artura', year: 2024, engine: { displacement: 3994, cylinders: 8, type: 'Hybrid V8' }, horsepower: 680, torque: 720, fuelType: 'Hybrid', acceleration: 2.8, topSpeed: 330, drivetrain: 'RWD', category: 'Sports', price: 350000, imageUrl: '/images/cars/mclaren-artura.jpg', description: 'McLaren hybrid supercar with groundbreaking tech' },
    { _id: 'default_8', brand: 'Bentley', model: 'Continental Speed', year: 2024, engine: { displacement: 5950, cylinders: 12, type: 'Twin-Turbocharged W12' }, horsepower: 667, torque: 738, fuelType: 'Petrol', acceleration: 3.5, topSpeed: 335, drivetrain: 'AWD', category: 'Coupe', price: 280000, imageUrl: '/images/cars/bentley-speed.jpg', description: 'Latest Bentley Continental Speed with ultimate luxury' },
    { _id: 'default_9', brand: 'Bugatti', model: 'Bolide', year: 2024, engine: { displacement: 7993, cylinders: 16, type: 'Quad-Turbocharged W16' }, horsepower: 1600, torque: 1200, fuelType: 'Petrol', acceleration: 2.17, topSpeed: 500, drivetrain: 'AWD', category: 'Sports', price: 5000000, imageUrl: '/images/cars/bugatti-bolide.jpg', description: 'Bugatti Bolide - fastest hypercar ever created' },
    { _id: 'default_10', brand: 'Rolls-Royce', model: 'Ghost Black Badge', year: 2024, engine: { displacement: 5950, cylinders: 12, type: 'Twin-Turbocharged V12' }, horsepower: 593, torque: 664, fuelType: 'Petrol', acceleration: 4.6, topSpeed: 250, drivetrain: 'AWD', category: 'Sedan', price: 320000, imageUrl: '/images/cars/rolls-royce-ghost-bb.jpg', description: 'Rolls-Royce Ghost Black Badge with exclusive styling' },
    { _id: 'default_11', brand: 'Jaguar', model: 'F-Type 2025', year: 2025, engine: { displacement: 2997, cylinders: 6, type: 'Turbocharged Inline-6' }, horsepower: 575, torque: 531, fuelType: 'Petrol', acceleration: 3.5, topSpeed: 305, drivetrain: 'RWD', category: 'Sports', price: 105000, imageUrl: '/images/cars/jaguar-f-type-2025.jpg', description: 'New generation Jaguar F-Type with modern design' },
    { _id: 'default_12', brand: 'Dodge', model: 'Charger Daytona', year: 2024, engine: { displacement: 0, cylinders: 0, type: 'Electric Dual Motor' }, horsepower: 670, torque: 740, fuelType: 'Electric', acceleration: 3.3, topSpeed: 300, drivetrain: 'AWD', category: 'Coupe', price: 95000, imageUrl: '/images/cars/dodge-charger-daytona.jpg', description: 'New Dodge Charger Daytona EV muscle car' },
    { _id: 'default_13', brand: 'Chevrolet', model: 'Corvette E-Ray', year: 2024, engine: { displacement: 5498, cylinders: 8, type: 'Hybrid V8' }, horsepower: 655, torque: 667, fuelType: 'Hybrid', acceleration: 2.5, topSpeed: 330, drivetrain: 'AWD', category: 'Sports', price: 120000, imageUrl: '/images/cars/corvette-e-ray.jpg', description: 'Chevrolet Corvette E-Ray hybrid supercar' },
    { _id: 'ferrari_296gtb_2025', brand: 'Ferrari', model: '296 GTB 2025', year: 2025, horsepower: 660, torque: 565, acceleration: 3.1, topSpeed: 330, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 420000, imageUrl: '/images/cars/ferrari-296gtb-2025.jpg', description: 'Ferrari 296 GTB - Twin-turbo V6 masterpiece', engine: { displacement: 2992, cylinders: 6, type: 'Turbocharged V6' } },
    { _id: 'ferrari_sf90_2025', brand: 'Ferrari', model: 'SF90 Stradale 2025', year: 2025, horsepower: 1000, torque: 900, acceleration: 2.5, topSpeed: 340, fuelType: 'Hybrid', drivetrain: 'AWD', category: 'Sports', price: 500000, imageUrl: '/images/cars/ferrari-sf90-2025.jpg', description: 'Ferrari SF90 Stradale - First hybrid V8 Ferrari', engine: { displacement: 3902, cylinders: 8, type: 'Hybrid V8' } },
    { _id: 'lamborghini_huracan_tecnica_2025', brand: 'Lamborghini', model: 'Huracán Tecnica 2025', year: 2025, horsepower: 640, torque: 565, acceleration: 2.99, topSpeed: 325, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 330000, imageUrl: '/images/cars/lamborghini-huracan-tecnica-2025.jpg', description: 'Lamborghini Huracán Tecnica - Track-focused', engine: { displacement: 5204, cylinders: 10, type: 'Naturally Aspirated V10' } },
    { _id: 'mclaren_750s_2025', brand: 'McLaren', model: '750S 2025', year: 2025, horsepower: 750, torque: 800, acceleration: 2.8, topSpeed: 330, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 310000, imageUrl: '/images/cars/mclaren-750s-2025.jpg', description: 'McLaren 750S - Next-gen supercar', engine: { displacement: 3994, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'porsche_911gt3rs_2025', brand: 'Porsche', model: '911 GT3 RS 2025', year: 2025, horsepower: 740, torque: 770, acceleration: 3.2, topSpeed: 340, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 220000, imageUrl: '/images/cars/porsche-911-gt3-rs-2025.jpg', description: 'Porsche 911 GT3 RS - Track-focused', engine: { displacement: 3996, cylinders: 6, type: 'Naturally Aspirated H6' } },
    { _id: 'corvette_z06_2025', brand: 'Chevrolet', model: 'Corvette Z06 2025', year: 2025, horsepower: 670, torque: 610, acceleration: 2.6, topSpeed: 330, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 105000, imageUrl: '/images/cars/chevrolet-corvette-z06-2025.jpg', description: 'Chevrolet Corvette Z06 - American supercar', engine: { displacement: 5498, cylinders: 8, type: 'Naturally Aspirated V8' } },
    { _id: 'nissan_gtr_2025', brand: 'Nissan', model: 'GT-R 2025', year: 2025, horsepower: 645, torque: 652, acceleration: 2.5, topSpeed: 330, fuelType: 'Petrol', drivetrain: 'AWD', category: 'Sports', price: 120000, imageUrl: '/images/cars/nissan-gtr-2025.jpg', description: 'Nissan GT-R - Japanese performance legend', engine: { displacement: 3799, cylinders: 6, type: 'Twin-Turbocharged V6' } },
    { _id: 'toyota_grsupra_2025', brand: 'Toyota', model: 'GR Supra 2025', year: 2025, horsepower: 382, torque: 500, acceleration: 3.9, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 65000, imageUrl: '/images/cars/toyota-gr-supra-2025.jpg', description: 'Toyota GR Supra - Lightweight sports coupe', engine: { displacement: 2997, cylinders: 6, type: 'Twin-Turbocharged I6' } },
    { _id: 'bmw_m4_comp_2025', brand: 'BMW', model: 'M4 Competition 2025', year: 2025, horsepower: 625, torque: 750, acceleration: 3.8, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'AWD', category: 'Sedan', price: 105000, imageUrl: '/images/cars/bmw-m4-competition-2025.jpg', description: 'BMW M4 Competition - Twin-turbo sedan', engine: { displacement: 2993, cylinders: 6, type: 'Twin-Turbocharged I6' } },
    { _id: 'mercedes_amggt63s_2025', brand: 'Mercedes-AMG', model: 'GT 63 S 2025', year: 2025, horsepower: 585, torque: 900, acceleration: 3.2, topSpeed: 315, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Coupe', price: 160000, imageUrl: '/images/cars/mercedes-amg-gt-63s-2025.jpg', description: 'Mercedes-AMG GT 63 S - Performance coupe', engine: { displacement: 3982, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'astonmartin_vantage_2025', brand: 'Aston Martin', model: 'Vantage 2025', year: 2025, horsepower: 715, torque: 753, acceleration: 3.5, topSpeed: 330, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sports', price: 185000, imageUrl: '/images/cars/aston-martin-vantage-2025.jpg', description: 'Aston Martin Vantage - British elegance', engine: { displacement: 4000, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'dodge_challenger_hellcat_2025', brand: 'Dodge', model: 'Challenger SRT Hellcat 2025', year: 2025, horsepower: 645, torque: 925, acceleration: 3.4, topSpeed: 290, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Coupe', price: 72000, imageUrl: '/images/cars/dodge-challenger-hellcat-2025.jpg', description: 'Dodge Challenger SRT Hellcat - Muscle car', engine: { displacement: 6204, cylinders: 8, type: 'Supercharged V8' } },
    { _id: 'audi_a8l_2025', brand: 'Audi', model: 'A8 L 2025', year: 2025, horsepower: 500, torque: 660, acceleration: 3.9, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'AWD', category: 'Sedan', price: 105000, imageUrl: '/images/cars/audi-a8l-2025.jpg', description: 'Audi A8 L - Tech-forward luxury sedan', engine: { displacement: 2995, cylinders: 6, type: 'Twin-Turbocharged V6' } },
    { _id: 'lexus_ls500_2025', brand: 'Lexus', model: 'LS 500 2025', year: 2025, horsepower: 590, torque: 650, acceleration: 4.9, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sedan', price: 85000, imageUrl: '/images/cars/lexus-ls500-2025.jpg', description: 'Lexus LS 500 - Japanese luxury', engine: { displacement: 3456, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'genesis_g90_2025', brand: 'Genesis', model: 'G90 2025', year: 2025, horsepower: 425, torque: 520, acceleration: 4.9, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'RWD', category: 'Sedan', price: 75000, imageUrl: '/images/cars/genesis-g90-2025.jpg', description: 'Genesis G90 - Luxury meets value', engine: { displacement: 3798, cylinders: 6, type: 'Twin-Turbocharged V6' } },
    { _id: 'rangerover_vogue_2025', brand: 'Range Rover', model: 'Vogue 2025', year: 2025, horsepower: 525, torque: 745, acceleration: 4.4, topSpeed: 240, fuelType: 'Petrol', drivetrain: 'AWD', category: 'SUV', price: 130000, imageUrl: '/images/cars/range-rover-vogue-2025.jpg', description: 'Range Rover Vogue - British luxury SUV', engine: { displacement: 4395, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'rollsroyce_cullinan_2025', brand: 'Rolls-Royce', model: 'Cullinan 2025', year: 2025, horsepower: 600, torque: 900, acceleration: 4.5, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'AWD', category: 'SUV', price: 400000, imageUrl: '/images/cars/rolls-royce-cullinan-2025.jpg', description: 'Rolls-Royce Cullinan - Ultimate luxury SUV', engine: { displacement: 6592, cylinders: 12, type: 'Twin-Turbocharged V12' } },
    { _id: 'cadillac_escalade_2025', brand: 'Cadillac', model: 'Escalade 2025', year: 2025, horsepower: 420, torque: 620, acceleration: 6.5, topSpeed: 230, fuelType: 'Petrol', drivetrain: '4WD', category: 'SUV', price: 85000, imageUrl: '/images/cars/cadillac-escalade-2025.jpg', description: 'Cadillac Escalade - American luxury SUV', engine: { displacement: 5996, cylinders: 8, type: 'Naturally Aspirated V8' } },
    { _id: 'porsche_cayenne_turbo_2025', brand: 'Porsche', model: 'Cayenne Turbo 2025', year: 2025, horsepower: 680, torque: 900, acceleration: 3.9, topSpeed: 290, fuelType: 'Petrol', drivetrain: 'AWD', category: 'SUV', price: 145000, imageUrl: '/images/cars/porsche-cayenne-turbo-2025.jpg', description: 'Porsche Cayenne Turbo - Performance SUV', engine: { displacement: 3996, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'mercedes_maybach_gls600_2025', brand: 'Mercedes-Maybach', model: 'GLS 600 2025', year: 2025, horsepower: 540, torque: 900, acceleration: 4.4, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'AWD', category: 'SUV', price: 180000, imageUrl: '/images/cars/mercedes-maybach-gls600-2025.jpg', description: 'Mercedes-Maybach GLS 600 - Luxury SUV', engine: { displacement: 4000, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'bmw_x7_m60i_2025', brand: 'BMW', model: 'X7 M60i 2025', year: 2025, horsepower: 530, torque: 553, acceleration: 4.7, topSpeed: 250, fuelType: 'Petrol', drivetrain: 'AWD', category: 'SUV', price: 120000, imageUrl: '/images/cars/bmw-x7-m60i-2025.jpg', description: 'BMW X7 M60i - Premium luxury SUV', engine: { displacement: 3998, cylinders: 12, type: 'Twin-Turbocharged V12' } },
    { _id: 'audi_q8_2025', brand: 'Audi', model: 'Q8 2025', year: 2025, horsepower: 507, torque: 665, acceleration: 4.0, topSpeed: 240, fuelType: 'Petrol', drivetrain: 'AWD', category: 'SUV', price: 110000, imageUrl: '/images/cars/audi-q8-2025.jpg', description: 'Audi Q8 - Stylish luxury SUV', engine: { displacement: 3996, cylinders: 8, type: 'Twin-Turbocharged V8' } },
    { _id: 'tesla_modelx_plaid_2025', brand: 'Tesla', model: 'Model X Plaid 2025', year: 2025, horsepower: 1080, torque: 1470, acceleration: 2.5, topSpeed: 330, fuelType: 'Electric', drivetrain: 'AWD', category: 'SUV', price: 125000, imageUrl: '/images/cars/tesla-model-x-plaid-2025.jpg', description: 'Tesla Model X Plaid - Electric performance', engine: { displacement: 0, cylinders: 0, type: 'Triple Motor Electric' } },
    { _id: 'tesla_model3_highland_2025', brand: 'Tesla', model: 'Model 3 Highland 2025', year: 2025, horsepower: 490, torque: 671, acceleration: 4.2, topSpeed: 225, fuelType: 'Electric', drivetrain: 'AWD', category: 'Sedan', price: 55000, imageUrl: '/images/cars/tesla-model3-highland-2025.jpg', description: 'Tesla Model 3 Highland - Electric daily driver', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'porsche_taycan_turbos_2025', brand: 'Porsche', model: 'Taycan Turbo S 2025', year: 2025, horsepower: 938, torque: 1050, acceleration: 2.8, topSpeed: 260, fuelType: 'Electric', drivetrain: 'AWD', category: 'Sedan', price: 185000, imageUrl: '/images/cars/porsche-taycan-turbo-s-2025.jpg', description: 'Porsche Taycan Turbo S - Electric performance', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'lucid_air_sapphire_2025', brand: 'Lucid', model: 'Air Sapphire 2025', year: 2025, horsepower: 1234, torque: 1680, acceleration: 1.89, topSpeed: 330, fuelType: 'Electric', drivetrain: 'AWD', category: 'Sedan', price: 165000, imageUrl: '/images/cars/lucid-air-sapphire-2025.jpg', description: 'Lucid Air Sapphire - Premium electric sedan', engine: { displacement: 0, cylinders: 0, type: 'Triple Motor Electric' } },
    { _id: 'mercedes_eqs580_2025', brand: 'Mercedes-Benz', model: 'EQS 580 2025', year: 2025, horsepower: 516, torque: 855, acceleration: 4.6, topSpeed: 250, fuelType: 'Electric', drivetrain: 'AWD', category: 'Sedan', price: 145000, imageUrl: '/images/cars/mercedes-eqs580-2025.jpg', description: 'Mercedes-Benz EQS 580 - Electric luxury sedan', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'bmw_i7_2025', brand: 'BMW', model: 'i7 2025', year: 2025, horsepower: 536, torque: 749, acceleration: 4.6, topSpeed: 250, fuelType: 'Electric', drivetrain: 'AWD', category: 'Sedan', price: 140000, imageUrl: '/images/cars/bmw-i7-2025.jpg', description: 'BMW i7 - Electric luxury flagship', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'audi_etron_gt_2025', brand: 'Audi', model: 'e-tron GT 2025', year: 2025, horsepower: 912, torque: 1050, acceleration: 3.4, topSpeed: 245, fuelType: 'Electric', drivetrain: 'AWD', category: 'Coupe', price: 155000, imageUrl: '/images/cars/audi-e-tron-gt-2025.jpg', description: 'Audi e-tron GT - Electric performance coupe', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'hyundai_ioniq5n_2025', brand: 'Hyundai', model: 'Ioniq 5 N 2025', year: 2025, horsepower: 641, torque: 740, acceleration: 3.5, topSpeed: 260, fuelType: 'Electric', drivetrain: 'AWD', category: 'SUV', price: 70000, imageUrl: '/images/cars/hyundai-ioniq5n-2025.jpg', description: 'Hyundai Ioniq 5 N - Performance electric crossover', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'kia_ev9_2025', brand: 'Kia', model: 'EV9 2025', year: 2025, horsepower: 541, torque: 700, acceleration: 4.7, topSpeed: 200, fuelType: 'Electric', drivetrain: 'AWD', category: 'SUV', price: 80000, imageUrl: '/images/cars/kia-ev9-2025.jpg', description: 'Kia EV9 - Three-row electric SUV', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'volvo_ex90_2025', brand: 'Volvo', model: 'EX90 2025', year: 2025, horsepower: 510, torque: 910, acceleration: 4.9, topSpeed: 200, fuelType: 'Electric', drivetrain: 'AWD', category: 'SUV', price: 85000, imageUrl: '/images/cars/volvo-ex90-2025.jpg', description: 'Volvo EX90 - Scandinavian electric luxury', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'rivian_r1s_2025', brand: 'Rivian', model: 'R1S 2025', year: 2025, horsepower: 850, torque: 1025, acceleration: 3.0, topSpeed: 225, fuelType: 'Electric', drivetrain: '4WD', category: 'SUV', price: 75000, imageUrl: '/images/cars/rivian-r1s-2025.jpg', description: 'Rivian R1S - Adventure-ready electric SUV', engine: { displacement: 0, cylinders: 0, type: 'Triple Motor Electric' } },
    { _id: 'byd_seal_2025', brand: 'BYD', model: 'Seal 2025', year: 2025, horsepower: 420, torque: 500, acceleration: 5.9, topSpeed: 180, fuelType: 'Electric', drivetrain: 'FWD', category: 'Sedan', price: 45000, imageUrl: '/images/cars/byd-seal-2025.jpg', description: 'BYD Seal - Affordable electric sedan', engine: { displacement: 0, cylinders: 0, type: 'Single Motor Electric' } },
    { _id: 'polestar_4_2025', brand: 'Polestar', model: '4 2025', year: 2025, horsepower: 402, torque: 630, acceleration: 4.2, topSpeed: 210, fuelType: 'Electric', drivetrain: 'AWD', category: 'SUV', price: 72000, imageUrl: '/images/cars/polestar-4-2025.jpg', description: 'Polestar 4 - Electric coupe SUV', engine: { displacement: 0, cylinders: 0, type: 'Dual Motor Electric' } },
    { _id: 'toyota_corolla_2025', brand: 'Toyota', model: 'Corolla 2025', year: 2025, horsepower: 168, torque: 203, acceleration: 8.2, topSpeed: 190, fuelType: 'Petrol', drivetrain: 'FWD', category: 'Sedan', price: 28000, imageUrl: '/images/cars/toyota-corolla-2025.jpg', description: 'Toyota Corolla - Reliable daily driver', engine: { displacement: 1798, cylinders: 4, type: 'Naturally Aspirated I4' } },
    { _id: 'toyota_yaris_2025', brand: 'Toyota', model: 'Yaris 2025', year: 2025, horsepower: 120, torque: 145, acceleration: 9.6, topSpeed: 180, fuelType: 'Petrol', drivetrain: 'FWD', category: 'Hatchback', price: 18000, imageUrl: '/images/cars/toyota-yaris-2025.jpg', description: 'Toyota Yaris - Compact city car', engine: { displacement: 1496, cylinders: 3, type: 'Naturally Aspirated I3' } },
    { _id: 'hyundai_elantra_2025', brand: 'Hyundai', model: 'Elantra 2025', year: 2025, horsepower: 147, torque: 179, acceleration: 8.9, topSpeed: 190, fuelType: 'Petrol', drivetrain: 'FWD', category: 'Sedan', price: 25000, imageUrl: '/images/cars/hyundai-elantra-2025.jpg', description: 'Hyundai Elantra - Affordable sedan', engine: { displacement: 1599, cylinders: 4, type: 'Naturally Aspirated I4' } },
    { _id: 'hyundai_tucson_2025', brand: 'Hyundai', model: 'Tucson 2025', year: 2025, horsepower: 187, torque: 241, acceleration: 8.5, topSpeed: 190, fuelType: 'Petrol', drivetrain: 'FWD', category: 'SUV', price: 32000, imageUrl: '/images/cars/hyundai-tucson-2025.jpg', description: 'Hyundai Tucson - Popular compact SUV', engine: { displacement: 1999, cylinders: 4, type: 'Turbocharged I4' } },
    { _id: 'kia_sportage_2025', brand: 'Kia', model: 'Sportage 2025', year: 2025, horsepower: 187, torque: 241, acceleration: 8.0, topSpeed: 190, fuelType: 'Petrol', drivetrain: 'FWD', category: 'SUV', price: 30000, imageUrl: '/images/cars/kia-sportage-2025.jpg', description: 'Kia Sportage - Stylish SUV value', engine: { displacement: 1999, cylinders: 4, type: 'Turbocharged I4' } },
  ];

  useEffect(() => {
    const fetchCar = async () => {
      try {
        if (!carId) {
          setError('No car ID provided');
          setLoading(false);
          return;
        }

        // محاولة جلب من API أولاً
        try {
          const response = await carService.getCarById(carId);
          setCar(response.data.car);
        } catch (apiErr) {
          // إذا فشل، استخدم البيانات الافتراضية
          const defaultCar = DEFAULT_CARS.find(c => c._id === carId);
          if (defaultCar) {
            setCar(defaultCar);
          } else {
            setError('Car not found');
          }
        }
      } catch (err) {
        setError('Failed to load car details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  if (loading) {
    return (
      <PageTransition>
        <Navigation />
        <div className="text-center py-24">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading car details...</p>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  if (error || !car) {
    return (
      <PageTransition>
        <Navigation />
        <div className="text-center py-24">
          <p className="text-red-600 font-semibold text-lg">{error || 'Car not found'}</p>
          <button
            onClick={() => navigate('/cars')}
            className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Back to Cars
          </button>
        </div>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-2 sm:px-3 py-2 sm:py-4">
        {/* زر العودة */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/cars')}
          className="flex items-center gap-2 text-red-600 hover:text-red-500 mb-3 font-semibold transition text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3" />
          Back
        </motion.button>

        {/* تخطيط عمودي - كل شيء فوق بعضه */}
        <div className="flex flex-col gap-2 sm:gap-4">
          {/* الصورة */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden shadow-lg"
          >
            {car.imageUrl ? (
              <img
                src={car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 sm:h-64 md:h-72 object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-64 flex items-center justify-center">
                <Wrench className="w-10 h-10 text-gray-600" />
              </div>
            )}
          </motion.div>

          {/* التفاصيل الرئيسية */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            {/* الرأس */}
            <div className="mb-2 sm:mb-3">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5">
                {car.brand} {car.model}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-red-600 font-semibold mb-1">
                ${car.price?.toLocaleString() || 'N/A'}
              </p>
              <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">{car.description}</p>
              <div className="flex gap-1.5 mt-2">
                <span className="px-2 py-0.5 bg-red-600 text-white rounded font-semibold text-[10px] sm:text-xs">
                  {car.year}
                </span>
                <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded font-semibold text-[10px] sm:text-xs">
                  {car.category}
                </span>
              </div>
            </div>

            {/* مواصفات الأداء */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
              <div className="bg-gray-900 rounded-lg p-1.5 sm:p-2 border border-gray-800">
                <Zap className="w-3 h-3 text-red-600 mb-0.5" />
                <p className="text-gray-400 text-[9px] sm:text-xs">HP</p>
                <p className="text-white text-xs sm:text-sm font-bold">{car.horsepower}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-1.5 sm:p-2 border border-gray-800">
                <Droplets className="w-3 h-3 text-blue-600 mb-0.5" />
                <p className="text-gray-400 text-[9px] sm:text-xs">Torque</p>
                <p className="text-white text-xs sm:text-sm font-bold">{car.torque}</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-1.5 sm:p-2 border border-gray-800">
                <Gauge className="w-3 h-3 text-orange-600 mb-0.5" />
                <p className="text-gray-400 text-[9px] sm:text-xs">0-100</p>
                <p className="text-white text-xs sm:text-sm font-bold">{typeof car.acceleration === 'number' ? car.acceleration.toFixed(1) : (parseFloat(car.acceleration) || 0).toFixed(1)}s</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-1.5 sm:p-2 border border-gray-800">
                <Fuel className="w-3 h-3 text-green-600 mb-0.5" />
                <p className="text-gray-400 text-[9px] sm:text-xs">Top Speed</p>
                <p className="text-white text-xs sm:text-sm font-bold">{car.topSpeed}</p>
              </div>
            </div>

            {/* تفاصيل المحرك */}
            <div className="bg-gray-900 rounded-lg p-2 sm:p-3 border border-gray-800">
              <h3 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-red-600" />
                Engine
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2 text-[9px] sm:text-xs">
                <div>
                  <p className="text-gray-400">Type</p>
                  <p className="text-white font-semibold line-clamp-1">{car.engine.type}</p>
                </div>
                <div>
                  <p className="text-gray-400">Cylinders</p>
                  <p className="text-white font-semibold">{car.engine.cylinders}</p>
                </div>
                <div>
                  <p className="text-gray-400">Displacement</p>
                  <p className="text-white font-semibold">{car.engine.displacement} cc</p>
                </div>
                <div>
                  <p className="text-gray-400">Fuel</p>
                  <p className="text-white font-semibold">{car.fuelType}</p>
                </div>
                <div>
                  <p className="text-gray-400">Drivetrain</p>
                  <p className="text-white font-semibold">{car.drivetrain}</p>
                </div>
              </div>
            </div>

            {/* زر الشراء */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/checkout?carId=${car._id}`)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 sm:py-4 font-bold rounded-lg transition text-base sm:text-lg"
              >
                Buy Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/configurator?carId=${car._id}`)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 sm:py-4 font-bold rounded-lg transition text-base sm:text-lg border border-gray-700"
              >
                Customize
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </PageTransition>
  );
};
