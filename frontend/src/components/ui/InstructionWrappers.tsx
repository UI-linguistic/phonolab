import React from 'react'
import { InstructionBox } from './InstructionBox'
import { Text } from '@components/typography/PageTypography'
import { Cell } from '@components/display'

export function Vowels101Instructions() {
    return (
        <>
            <InstructionBox variant="transparent"> </InstructionBox>
            <InstructionBox variant="transparent" textProps={{ variant: 'layoutInstruction', weight: 'bold' }}>
                Vowels are distinguished by the part of the tongue used to make the sound (
                <Text as="span" variant="layoutInstruction" color="secondaryAccent" weight="bold">
                    front to back
                </Text>
                )…
            </InstructionBox >


            <InstructionBox variant="transparent" textProps={{ variant: 'layoutInstruction', weight: 'bold' }}>
                And the placement of the tongue relative to the roof of the mouth (
                <Text as="span" variant="layoutInstruction" color="primary" weight="bold">
                    high to low
                </Text>
                ).
            </InstructionBox >

            <InstructionBox variant="transparent" textProps={{ variant: 'layoutInstruction', weight: 'bold' }}>
                <Text variant="layoutInstruction" weight="bold">Click </Text>
                <Text variant="layoutInstruction" weight="normal">
                    in the grid to hear it and learn how to place your tongue!
                </Text>
            </InstructionBox>
        </>
    )
}

export function VowelShuffleInstructions() {
    return (
        <>
            <InstructionBox variant="default" textProps={{ variant: 'instruction', weight: 'bold', align: 'center' }}>
                You will be shown the three vowel categories:
                <Text as="span" variant="instruction" color="secondaryAccent" align="center" weight="bold"> tongue position</Text>,
                <Text as="span" variant="instruction" color="secondaryAccent" align="center" weight="bold"> lip shape</Text>, and
                <Text as="span" variant="instruction" color="secondaryAccent" align="center" weight="bold"> length</Text>.
            </InstructionBox>

            <InstructionBox variant="default" textProps={{ variant: 'instruction', weight: 'bold', align: 'center' }}>
                However, the vowels are all out of order. Your job is to
                <Text as="span" variant="instruction" weight="bold"> sort</Text> the blocks.
            </InstructionBox>

            <InstructionBox variant="default" textProps={{ variant: 'instruction', weight: 'bold', align: 'center' }}>
                <Text as="span" variant="instruction" color="accent" weight="bold">Drag</Text> the vowel blocks to their correct positions.
            </InstructionBox>

            <InstructionBox variant="default" textProps={{ variant: 'instruction', weight: 'bold', align: 'center' }}>
                Press <Text as="span" variant="instruction" color="primary" weight="bold">Submit</Text> to check your work.
            </InstructionBox>
        </>
    )
}


export function HomophonesInstructions() {
    return (
        <>
            {/* no border, no bg for the label */}
            <InstructionBox variant="transparent" textProps={{ variant: 'instruction' }}>
                Homophones share <Text as="span" weight="bold">sound.</Text>
            </InstructionBox>

            {/* two example boxes with border+bg */}
            <InstructionBox variant="default" textProps={{ variant: 'label' }}>
                blue {/* or a <VowelCard word="blue"/> */}
            </InstructionBox>
            <InstructionBox variant="default" textProps={{ variant: 'label' }}>
                blew
            </InstructionBox>

            {/* footer */}
            <InstructionBox variant="transparent" textProps={{ variant: 'caption', color: 'textSubtle' }}>
                Click to hear vowel sounds!
            </InstructionBox>
        </>
    )
}


export function PhonicTrioInstructions() {
    const base = { variant: 'instruction', weight: 'bold' } as const

    return (
        <>
            <InstructionBox variant="default" textProps={base}>
                You will be shown a target <Text as="span" color="primary" decoration="underline">vowel sound</Text> and <Text as="span" decoration="underline">English word</Text> that uses it.
            </InstructionBox>

            <InstructionBox variant="default" textProps={base}>
                Your task is to choose the <Text as="span" color="secondaryAccent" decoration="underline">three</Text> words in other languages that use the same vowel <Text as="span" decoration="underline">by ear</Text>.
            </InstructionBox>

            <InstructionBox variant="default" textProps={base}>
                You only have <Text as="span" color="secondaryAccent" decoration="underline">five seconds</Text> to make a selection, so pay careful attention!
            </InstructionBox>

            <InstructionBox variant="default" textProps={base}>
                Turn up your audio and watch the numbers associated with each word closely!
            </InstructionBox>
        </>
    )
}
