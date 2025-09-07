import { h } from 'vue'
import type { IconSet, IconProps } from 'vuetify'

interface CustomIconProps extends IconProps {
  size?: number | string
  color?: string
}

export const mdSymbols: IconSet = {
  component: (props: CustomIconProps) => {
    let iconName = typeof props.icon === 'string' ? props.icon : ''
    let fillValue = 1
    if (iconName.endsWith('_outlined')) {
      iconName = iconName.replace('_outlined', '')
      fillValue = 0
    }

    return h(
      'span',
      {
        class: 'material-symbols-outlined',
        style: {
          fontVariationSettings: `'FILL' ${fillValue}, 'wght' 400, 'GRAD' 0, 'opsz' ${props.size || 24}`,
          fontSize: props.size ? `${props.size}px` : undefined,
          color: props.color,
        },
      },
      iconName,
    )
  },
}
