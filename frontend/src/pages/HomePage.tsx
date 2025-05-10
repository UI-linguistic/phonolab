// src/pages/HomePage.tsx
import React from 'react'
import { SectionTitle, SectionSubtitle } from '@components/ui/LayoutPrimitives'
import { LinkButton } from '@components/navigation'
import PageContainer from '@components/ui/PageContainer'
import MenuLayout from '@components/ui/MenuPresets'
import { MenuList } from '@components/ui/Menu'
import { CircleWrapper } from '@components/components.styles'
import HomeIllustration from '@assets/images/home_brain-mouth.png'
import Hero from '@components/ui/HeroSection'


export default function HomePage() {
  return (
    <>
      <Hero.HomeHero />
    </>
  );
}