import * as React from "react"
import { colors } from "src/colors"

interface Props {
  color: colors
  size: number
}

export default React.memo(function CoinHalfFull({ size, color }: Props) {
  return (
    <svg width={size * 0.88} height={size} viewBox="0 0 12 15" fill="none">
      <path
        d="M0.694644 8.03832L0.694854 8.03733C1.11106 6.0762 2.01314 4.31934 3.15316 2.97222C4.29262 1.62577 5.67668 0.756708 6.97518 0.535182L6.99246 0.532234L7.00949 0.528084C7.08947 0.50859 7.14342 0.507067 7.2886 0.507067H7.30252L7.31641 0.506293C8.43398 0.444037 9.44602 0.844847 10.2113 1.6515C11.3029 2.84313 11.7636 4.74522 11.3503 6.96114L11.3497 6.96425C11.0041 8.88501 10.1393 10.6528 8.99112 11.9944C7.84052 13.3387 6.43203 14.226 5.00847 14.4498C3.7403 14.6396 2.60967 14.2904 1.79643 13.4367L1.79645 13.4366L1.79296 13.433C0.645198 12.252 0.211033 10.2946 0.694644 8.03832Z"
        stroke={color}
      />
      <path
        d="M0.205748 7.93311H11.6464C10.6896 11.5534 7.99538 14.4869 5.08425 14.9436C3.67491 15.155 2.37395 14.7675 1.43439 13.7811C0.133461 12.4424 -0.300169 10.2934 0.205748 7.93311Z"
        fill={color}
      />
    </svg>
  )
})
