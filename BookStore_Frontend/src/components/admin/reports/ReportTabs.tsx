import type { LucideProps } from 'lucide-react';

interface Tab {
    id: string;
    label: string;
    icon: React.FC<LucideProps>;
    color: string;
}

interface ReportTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function ReportTabs({ tabs, activeTab, onTabChange }: ReportTabsProps) {
    return (
        <div className="card overflow-hidden p-2">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {tabs.map((tab, index) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                            relative flex flex-col items-center justify-center gap-2 px-6 py-4 
                            rounded-xl font-semibold transition-smooth hover-scale
                            ${isActive
                                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                            animate-fadeInUp
                        `}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-smooth
                            ${isActive
                                    ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                                    : 'bg-gray-200 dark:bg-gray-600'
                                }
                        `}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm text-center">
                                {tab.label}
                            </span>

                            {/* Active indicator */}
                            {isActive && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-t-full animate-fadeIn"></div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}