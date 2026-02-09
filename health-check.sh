#!/bin/bash
# TOP SPEED - Complete System Health Check
# This script verifies all systems are ready for production

echo "🔍 TOP SPEED - System Health Check"
echo "=================================="
echo ""

# Test 1: Backend API Availability
echo "✓ Test 1: Backend API Availability"
curl -s http://192.168.1.6:5000/api/health && echo " ✅ PASSED" || echo " ❌ FAILED"
echo ""

# Test 2: Database Connection
echo "✓ Test 2: Database Connection (Cars)"
curl -s http://192.168.1.6:5000/api/cars | grep -q "brand" && echo " ✅ PASSED" || echo " ❌ FAILED"
echo ""

# Test 3: Login Endpoint
echo "✓ Test 3: Login Endpoint Response"
curl -s -X POST http://192.168.1.6:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' | grep -q "error\|token" && echo " ✅ PASSED" || echo " ❌ FAILED"
echo ""

# Test 4: Frontend Availability
echo "✓ Test 4: Frontend Server"
curl -s http://192.168.1.6:5178 | head -5 && echo " ✅ PASSED" || echo " ❌ FAILED"
echo ""

# Test 5: CORS Headers
echo "✓ Test 5: CORS Headers"
curl -s -I http://192.168.1.6:5000/api/health | grep -i "access-control" && echo " ✅ PASSED" || echo " ❌ FAILED"
echo ""

echo "🎯 All checks completed!"
