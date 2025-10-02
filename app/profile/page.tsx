use client
import type React from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutDashboard, ShoppingCart, CreditCard, Users, BookOpen } from 'lucide-react'
// import { geistSans } from '../fonts' 


