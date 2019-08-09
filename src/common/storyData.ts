/**
 * @author       Cover group <info@cover3d.com>
 * @copyright    2019 Cover group
 * @license      MIT License
 */ 

export interface StoryData {
    accessImage: string,
    accessQuestion: string,
    image?: string,
    text?: string,
    health?: number,
    money?: number,
    days?: number,
    sceneKey?: string,
    multidrugResistantTuberculosis?: boolean,
    children?: number[]
}

export interface StoryDynamicScene {
    index: number
}

export interface StoryDataArray extends Array<StoryData> {}
