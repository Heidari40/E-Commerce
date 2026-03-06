'use client';

import { PulseLoader } from 'react-spinners';

type ComponentLevelLoaderProps = {
    text: string;
    color: string;
    loading: boolean;
    size: number;
}

export default function ComponentLevelLoader({ text, color, loading, size }: ComponentLevelLoaderProps) {
    return (
        <span>
            {text}
            <PulseLoader
                color={color}
                loading={loading}
                size={size || 10}
                data-testid="loader"
            />
        </span>
    )

};