import React, { useEffect, useState } from 'react';
import { carService } from '../services/api';
import { AnimatedCard, PageTransition } from '../components/Animations';
import { Header, Footer } from '../components/Layout';
import { Navigation } from '../components/Navigation';
import { Zap, Gauge, Fuel, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// البيانات الافتراضية للسيارات الحديثة 2024-2025
const DEFAULT_CARS = [
  {
    _id: 'default_0',
    brand: 'BMW',
    model: 'M440i xDrive',
    year: 2024,
    horsepower: 503,
    torque: 479,
    acceleration: 4.2,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 80000,
    imageUrl: '/images/cars/bmw-m440i.jpg',
    description: 'Latest generation M440i with advanced tech',
    isVisible: true,
  },
  {
    _id: 'default_1',
    brand: 'Mercedes-Benz',
    model: 'AMG C43',
    year: 2024,
    horsepower: 402,
    torque: 500,
    acceleration: 4.2,
    topSpeed: 280,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 85000,
    imageUrl: '/images/cars/mercedes-c43.jpg',
    description: 'New generation AMG C43 with hybrid power',
    isVisible: true,
  },
  {
    _id: 'default_2',
    brand: 'Audi',
    model: 'RS7 Avant',
    year: 2024,
    horsepower: 661,
    torque: 626,
    acceleration: 3.3,
    topSpeed: 305,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 125000,
    imageUrl: '/images/cars/audi-rs7.jpg',
    description: 'Latest RS7 Avant with enhanced power output',
    isVisible: true,
  },
  {
    _id: 'default_3',
    brand: 'Porsche',
    model: '911 Turbo S',
    year: 2024,
    horsepower: 640,
    torque: 590,
    acceleration: 2.6,
    topSpeed: 330,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sports',
    price: 210000,
    imageUrl: '/images/cars/porsche-911-turbo.jpg',
    description: '2024 911 Turbo S with next-gen tech',
    isVisible: true,
  },
  {
    _id: 'default_4',
    brand: 'Lamborghini',
    model: 'Revuelto',
    year: 2024,
    horsepower: 1001,
    torque: 986,
    acceleration: 2.5,
    topSpeed: 350,
    fuelType: 'Hybrid',
    drivetrain: 'AWD',
    category: 'Sports',
    price: 550000,
    imageUrl: '/images/cars/lamborghini-revuelto.jpg',
    description: 'Lamborghini flagship hybrid supercar',
    isVisible: true,
  },
  {
    _id: 'default_5',
    brand: 'Ferrari',
    model: '812 Superfast',
    year: 2024,
    horsepower: 789,
    torque: 718,
    acceleration: 2.9,
    topSpeed: 320,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 450000,
    imageUrl: '/images/cars/ferrari-812.jpg',
    description: 'Ferrari 812 Superfast with V12 power',
    isVisible: true,
  },
  {
    _id: 'default_6',
    brand: 'Tesla',
    model: 'Model S Plaid 2024',
    year: 2024,
    horsepower: 1080,
    torque: 1420,
    acceleration: 1.89,
    topSpeed: 330,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 115000,
    imageUrl: '/images/cars/tesla-model-s-2024.jpg',
    description: 'Refreshed Model S Plaid with improved performance',
    isVisible: true,
  },
  {
    _id: 'default_7',
    brand: 'McLaren',
    model: 'Artura',
    year: 2024,
    horsepower: 680,
    torque: 720,
    acceleration: 2.8,
    topSpeed: 330,
    fuelType: 'Hybrid',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 350000,
    imageUrl: '/images/cars/mclaren-artura.jpg',
    description: 'McLaren hybrid supercar with groundbreaking tech',
    isVisible: true,
  },
  {
    _id: 'default_8',
    brand: 'Bentley',
    model: 'Continental Speed',
    year: 2024,
    horsepower: 667,
    torque: 738,
    acceleration: 3.5,
    topSpeed: 335,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Coupe',
    price: 280000,
    imageUrl: '/images/cars/bentley-speed.jpg',
    description: 'Latest Bentley Continental Speed with ultimate luxury',
    isVisible: true,
  },
  {
    _id: 'default_9',
    brand: 'Bugatti',
    model: 'Bolide',
    year: 2024,
    horsepower: 1600,
    torque: 1200,
    acceleration: 2.17,
    topSpeed: 500,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sports',
    price: 5000000,
    imageUrl: '/images/cars/bugatti-bolide.jpg',
    description: 'Bugatti Bolide - fastest hypercar ever created',
    isVisible: true,
  },
  {
    _id: 'default_10',
    brand: 'Rolls-Royce',
    model: 'Ghost Black Badge',
    year: 2024,
    horsepower: 593,
    torque: 664,
    acceleration: 4.6,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 320000,
    imageUrl: '/images/cars/rolls-royce-ghost-bb.jpg',
    description: 'Rolls-Royce Ghost Black Badge with exclusive styling',
    isVisible: true,
  },
  {
    _id: 'default_11',
    brand: 'Jaguar',
    model: 'F-Type 2025',
    year: 2025,
    horsepower: 575,
    torque: 531,
    acceleration: 3.5,
    topSpeed: 305,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 105000,
    imageUrl: '/images/cars/jaguar-f-type-2025.jpg',
    description: 'New generation Jaguar F-Type with modern design',
    isVisible: true,
  },
  {
    _id: 'default_12',
    brand: 'Dodge',
    model: 'Charger Daytona',
    year: 2024,
    horsepower: 670,
    torque: 740,
    acceleration: 3.3,
    topSpeed: 300,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Coupe',
    price: 95000,
    imageUrl: '/images/cars/dodge-charger-daytona.jpg',
    description: 'New Dodge Charger Daytona EV muscle car',
    isVisible: true,
  },
  {
    _id: 'default_13',
    brand: 'Chevrolet',
    model: 'Corvette E-Ray',
    year: 2024,
    horsepower: 655,
    torque: 667,
    acceleration: 2.5,
    topSpeed: 330,
    fuelType: 'Hybrid',
    drivetrain: 'AWD',
    category: 'Sports',
    price: 120000,
    imageUrl: '/images/cars/corvette-e-ray.jpg',
    description: 'Chevrolet Corvette E-Ray hybrid supercar',
    isVisible: true,
  },
  // Sports Cars - New Models Only
  {
    _id: 'ferrari_296gtb_2025',
    brand: 'Ferrari',
    model: '296 GTB 2025',
    year: 2025,
    horsepower: 660,
    torque: 565,
    acceleration: 3.1,
    topSpeed: 330,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 420000,
    imageUrl: '/images/cars/ferrari-296gtb-2025.jpg',
    description: 'Ferrari 296 GTB - Twin-turbo V6 masterpiece with hybrid technology',
    isVisible: true,
  },
  {
    _id: 'ferrari_sf90_2025',
    brand: 'Ferrari',
    model: 'SF90 Stradale 2025',
    year: 2025,
    horsepower: 1000,
    torque: 900,
    acceleration: 2.5,
    topSpeed: 340,
    fuelType: 'Hybrid',
    drivetrain: 'AWD',
    category: 'Sports',
    price: 500000,
    imageUrl: '/images/cars/ferrari-sf90-2025.jpg',
    description: 'Ferrari SF90 Stradale - First hybrid V8 Ferrari with extreme performance',
    isVisible: true,
  },
  {
    _id: 'lamborghini_huracan_tecnica_2025',
    brand: 'Lamborghini',
    model: 'Huracán Tecnica 2025',
    year: 2025,
    horsepower: 640,
    torque: 565,
    acceleration: 2.99,
    topSpeed: 325,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 330000,
    imageUrl: '/images/cars/lamborghini-huracan-tecnica-2025.jpg',
    description: 'Lamborghini Huracán Tecnica - Track-focused V10 supercar',
    isVisible: true,
  },
  {
    _id: 'mclaren_750s_2025',
    brand: 'McLaren',
    model: '750S 2025',
    year: 2025,
    horsepower: 750,
    torque: 800,
    acceleration: 2.8,
    topSpeed: 330,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 310000,
    imageUrl: '/images/cars/mclaren-750s-2025.jpg',
    description: 'McLaren 750S - Next-gen supercar with refined performance',
    isVisible: true,
  },

  {
    _id: 'porsche_911gt3rs_2025',
    brand: 'Porsche',
    model: '911 GT3 RS 2025',
    year: 2025,
    horsepower: 740,
    torque: 770,
    acceleration: 3.2,
    topSpeed: 340,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 220000,
    imageUrl: '/images/cars/porsche-911-gt3-rs-2025.jpg',
    description: 'Porsche 911 GT3 RS - Track-focused precision engineering',
    isVisible: true,
  },
  {
    _id: 'corvette_z06_2025',
    brand: 'Chevrolet',
    model: 'Corvette Z06 2025',
    year: 2025,
    horsepower: 670,
    torque: 610,
    acceleration: 2.6,
    topSpeed: 330,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 105000,
    imageUrl: '/images/cars/chevrolet-corvette-z06-2025.jpg',
    description: 'Chevrolet Corvette Z06 - American supercar excellence',
    isVisible: true,
  },
  {
    _id: 'nissan_gtr_2025',
    brand: 'Nissan',
    model: 'GT-R 2025',
    year: 2025,
    horsepower: 645,
    torque: 652,
    acceleration: 2.5,
    topSpeed: 330,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sports',
    price: 120000,
    imageUrl: '/images/cars/nissan-gtr-2025.jpg',
    description: 'Nissan GT-R - Japanese performance legend',
    isVisible: true,
  },
  {
    _id: 'toyota_grsupra_2025',
    brand: 'Toyota',
    model: 'GR Supra 2025',
    year: 2025,
    horsepower: 382,
    torque: 500,
    acceleration: 3.9,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 65000,
    imageUrl: '/images/cars/toyota-gr-supra-2025.jpg',
    description: 'Toyota GR Supra - Lightweight sports coupe with BMW power',
    isVisible: true,
  },
  {
    _id: 'bmw_m4_comp_2025',
    brand: 'BMW',
    model: 'M4 Competition 2025',
    year: 2025,
    horsepower: 625,
    torque: 750,
    acceleration: 3.8,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 105000,
    imageUrl: '/images/cars/bmw-m4-competition-2025.jpg',
    description: 'BMW M4 Competition - Twin-turbo performance sedan',
    isVisible: true,
  },

  {
    _id: 'mercedes_amggt63s_2025',
    brand: 'Mercedes-AMG',
    model: 'GT 63 S 2025',
    year: 2025,
    horsepower: 585,
    torque: 900,
    acceleration: 3.2,
    topSpeed: 315,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Coupe',
    price: 160000,
    imageUrl: '/images/cars/mercedes-amg-gt-63s-2025.jpg',
    description: 'Mercedes-AMG GT 63 S - Hand-assembled performance coupe',
    isVisible: true,
  },
  {
    _id: 'astonmartin_vantage_2025',
    brand: 'Aston Martin',
    model: 'Vantage 2025',
    year: 2025,
    horsepower: 715,
    torque: 753,
    acceleration: 3.5,
    topSpeed: 330,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sports',
    price: 185000,
    imageUrl: '/images/cars/aston-martin-vantage-2025.jpg',
    description: 'Aston Martin Vantage - British sports car elegance',
    isVisible: true,
  },
  {
    _id: 'dodge_challenger_hellcat_2025',
    brand: 'Dodge',
    model: 'Challenger SRT Hellcat 2025',
    year: 2025,
    horsepower: 645,
    torque: 925,
    acceleration: 3.4,
    topSpeed: 290,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Coupe',
    price: 72000,
    imageUrl: '/images/cars/dodge-challenger-hellcat-2025.jpg',
    description: 'Dodge Challenger SRT Hellcat - Supercharged American muscle',
    isVisible: true,
  },
  // Luxury Sedans - New Models
  {
    _id: 'audi_a8l_2025',
    brand: 'Audi',
    model: 'A8 L 2025',
    year: 2025,
    horsepower: 500,
    torque: 660,
    acceleration: 3.9,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 105000,
    imageUrl: '/images/cars/audi-a8l-2025.jpg',
    description: 'Audi A8 L - Tech-forward luxury sedan',
    isVisible: true,
  },
  {
    _id: 'lexus_ls500_2025',
    brand: 'Lexus',
    model: 'LS 500 2025',
    year: 2025,
    horsepower: 590,
    torque: 650,
    acceleration: 4.9,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sedan',
    price: 85000,
    imageUrl: '/images/cars/lexus-ls500-2025.jpg',
    description: 'Lexus LS 500 - Japanese luxury perfection',
    isVisible: true,
  },
  {
    _id: 'genesis_g90_2025',
    brand: 'Genesis',
    model: 'G90 2025',
    year: 2025,
    horsepower: 425,
    torque: 520,
    acceleration: 4.9,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'RWD',
    category: 'Sedan',
    price: 75000,
    imageUrl: '/images/cars/genesis-g90-2025.jpg',
    description: 'Genesis G90 - Luxury meets affordability',
    isVisible: true,
  },
  // Luxury SUVs
  {
    _id: 'rangerover_vogue_2025',
    brand: 'Range Rover',
    model: 'Vogue 2025',
    year: 2025,
    horsepower: 525,
    torque: 745,
    acceleration: 4.4,
    topSpeed: 240,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 130000,
    imageUrl: '/images/cars/range-rover-vogue-2025.jpg',
    description: 'Range Rover Vogue - British luxury SUV',
    isVisible: true,
  },

  {
    _id: 'rollsroyce_cullinan_2025',
    brand: 'Rolls-Royce',
    model: 'Cullinan 2025',
    year: 2025,
    horsepower: 600,
    torque: 900,
    acceleration: 4.5,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 400000,
    imageUrl: '/images/cars/rolls-royce-cullinan-2025.jpg',
    description: 'Rolls-Royce Cullinan - Ultimate luxury SUV',
    isVisible: true,
  },
  {
    _id: 'cadillac_escalade_2025',
    brand: 'Cadillac',
    model: 'Escalade 2025',
    year: 2025,
    horsepower: 420,
    torque: 620,
    acceleration: 6.5,
    topSpeed: 230,
    fuelType: 'Petrol',
    drivetrain: '4WD',
    category: 'SUV',
    price: 85000,
    imageUrl: '/images/cars/cadillac-escalade-2025.jpg',
    description: 'Cadillac Escalade - American luxury SUV',
    isVisible: true,
  },
  {
    _id: 'porsche_cayenne_turbo_2025',
    brand: 'Porsche',
    model: 'Cayenne Turbo 2025',
    year: 2025,
    horsepower: 680,
    torque: 900,
    acceleration: 3.9,
    topSpeed: 290,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 145000,
    imageUrl: '/images/cars/porsche-cayenne-turbo-2025.jpg',
    description: 'Porsche Cayenne Turbo - Performance SUV',
    isVisible: true,
  },
  {
    _id: 'mercedes_maybach_gls600_2025',
    brand: 'Mercedes-Maybach',
    model: 'GLS 600 2025',
    year: 2025,
    horsepower: 540,
    torque: 900,
    acceleration: 4.4,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 180000,
    imageUrl: '/images/cars/mercedes-maybach-gls600-2025.jpg',
    description: 'Mercedes-Maybach GLS 600 - Luxury SUV pinnacle',
    isVisible: true,
  },
  {
    _id: 'bmw_x7_m60i_2025',
    brand: 'BMW',
    model: 'X7 M60i 2025',
    year: 2025,
    horsepower: 530,
    torque: 553,
    acceleration: 4.7,
    topSpeed: 250,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 120000,
    imageUrl: '/images/cars/bmw-x7-m60i-2025.jpg',
    description: 'BMW X7 M60i - Premium three-row luxury SUV',
    isVisible: true,
  },
  {
    _id: 'audi_q8_2025',
    brand: 'Audi',
    model: 'Q8 2025',
    year: 2025,
    horsepower: 507,
    torque: 665,
    acceleration: 4.0,
    topSpeed: 240,
    fuelType: 'Petrol',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 110000,
    imageUrl: '/images/cars/audi-q8-2025.jpg',
    description: 'Audi Q8 - Stylish performance luxury SUV',
    isVisible: true,
  },
  // Electric Vehicles - New Models Only
  {
    _id: 'tesla_modelx_plaid_2025',
    brand: 'Tesla',
    model: 'Model X Plaid 2025',
    year: 2025,
    horsepower: 1080,
    torque: 1470,
    acceleration: 2.5,
    topSpeed: 330,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 125000,
    imageUrl: '/images/cars/tesla-model-x-plaid-2025.jpg',
    description: 'Tesla Model X Plaid - Electric SUV performance leader',
    isVisible: true,
  },
  {
    _id: 'tesla_model3_highland_2025',
    brand: 'Tesla',
    model: 'Model 3 Highland 2025',
    year: 2025,
    horsepower: 490,
    torque: 671,
    acceleration: 4.2,
    topSpeed: 225,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 55000,
    imageUrl: '/images/cars/tesla-model3-highland-2025.jpg',
    description: 'Tesla Model 3 Highland - Refreshed daily driver',
    isVisible: true,
  },
  // Electric Vehicles - New Models Only
  {
    _id: 'porsche_taycan_turbos_2025',
    brand: 'Porsche',
    model: 'Taycan Turbo S 2025',
    year: 2025,
    horsepower: 938,
    torque: 1050,
    acceleration: 2.8,
    topSpeed: 260,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 185000,
    imageUrl: '/images/cars/porsche-taycan-turbo-s-2025.jpg',
    description: 'Porsche Taycan Turbo S - German electric performance',
    isVisible: true,
  },
  {
    _id: 'lucid_air_sapphire_2025',
    brand: 'Lucid',
    model: 'Air Sapphire 2025',
    year: 2025,
    horsepower: 1234,
    torque: 1680,
    acceleration: 1.89,
    topSpeed: 330,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 165000,
    imageUrl: '/images/cars/lucid-air-sapphire-2025.jpg',
    description: 'Lucid Air Sapphire - Premium electric sedan',
    isVisible: true,
  },
  {
    _id: 'mercedes_eqs580_2025',
    brand: 'Mercedes-Benz',
    model: 'EQS 580 2025',
    year: 2025,
    horsepower: 516,
    torque: 855,
    acceleration: 4.6,
    topSpeed: 250,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 145000,
    imageUrl: '/images/cars/mercedes-eqs580-2025.jpg',
    description: 'Mercedes-Benz EQS 580 - Luxury electric sedan',
    isVisible: true,
  },
  {
    _id: 'bmw_i7_2025',
    brand: 'BMW',
    model: 'i7 2025',
    year: 2025,
    horsepower: 536,
    torque: 749,
    acceleration: 4.6,
    topSpeed: 250,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Sedan',
    price: 140000,
    imageUrl: '/images/cars/bmw-i7-2025.jpg',
    description: 'BMW i7 - Electric luxury flagship',
    isVisible: true,
  },
  {
    _id: 'audi_etron_gt_2025',
    brand: 'Audi',
    model: 'e-tron GT 2025',
    year: 2025,
    horsepower: 912,
    torque: 1050,
    acceleration: 3.4,
    topSpeed: 245,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'Coupe',
    price: 155000,
    imageUrl: '/images/cars/audi-e-tron-gt-2025.jpg',
    description: 'Audi e-tron GT - Electric performance coupe',
    isVisible: true,
  },
  {
    _id: 'hyundai_ioniq5n_2025',
    brand: 'Hyundai',
    model: 'Ioniq 5 N 2025',
    year: 2025,
    horsepower: 641,
    torque: 740,
    acceleration: 3.5,
    topSpeed: 260,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 70000,
    imageUrl: '/images/cars/hyundai-ioniq5n-2025.jpg',
    description: 'Hyundai Ioniq 5 N - Performance electric crossover',
    isVisible: true,
  },
  {
    _id: 'kia_ev9_2025',
    brand: 'Kia',
    model: 'EV9 2025',
    year: 2025,
    horsepower: 541,
    torque: 700,
    acceleration: 4.7,
    topSpeed: 200,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 80000,
    imageUrl: '/images/cars/kia-ev9-2025.jpg',
    description: 'Kia EV9 - Three-row electric SUV',
    isVisible: true,
  },
  {
    _id: 'volvo_ex90_2025',
    brand: 'Volvo',
    model: 'EX90 2025',
    year: 2025,
    horsepower: 510,
    torque: 910,
    acceleration: 4.9,
    topSpeed: 200,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 85000,
    imageUrl: '/images/cars/volvo-ex90-2025.jpg',
    description: 'Volvo EX90 - Scandinavian electric luxury',
    isVisible: true,
  },
  {
    _id: 'rivian_r1s_2025',
    brand: 'Rivian',
    model: 'R1S 2025',
    year: 2025,
    horsepower: 850,
    torque: 1025,
    acceleration: 3.0,
    topSpeed: 225,
    fuelType: 'Electric',
    drivetrain: '4WD',
    category: 'SUV',
    price: 75000,
    imageUrl: '/images/cars/rivian-r1s-2025.jpg',
    description: 'Rivian R1S - Adventure-ready electric SUV',
    isVisible: true,
  },
  {
    _id: 'byd_seal_2025',
    brand: 'BYD',
    model: 'Seal 2025',
    year: 2025,
    horsepower: 420,
    torque: 500,
    acceleration: 5.9,
    topSpeed: 180,
    fuelType: 'Electric',
    drivetrain: 'FWD',
    category: 'Sedan',
    price: 45000,
    imageUrl: '/images/cars/byd-seal-2025.jpg',
    description: 'BYD Seal - Affordable electric sedan',
    isVisible: true,
  },
  {
    _id: 'polestar_4_2025',
    brand: 'Polestar',
    model: '4 2025',
    year: 2025,
    horsepower: 402,
    torque: 630,
    acceleration: 4.2,
    topSpeed: 210,
    fuelType: 'Electric',
    drivetrain: 'AWD',
    category: 'SUV',
    price: 72000,
    imageUrl: '/images/cars/polestar-4-2025.jpg',
    description: 'Polestar 4 - Electric coupe SUV',
    isVisible: true,
  },
  // Mainstream Cars
  {
    _id: 'toyota_corolla_2025',
    brand: 'Toyota',
    model: 'Corolla 2025',
    year: 2025,
    horsepower: 168,
    torque: 203,
    acceleration: 8.2,
    topSpeed: 190,
    fuelType: 'Petrol',
    drivetrain: 'FWD',
    category: 'Sedan',
    price: 28000,
    imageUrl: '/images/cars/toyota-corolla-2025.jpg',
    description: 'Toyota Corolla - Reliable daily driver',
    isVisible: true,
  },
  {
    _id: 'toyota_yaris_2025',
    brand: 'Toyota',
    model: 'Yaris 2025',
    year: 2025,
    horsepower: 120,
    torque: 145,
    acceleration: 9.6,
    topSpeed: 180,
    fuelType: 'Petrol',
    drivetrain: 'FWD',
    category: 'Hatchback',
    price: 18000,
    imageUrl: '/images/cars/toyota-yaris-2025.jpg',
    description: 'Toyota Yaris - Compact city car',
    isVisible: true,
  },
  {
    _id: 'hyundai_elantra_2025',
    brand: 'Hyundai',
    model: 'Elantra 2025',
    year: 2025,
    horsepower: 147,
    torque: 179,
    acceleration: 8.9,
    topSpeed: 190,
    fuelType: 'Petrol',
    drivetrain: 'FWD',
    category: 'Sedan',
    price: 25000,
    imageUrl: '/images/cars/hyundai-elantra-2025.jpg',
    description: 'Hyundai Elantra - Affordable sedan',
    isVisible: true,
  },
  {
    _id: 'hyundai_tucson_2025',
    brand: 'Hyundai',
    model: 'Tucson 2025',
    year: 2025,
    horsepower: 187,
    torque: 241,
    acceleration: 8.5,
    topSpeed: 190,
    fuelType: 'Petrol',
    drivetrain: 'FWD',
    category: 'SUV',
    price: 32000,
    imageUrl: '/images/cars/hyundai-tucson-2025.jpg',
    description: 'Hyundai Tucson - Popular compact SUV',
    isVisible: true,
  },
  {
    _id: 'kia_sportage_2025',
    brand: 'Kia',
    model: 'Sportage 2025',
    year: 2025,
    horsepower: 187,
    torque: 241,
    acceleration: 8.0,
    topSpeed: 190,
    fuelType: 'Petrol',
    drivetrain: 'FWD',
    category: 'SUV',
    price: 30000,
    imageUrl: '/images/cars/kia-sportage-2025.jpg',
    description: 'Kia Sportage - Stylish SUV value',
    isVisible: true,
  },
];

export const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCars, setFilteredCars] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        console.log('🔄 Fetching cars from API...');
        const response = await carService.getAllCars();
        console.log('✅ Cars fetched:', response.data);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          setCars(response.data);
          const uniqueBrands = ['All', ...new Set(response.data.map((c) => c.brand))];
          setBrands(uniqueBrands);
          setFilteredCars(response.data);
          setError(null);
        } else {
          throw new Error('No cars in response');
        }
      } catch (err) {
        console.log('⚠️ API failed, using default cars:', err.message);
        setCars(DEFAULT_CARS);
        const uniqueBrands = ['All', ...new Set(DEFAULT_CARS.map((c) => c.brand))];
        setBrands(uniqueBrands);
        setFilteredCars(DEFAULT_CARS);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (selectedBrand === 'All') {
      setFilteredCars(cars);
    } else {
      setFilteredCars(cars.filter((car) => car.brand === selectedBrand));
    }
  }, [selectedBrand, cars]);

  return (
    <PageTransition>
      <Navigation />
      <Header
        title="Car Catalog"
        subtitle="Browse and customize premium vehicles"
      />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-8 sm:py-12">
        <div className="mb-6 sm:mb-8 flex gap-2 sm:gap-4 overflow-x-auto pb-4 -mx-2 sm:mx-0 px-2 sm:px-0">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3 sm:px-6 py-2 rounded-lg font-semibold transition whitespace-nowrap text-sm sm:text-base ${
                selectedBrand === brand
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-900 text-gray-300 hover:bg-gray-800'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12 sm:py-16">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 mt-4 text-sm sm:text-base">Loading cars...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 sm:py-16">
            <p className="text-red-600 font-semibold text-sm sm:text-base">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCars.map((car, idx) => (
              <AnimatedCard key={car._id} delay={idx * 0.1}>
                <Link
                  to={`/car-detail?carId=${car._id}`}
                  className="block group cursor-pointer h-full"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden group-hover:opacity-90 transition">
                    {car.imageUrl ? (
                      <img
                        src={car.imageUrl}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="text-center">
                        <Wrench className="w-8 sm:w-12 h-8 sm:h-12 text-gray-600 mx-auto mb-2" />
                        <p className="text-gray-500 text-xs sm:text-sm">No image available</p>
                      </div>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2 group-hover:text-red-600 transition line-clamp-2">
                    {car.brand} {car.model}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">{car.year}</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
                    <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
                      <Zap className="w-3 sm:w-4 h-3 sm:h-4 text-red-600 mb-0.5 sm:mb-1" />
                      <p className="text-gray-400 text-[10px] sm:text-xs">Horsepower</p>
                      <p className="text-white font-bold text-xs sm:text-sm">{car.horsepower} HP</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
                      <Gauge className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600 mb-0.5 sm:mb-1" />
                      <p className="text-gray-400 text-[10px] sm:text-xs">Top Speed</p>
                      <p className="text-white font-bold text-xs sm:text-sm">{car.topSpeed} km/h</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
                      <Fuel className="w-3 sm:w-4 h-3 sm:h-4 text-orange-600 mb-0.5 sm:mb-1" />
                      <p className="text-gray-400 text-[10px] sm:text-xs">Fuel Type</p>
                      <p className="text-white font-bold text-xs sm:text-sm">{car.fuelType}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
                      <Wrench className="w-3 sm:w-4 h-3 sm:h-4 text-gray-400 mb-0.5 sm:mb-1" />
                      <p className="text-gray-400 text-[10px] sm:text-xs">0-100 km/h</p>
                      <p className="text-white font-bold text-xs sm:text-sm">{typeof car.acceleration === 'number' ? car.acceleration.toFixed(1) : (parseFloat(car.acceleration) || 0).toFixed(1)}s</p>
                    </div>
                  </div>
                </Link>
                <Link
                  to={`/configurator?carId=${car._id}`}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 sm:py-2.5 rounded-lg font-semibold transition text-center block text-xs sm:text-sm"
                >
                  Customize
                </Link>
              </AnimatedCard>
            ))}
          </div>
        )}

        {filteredCars.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-400 text-base sm:text-lg">No cars found in this category</p>
          </div>
        )}
      </div>

      <Footer />
    </PageTransition>
  );
};
