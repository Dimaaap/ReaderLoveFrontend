import { Switch } from './Switch'

export const SettingsSection = ({ title, items, settings, onUpdate, className="" }) => {
  return (
    <div className={`rounded-2xl border border-zinc-700 bg-[#14113] p-6 ${ className }`}>
        <h2 className="text-2xl font-semibold mb-6">{ title }</h2>

        { items.map((item) => (
            <div key={ item.key } className="flex justify-between items-center py-4 border-b border-zinc-800 last:border-0
            hover:opacity-80 transition-all duration-250">
                <div>
                    <div>{ item.title }</div>
                    <div className="text-sm text-zinc-500">{ item.description }</div>
                </div>
                <Switch
                    checked={ !!settings?.[item.key] }
                    onChange={ (value) => onUpdate(item.key, value) }
                />
            </div>
        )) }
    </div>
  )
}
