export const themes = {
    light: {
      name: 'Light',
      colors: {
        background: 'bg-gradient-to-br from-blue-50 to-purple-50',
        surface: 'bg-white',
        surfaceSecondary: 'bg-gray-50',
        text: 'text-gray-900',
        textSecondary: 'text-gray-600',
        textMuted: 'text-gray-400',
        border: 'border-gray-200',
        borderSecondary: 'border-gray-100',
        primary: 'bg-blue-500 hover:bg-blue-600',
        primaryText: 'text-blue-600',
        secondary: 'bg-gray-100 hover:bg-gray-200',
        accent: 'bg-purple-500',
        success: 'bg-green-500',
        warning: 'bg-yellow-500',
        error: 'bg-red-500',
        avatar: {
          background: 'bg-gradient-to-br from-blue-100 to-purple-100',
          border: 'border-blue-200',
        },
        button: {
          primary: 'bg-blue-500 hover:bg-blue-600 text-white',
          secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
          disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed',
        },
        input: {
          background: 'bg-white',
          border: 'border-gray-300 focus:border-blue-500',
          text: 'text-gray-900',
          placeholder: 'text-gray-400',
        },
      },
      shadows: {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
      borderRadius: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
  
    dark: {
      name: 'Dark',
      colors: {
        background: 'bg-gradient-to-br from-gray-900 to-gray-800',
        surface: 'bg-gray-800',
        surfaceSecondary: 'bg-gray-700',
        text: 'text-white',
        textSecondary: 'text-gray-300',
        textMuted: 'text-gray-500',
        border: 'border-gray-600',
        borderSecondary: 'border-gray-700',
        primary: 'bg-blue-400 hover:bg-blue-500',
        primaryText: 'text-blue-400',
        secondary: 'bg-gray-700 hover:bg-gray-600',
        accent: 'bg-purple-400',
        success: 'bg-green-400',
        warning: 'bg-yellow-400',
        error: 'bg-red-400',
        avatar: {
          background: 'bg-gradient-to-br from-gray-700 to-gray-600',
          border: 'border-gray-500',
        },
        button: {
          primary: 'bg-blue-500 hover:bg-blue-600 text-white',
          secondary: 'bg-gray-600 hover:bg-gray-700 text-gray-200',
          disabled: 'bg-gray-700 text-gray-500 cursor-not-allowed',
        },
        input: {
          background: 'bg-gray-700',
          border: 'border-gray-600 focus:border-blue-400',
          text: 'text-white',
          placeholder: 'text-gray-400',
        },
      },
      shadows: {
        sm: 'shadow-sm shadow-black/20',
        md: 'shadow-md shadow-black/30',
        lg: 'shadow-lg shadow-black/40',
        xl: 'shadow-xl shadow-black/50',
      },
      borderRadius: {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      },
    },
  
    elderly: {
      name: 'Elderly-Friendly',
      colors: {
        background: 'bg-gradient-to-br from-yellow-50 to-orange-50',
        surface: 'bg-white',
        surfaceSecondary: 'bg-yellow-50',
        text: 'text-gray-900',
        textSecondary: 'text-gray-700',
        textMuted: 'text-gray-500',
        border: 'border-yellow-200',
        borderSecondary: 'border-yellow-100',
        primary: 'bg-orange-500 hover:bg-orange-600',
        primaryText: 'text-orange-600',
        secondary: 'bg-yellow-100 hover:bg-yellow-200',
        accent: 'bg-yellow-500',
        success: 'bg-green-500',
        warning: 'bg-orange-500',
        error: 'bg-red-500',
        avatar: {
          background: 'bg-gradient-to-br from-yellow-100 to-orange-100',
          border: 'border-orange-200',
        },
        button: {
          primary: 'bg-orange-500 hover:bg-orange-600 text-white text-lg font-semibold',
          secondary: 'bg-yellow-200 hover:bg-yellow-300 text-orange-800 text-lg font-semibold',
          disabled: 'bg-gray-200 text-gray-400 cursor-not-allowed text-lg',
        },
        input: {
          background: 'bg-white',
          border: 'border-yellow-300 focus:border-orange-500 border-2',
          text: 'text-gray-900 text-lg',
          placeholder: 'text-gray-400 text-lg',
        },
      },
      shadows: {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
      borderRadius: {
        sm: 'rounded-md',
        md: 'rounded-lg',
        lg: 'rounded-xl',
        xl: 'rounded-2xl',
        full: 'rounded-full',
      },
      // Elderly-friendly overrides
      fontSize: {
        xs: 'text-sm',
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
      },
      spacing: {
        button: 'px-6 py-4', // Larger touch targets
        input: 'px-4 py-3',  // Larger input fields
      },
    },
  }
  
  export type ThemeType = keyof typeof themes
  export const defaultTheme: ThemeType = 'elderly'