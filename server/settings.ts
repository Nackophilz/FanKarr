import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'settings.json')

export interface Settings {
    mediaPath     : string   // dossier Jellyfin destination ex: /media/Kai
    completePath  : string   // dossier qB complétion ex: /downloads/complete
    organizeMode  : 'hardlink' | 'move'
    category      : string   // catégorie qBittorrent
}

const defaults: Settings = {
    mediaPath    : '/media/Kai',
    completePath : '/downloads/complete',
    organizeMode : 'hardlink',
    category     : 'fankai',
}

export function readSettings(): Settings {
    try {
        if (!fs.existsSync(DATA_PATH)) return { ...defaults }
        return { ...defaults, ...JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8')) }
    } catch { return { ...defaults } }
}

export function writeSettings(settings: Partial<Settings>): Settings {
    const current = readSettings()
    const updated = { ...current, ...settings }
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
    fs.writeFileSync(DATA_PATH, JSON.stringify(updated, null, 2))
    return updated
}