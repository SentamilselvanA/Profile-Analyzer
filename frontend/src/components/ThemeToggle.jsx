import { useTheme } from '../context/ThemeContext';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200 transform hover:scale-105"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      ) : (
        <MoonIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
      )}
    </button>
  );
};

export default ThemeToggle;