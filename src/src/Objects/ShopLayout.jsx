import { useState } from 'react'
import { SpawnersConfig } from '../EnviromentPresets/SpawnersConfig';
import { ProductSpawner } from './HelperObjects/ProductSpawner';

export const ShopLayout = () => {
    return (
        <group name='Spawners'>
            {SpawnersConfig.map((config, index) => (
                <ProductSpawner key={index} spawnerConfig={config} />
            ))}
        </group>
    )
}