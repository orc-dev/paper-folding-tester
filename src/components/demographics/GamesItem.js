import { useState } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { useTestContext } from '../TestContext';


const gameOptions = [
    { id: 0, label: 'First-Person Shooters (FPS)', value: 'FPS', tooltip: 'e.g., Call of Duty, Valorant' },
    { id: 1, label: 'Racing/Driving', value: 'Racing', tooltip: 'e.g., Mario Kart, Forza Horizon' },
    { id: 2, label: 'Real-Time Strategy (RTS)', value: 'RTS', tooltip: 'e.g., StarCraft, Age of Empires' },
    { id: 3, label: 'Simulation/Builder', value: 'Sim', tooltip: 'e.g., Minecraft, The Sims' },
    { id: 4, label: 'Board Strategy Games (Chess, Go, etc.)', value: 'BoardGames', tooltip: 'e.g., Chess, Go, Shogi, Xiangqi' },
    { id: 5, label: 'Platformers', value: 'Platformer', tooltip: 'e.g., Super Mario, Celeste' },
    { id: 6, label: 'MOBA', value: 'MOBA', tooltip: 'e.g., League of Legends, Dota 2' },
    { id: 7, label: 'Puzzle Games', value: 'Puzzle', tooltip: 'e.g., Tetris, Portal' },
    { id: 8, label: 'MMO (Massively Multiplayer Online)', value: 'MMO', tooltip: 'e.g., World of Warcraft, Guild Wars 2' },
    { id: 9, label: 'RPG (Role-Playing Games)', value: 'RPG', tooltip: 'e.g., Skyrim, Zelda' },
    { id: 10, label: 'Casual/Mobile Games', value: 'Casual', tooltip: 'e.g., Candy Crush, Clash of Clans' },
    { id: 11, label: 'None of the Above', value: 'None', tooltip: 'I do not play games or none of the listed types apply' },
];

function GamesItem({styles, updateAt}) {
    const { metaData } = useTestContext();
    const [gameType, setGameType] = useState([]);
    const prompt = 'What types of games do you play? (Select all that apply)';

    const checkbox_s = {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '8px',
        marginTop: '12px',
    }
    const tooltip_s = { root: { whiteSpace: 'nowrap', maxWidth: 'none' } };

    const handleOnChange = (checked) => {
        const sorted = [...checked].sort((a, b) => a - b);
        setGameType(sorted);
        metaData.current.games = sorted.join(';');
        updateAt(4, checked.length > 0);
    };

    const renderGameOption = (opt) => {
        const isEmpty = !gameType?.length;
        const noa = gameType?.includes(11);
        const is11 = (opt.id === 11);
        const xor = (noa ^ is11);

        return (
            <Tooltip
                key={opt.value}
                title={opt.tooltip}
                placement='right'
                styles={tooltip_s}
            >
                <div>
                    <Checkbox value={opt.id} disabled={!isEmpty && xor}>
                        {opt.label}
                    </Checkbox>
                </div>
            </Tooltip>
        );
    };


    return (
        <div style={styles.field}>
            <label style={styles.label}>{prompt}</label>
            <Checkbox.Group
                value={gameType}
                onChange={checked => handleOnChange(checked)}
                style={checkbox_s}
            >
                {gameOptions.map(opt => renderGameOption(opt))}
            </Checkbox.Group>
        </div>
    );
}

export default GamesItem;
